import { State, Action, StateContext, Selector, Store } from '@ngxs/store';

import { Navigate } from '@ngxs/router-plugin';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AddContact, UpdateContacts, UpdateContact, DeleteProcessedContact } from './contacts.actions';
import { DbService } from '../firestore/db.service';
import { produce } from 'immer';


export class Contact {
    uid: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    createdAt?: any;
    processed: boolean = false;
}
export class ContactsStateModel {
    contacts: Contact[];
}


@State<ContactsStateModel>({
    name: 'contacts',
    defaults: {
        contacts: []
    }
})
export class ContactsState {
    sub: Subscription = new Subscription();

    @Selector()
    public static AllContacts(state: ContactsStateModel): Contact[] {
        //return all contacts with the un-replied ones on top
        return produce(state.contacts, (x) => {
            x.sort((a, b) => {
                if (a.processed && b.processed)
                    return 0;

                return a.processed < b.processed ? 1 : -1;
            });
        });
    }

    @Selector()
    public static UnProcessedContacts(state: ContactsStateModel): Contact[] {
        return produce(state.contacts, (x) => {
            return x.filter((a) => {
                return !a.processed;
            });
        });
    }

    @Selector()
    public static ProcessedContacts(state: ContactsStateModel): Contact[] {
        return produce(state.contacts, (x) => {
            return x.filter((a) => {
                return a.processed;
            });
        });
    }


    constructor(private db: DbService, private store: Store) {
        this.sub.add(this.db.collection$('contacts').pipe(
            tap((x: any) => {
                this.store.dispatch(new UpdateContacts(x));
            })
        ).subscribe());
    }

    ngOnDestory() {
        this.sub.unsubscribe();
    }

    @Action(AddContact)
    addContact({ setState }: StateContext<ContactsStateModel>,
        action: AddContact) {
        const uid = this.db.createUID();
        const timestamp = this.db.getTimestamp();
        const contact: Contact = { ...action.payload, uid: uid, createdAt: timestamp, processed: false };

        this.db.updateAt(`contacts/${uid}`, contact);
    }

    @Action(UpdateContact)
    UpdateContact({ setState }: StateContext<ContactsStateModel>,
        action: UpdateContact) {
        const uid = action.payload.uid;
        //we are going to update to firestore
        //and then wait for our observable to get the round trip
        //data since this isn't a very time sensitive operation
        this.db.updateAt(`contacts/${uid}`, action.payload);
    }

    @Action(DeleteProcessedContact)
    DeleteProcessedContact({ setState }: StateContext<ContactsStateModel>, action: DeleteProcessedContact) {
        const uid = action.uid;
        this.db.delete(`contacts/${uid}`);
    }


    @Action(UpdateContacts)
    UpdateContacts({ setState }: StateContext<ContactsStateModel>,
        action: UpdateContacts) {
        setState({ contacts: action.payload });
    }

}
