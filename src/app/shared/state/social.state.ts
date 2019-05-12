import { State, Action, StateContext, Selector, Store, Select } from '@ngxs/store';

import { Navigate } from '@ngxs/router-plugin';
import { Observable, Subscription, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

import {
    AuthenticateFaceBook,
    PostToFacebook,
    UpdateSocialAccounts,
    ConnectFaceBook,
    SelectFaceBookPage,
    InitializeSocialAccounts
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
    fbaccount?: FBAccount;
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

    //Who I am and role do I have
    me$: Observable<any>;
    myRole$: Observable<string>;
    myUID = '';

    constructor(private db: DbService, private fbService: FacebookService, private store: Store) {

    }

    ngOnDestory() {
        this.sub.unsubscribe();
    }

    @Action(InitializeSocialAccounts)
    initializeSocialAccounts({ setState }: StateContext<SocialStateModel>) {

        //Watch my role so I can turn off all the observables that won't
        //work due to backend database security unless you are an
        //admin
        this.myRole$ = this.store.select(state => state.auth).pipe(
            map((x) => {
                if (!x)
                    return 'none';
                else
                    return x.role;
            }
            ));

        this.sub.add(this.myRole$.pipe(
            switchMap((role) => {
                if (role === 'admin') {
                    return this.db.collection$('social/facebook/public/').pipe(
                        tap((x: any) => {
                            this.store.dispatch(new UpdateSocialAccounts(x));
                        }));
                }
                else {
                    const data: FBAccount = {
                        authenticated: false, pages: [''],
                        createdAt: ''
                    };
                    //clear out all the data we might have been showing before
                    setState({ fbaccount: null });
                    return of();
                }
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
