import { UsersStateModel } from './users.state';
import { DBAuthStateModel } from './auth.state';

export class InitializeUsers {
    static readonly type = '[User] InitializeUsers';
    constructor() { }
}

export class RetreiveUsers {
    static readonly type = '[User] AddUsers';
    constructor(public users: DBAuthStateModel[]) { }
}

export class RemoveUser {
    static readonly type = '[Auth] Remove User';
    constructor(public uid: string,
        public errorCallback?: ({ }) => void
    ) { }
}


export class UpdateCUrentUserProfile {
    static readonly type = '[User] Update Curent User Profile';
    constructor(public payload: DBAuthStateModel) {}
}