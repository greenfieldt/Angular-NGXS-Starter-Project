import { State, Action, StateContext, Selector, Store } from '@ngxs/store';

import { Navigate } from '@ngxs/router-plugin';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
    AuthenticateFaceBook,
    PostToFacebook,
    UpdateSocialAccounts,
    ConnectFaceBook,
    SelectFaceBookPage
} from './social.actions';
import { DbService } from '../firestore/db.service';
import { produce } from 'immer';
import { FacebookService } from '../social/facebook.service';


export class FBUserDetails {
    fb_uid?: string;
    pages?: [string];
    selected_page?: string;
    createdAt: any;
}

export class FBAccount extends FBUserDetails {
    authenticated: boolean;
}


export class SocialStateModel {
    fbaccount: FBAccount;
}


@State<SocialStateModel>({
    name: 'social',
    defaults: {
        fbaccount: {
            fb_uid: '',
            authenticated: false,
            createdAt: '',
            pages: [''],
            selected_page: ''
        }
    }
})
export class SocialState {
    sub: Subscription = new Subscription();
    me$: Observable<any>;
    myUID = '';

    constructor(private db: DbService, private fbService: FacebookService, private store: Store) {

        this.sub.add(this.db.collection$('social/facebook/public/').pipe(
            tap((x: any) => {
                this.store.dispatch(new UpdateSocialAccounts(x));
            })
        ).subscribe());

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

    ngOnDestory() {
        this.sub.unsubscribe();
    }

    @Action(UpdateSocialAccounts)
    updateSocialAccounts({ setState }: StateContext<SocialStateModel>,
        action: UpdateSocialAccounts) {
        //set the state to the server state
        const x: FBAccount = { ...action.payload };
        setState({ fbaccount: x[0] });
    }



    @Action(AuthenticateFaceBook)
    authenticateFaceBook({ setState }: StateContext<SocialStateModel>,
        action: ConnectFaceBook) {
        const timestamp = this.db.getTimestamp();

        const fbinfo: FBAccount = {
            fb_uid: '',
            selected_page: '',
            pages: [''],
            authenticated: false,
            createdAt: timestamp
        };

        //first we will update some default info
        this.db.updateAt(`social/facebook/public/data`, fbinfo);

        //Then we call into our social service to authenticate our FBapp with
        //the super admin's account
        this.fbService.authenticate(this.myUID).then((x) => {
            //no-op
        }).catch((x) => {
            let result = { name: "Facebook Server Error", code: 500, message: x };

            if (action.errorCallback)
                action.errorCallback(result);
        });

    }

    @Action(ConnectFaceBook)
    connectFaceBook({ setState }: StateContext<SocialStateModel>,
        action: ConnectFaceBook) {
        const fbinfo = { fb_uid: action.payload, selected_page: '', pages: [] };

        //first we will update fbuid field and clear the pages array
        this.db.updateAt(`social/facebook/public/data`, fbinfo);

        //Let's ask for the business pages that this user manages
        //this.store.dispatch(new GetPagesFacebook(action.payload));
        this.fbService.accounts(action.payload).then((x) => {
            //no-op
        }).catch((x) => {
            let result = { name: "Facebook Server Error", code: 500, message: "UID Invalid" };

            if (action.errorCallback)
                action.errorCallback(result);
        });
    }


    @Action(PostToFacebook)
    postToFacebook({ setState }: StateContext<SocialStateModel>,
        action: PostToFacebook) {
        this.fbService.post(action.payload.message, action.payload.dataurl);
    }

    @Action(SelectFaceBookPage)
    selectFaceBookPage(ctx: StateContext<SocialStateModel>,
        action: SelectFaceBookPage) {
        this.db.updateAt(`social/facebook/public/data`, { selected_page: action.payload });
    }

}
