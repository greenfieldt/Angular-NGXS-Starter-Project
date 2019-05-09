import { FBAccount, FBUserDetails } from './social.state';


export class AuthenticateFaceBook {
    static readonly type = '[Social] Authenticate to Facebook';
    constructor(public errorCallback?: ({ }) => void) { }
}

export class ConnectFaceBook {
    static readonly type = '[Social] Connect FBUID to Facebook';
    constructor(public payload: string,
        public errorCallback?: ({ }) => void) { }
}

export class SelectFaceBookPage {
    static readonly type = '[Social] Select Facebook Page ID';
    constructor(public payload: string) { }
}


export class PostToFacebook {
    static readonly type = '[Social] Post to Facebook';
    constructor(public payload: { message: string, dataurl: Blob },
        public errorCallback?: ({ }) => void) { }
}

export class UpdateSocialAccounts {
    static readonly type = '[Social] Fetched Social Account Info from Firebase';
    constructor(public payload: FBAccount) { }
}
