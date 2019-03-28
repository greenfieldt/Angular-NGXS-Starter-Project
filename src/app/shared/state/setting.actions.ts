import { Language } from './settings.state'


export class ChangeLanguage {
    static readonly type = '[Settings] Change the Language';
    constructor(public payload: Language) { }
}
