import { AuthStateModel } from './auth.state';

export class Login {
    static readonly type = '[Auth] Login (Google)';
    constructor(public nav: [string]) { }
}

export class EmailLogin {
    static readonly type = '[Auth] Email Login';
    constructor(public email: string,
        public password: string,
        public errorCallback?: ({ }) => void
    ) { }
}

export class EmailLoginResetPassword {
    static readonly type = '[Auth] Email Login ResetPassword';
    constructor(public email: string,
        public errorCallback?: ({ }) => void
    ) { }
}

export class EmailCreateUser {
    static readonly type = '[Auth] Email Create User';
    constructor(public email: string, public password: string,
        public errorCallback?: ({ }) => void
    ) { }
}

export class EmailSignInLink {
    static readonly type = '[Auth] Email Sign In Link';
    constructor(public email: string,
        public errorCallback?: ({ }) => void
    ) { }
}

export class EmailContinueSignInLink {
    static readonly type = '[Auth] Continue Email Sign In Link';
    constructor(public password: string, public href: string, public userCredintal: string,
        public errorCallback?: ({ }) => void
    ) { }
}


export class Logout {
    static readonly type = '[Auth] Logout';
}

export class UpdateLoggedInUser {
    static readonly type = '[Auth] Updated Logged In User';
    constructor(public payload: AuthStateModel) { }
}

