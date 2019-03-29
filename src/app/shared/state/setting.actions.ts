import { Language } from './settings.state'


export class ChangeLanguage {
    static readonly type = '[Settings] Change the Language';
    constructor(public payload: Language) { }
}

export class ChangePageAnimationsDisabled {
    static readonly type = '[Settings] Change the Page Animation Disabled Boolean';
    constructor(public payload: boolean) { }
}

export class ChangeTheme {
    static readonly type = '[Settings] Change the Theme';
    constructor(public payload: string) { }
}
