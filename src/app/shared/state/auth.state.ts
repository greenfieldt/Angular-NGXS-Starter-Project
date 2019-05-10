import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Login, Logout, UpdateLoggedInUser, EmailLogin, EmailLoginResetPassword, EmailSignInLink, EmailCreateUser, EmailContinueSignInLink } from './auth.actions'
import { AuthService } from '../auth/auth.service'

import { Navigate } from '@ngxs/router-plugin';
import { Observable, timer, Subscription } from 'rxjs';
import { first, map, mergeMap, filter, tap } from 'rxjs/operators';
import { UsersStateModel } from './users.state';


export class DBAuthStateModel {
    token?: string;
    username?: string;
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    isAnonymous?: boolean;
}

export class AuthStateModel extends DBAuthStateModel {
    isAuthenticated: boolean;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        isAuthenticated: false
    }
})
export class AuthState {

    sub: Subscription = new Subscription();

    @Selector()
    static token(state: AuthStateModel) { return state.token; }

    constructor(private store: Store, private authService: AuthService) {
        this.sub.add(authService.user$.pipe(
            tap((x: AuthStateModel) => {
                if (x) {
                    this.store.dispatch(
                        new UpdateLoggedInUser({ ...x, isAuthenticated: true }));
                }
                else {
                    this.store.dispatch(
                        new UpdateLoggedInUser({ isAuthenticated: false }));
                }

            })
        ).subscribe());

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    @Action(UpdateLoggedInUser)
    updateLoggedInUser({ setState }: StateContext<AuthStateModel>,
        action: UpdateLoggedInUser) {
        setState(action.payload);
    }

    @Action(EmailCreateUser)
    async emailCreateUser(ctx: StateContext<AuthStateModel>,
        action: EmailCreateUser) {
        let result = await this.authService.emailCreateUser(action.email, action.password);
        if (result && result.code)
            if (action.errorCallback)
                action.errorCallback(result);
    }

    @Action(EmailSignInLink)
    async emailSignInLink(ctx: StateContext<AuthStateModel>,
        action: EmailSignInLink) {
        let result = await this.authService.emailSignInLink(action.email);
        if (result && result.code)
            if (action.errorCallback)
                action.errorCallback(result);
    }

    @Action(EmailContinueSignInLink)
    async emailContinueSignInLink(ctx: StateContext<AuthStateModel>,
        action: EmailContinueSignInLink) {
        let result = await this.authService.emailContinueSignInLink(action.href, action.userCredintal);
        if (result && result.code) {
            if (action.errorCallback)
                action.errorCallback(result);
        }
        else {
            //it worked so let's set the password

            result = await this.authService.emailContinueSignInLinkSetPassword(action.password);

            if (result && result.code) {
                if (action.errorCallback)
                    action.errorCallback(result);
            }
        }
    }





    @Action(EmailLoginResetPassword)
    async emailLoginResetPassword(ctx: StateContext<AuthStateModel>,
        action: EmailLoginResetPassword) {
        let result = await this.authService.emailResetPassword(action.email);
        if (result && result.code)
            if (action.errorCallback)
                action.errorCallback(result);
    }

    @Action(EmailLogin)
    async emailLogin(ctx: StateContext<AuthStateModel>, action: EmailLogin) {
        let a = ctx.getState().isAuthenticated;

        if (!a) {
            let result = await this.authService.emailLogin(action.email, action.password);
            if (result && result.code) {
                if (action.errorCallback)
                    action.errorCallback(result);

            }
        }
    }

    @Action(Login)
    async login(ctx: StateContext<AuthStateModel>) {

        let a = ctx.getState().isAuthenticated;

        if (!a) {
            await this.authService.googleLogin();
        }

    }

    @Action(Logout)
    async logout({ setState, getState }: StateContext<AuthStateModel>) {
        await this.authService.logOut();
        //clean out all the state
        setState({ isAuthenticated: false });
    }

}
