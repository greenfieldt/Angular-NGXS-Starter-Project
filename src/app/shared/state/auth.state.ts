import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Login, Logout, UpdateLoggedInUser, EmailLogin, EmailLoginResetPassword, EmailSignInLink, EmailCreateUser, EmailContinueSignInLink } from './auth.actions'
import { AuthService } from '../auth/auth.service'

import { Navigate } from '@ngxs/router-plugin';
import { Observable, timer, Subscription } from 'rxjs';
import { first, map, mergeMap, filter, tap } from 'rxjs/operators';
import { UsersStateModel } from './users.state';
import produce from 'immer';

export type PartialEmailSignUpState =
    'EmailedSignInLink' |
    'AccountCreated' |
    'PasswordSet';


export class PartialEmailSignUp {
    name: string;
    email: string;
    date: string;
    state: PartialEmailSignUpState;
}

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
    partialEmailSignUp?: PartialEmailSignUp;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        isAuthenticated: false,
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
    updateLoggedInUser(ctx: StateContext<AuthStateModel>,
        action: UpdateLoggedInUser) {
        const pesu = ctx.getState().partialEmailSignUp;
        if (pesu) {
            ctx.setState({ ...action.payload, partialEmailSignUp: pesu });
        }
        else {
            ctx.setState(action.payload);
        }
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
        //since this is the first step in the email sign flow we need to clear
        //out any old Partialemailsignup state
        ctx.patchState({ partialEmailSignUp: null });


        //we are asking firebase to email a signin link to someone
        let result = await this.authService.emailSignInLink(action.email);
        if (result && result.code) {
            if (action.errorCallback)
                action.errorCallback(result);
        }
        else {
            //set the Partialemailsignup state
            const pesu: PartialEmailSignUp = {
                name: action.name,
                email: action.email,
                date: Date.now().toString(),
                state: 'EmailedSignInLink'
            };
            ctx.patchState({ partialEmailSignUp: pesu });
        }
    }

    @Action(EmailContinueSignInLink)
    async emailContinueSignInLink(ctx: StateContext<AuthStateModel>,
        action: EmailContinueSignInLink) {
        let result = await this.authService.emailContinueSignInLink(action.href, action.email, action.name);
        if (result && result.code) {
            if (action.errorCallback)
                action.errorCallback(result);
        }
        else {
            //it worked so let's set the password
            //set the Partialemailsignup state

            const pesu =
                produce(ctx.getState().partialEmailSignUp, (x) => {
                    x.state = 'AccountCreated';
                });

            ctx.patchState({ partialEmailSignUp: pesu });

            result = await this.authService.emailContinueSignInLinkSetPassword(action.password);

            if (result && result.code) {
                if (action.errorCallback)
                    action.errorCallback(result);
            }
            else {
                //set the Partialemailsignup state
                const pesu =
                    produce(ctx.getState().partialEmailSignUp, (x) => {
                        x.state = 'PasswordSet';
                    });
                ctx.patchState({ partialEmailSignUp: pesu });
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
