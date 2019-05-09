import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { InitializeUsers, RetreiveUsers, RemoveUser, UpdateCUrentUserProfile } from './users.actions';
import { DbService } from '../firestore/db.service';


import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DBAuthStateModel } from './auth.state';
import { AdminService } from '../auth/admin.service';
import { Logout } from './auth.actions';
import { Navigate } from '@ngxs/router-plugin';




export class UsersStateModel {
    usersList: DBAuthStateModel[];
}

@State<UsersStateModel>({
    name: 'users',
    defaults: {
        usersList: [],
    }
})
export class UsersState {

    sub: Subscription = new Subscription();
    me$: Observable<any>;
    myUID = '';

    constructor(private db: DbService, private store: Store, private admin: AdminService) {

        this.me$ = this.store.select(state => state.auth).pipe(
            tap((x) => {
                if (!x)
                    this.myUID = '';
                else
                    this.myUID = x.uid
            }
            ));
        this.sub.add(this.me$.subscribe());
    }

    @Selector()
    static getUsers(state: UsersStateModel) {
        return state.usersList;
    }


    @Action(InitializeUsers)
    initializeUsers({ getState, patchState }: StateContext<UsersStateModel>) {

        this.sub.add(this.db.collection$('users').pipe(
            tap((users) => {
                this.store.dispatch(new RetreiveUsers(users as DBAuthStateModel[]))
            })
        ).subscribe());


    }


    @Action(RetreiveUsers)
    retreiveUsers({ patchState }: StateContext<UsersStateModel>,
        action: RetreiveUsers) {
        const users = action.users;
        patchState({
            usersList: users as DBAuthStateModel[],
        });
    }

    @Action(RemoveUser)
    async removeUser(ctx: StateContext<UsersStateModel>,
        action: RemoveUser) {
        const uid = action.uid;
        const logMySelfOut = this.myUID == uid;

        let result = await this.admin.removeUser(uid);

        if (result && result.code)
            if (action.errorCallback)
                action.errorCallback(result);

        await this.db.delete(`/users/${uid}`);

        //handle the case where we've deleted ourselves 
        if (logMySelfOut) {
            this.store.dispatch(new Logout());
            this.store.dispatch(new Navigate(['/']));
        }



    }

    @Action(UpdateCUrentUserProfile)
    UpdateCUrentUserProfile({setState}: StateContext<UsersStateModel>,
        action: UpdateCUrentUserProfile) {
        const uid = action.payload.uid;
        this.db.updateAt(`users/${uid}`, action.payload);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }


}
