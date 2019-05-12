import { Contact } from './contacts.state';

export class InitializeContacts {
    static readonly type = '[Contacts] Initialize Contacts';
    constructor() { }
}

export class AddContact {
    static readonly type = '[Contacts] Add Contact';
    constructor(public payload: Contact) { }
}

export class UpdateContact {
    static readonly type = '[Contacts] Update Contact';
    constructor(public payload: Contact) { }
}

export class DeleteProcessedContact {
    static readonly type = '[Contact] Delete Processed Contact';
    constructor(public uid: Contact) { }
}

export class UpdateContacts {
    static readonly type = '[Contacts] Update Contacts';
    constructor(public payload: Contact[]) { }
}
