import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout } from './auth.actions'


export class AuthStateModel {
    token?: string;
    username?: string;
    isAuthenticated: boolean;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        isAuthenticated: false
    }
})
export class AuthState {

    @Selector()
    static token(state: AuthStateModel) { return state.token; }

    constructor() { }

    @Action(Login)
    login({ patchState }: StateContext<AuthStateModel>, { payload }: Login) {
        patchState({ token: payload.username, username: payload.username, isAuthenticated: true });
    }

    @Action(Logout)
    logout({ setState, getState }: StateContext<AuthStateModel>) {
        setState({ token: null, username: null, isAuthenticated: false });
    }

}
