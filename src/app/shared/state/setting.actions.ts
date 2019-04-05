import { Language, Theme } from './settings.state'

export class InitializeSettings {
    static readonly type = '[Settings] Initialize Settings';
    constructor() { }
}

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
    constructor(public payload: Theme) { }
}

export class ChangeStickyHeader {
    static readonly type = '[Settings] Change the StickyHeader Boolean';
    constructor(public payload: boolean) { }
}

export class ChangePageAnimations {
    static readonly type = '[Settings] Change the Page Animations Type';
    constructor(public payload: boolean) { }
}

export class ChangeElementAnimations {
    static readonly type = '[Settings] Change the Elements Animations Type';
    constructor(public payload: boolean) { }
}
