import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { Language } from './shared/state/settings.state';
import { ChangeLanguage } from './shared/state/setting.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    logo = '../assets/logo.png';

    constructor(private store: Store) {
    }
    //@Select(state => state.auth.isAugthenticated) isAuthenticated$: Observable<boolean>;
    @Select(state => state.settings.stickyHeader) stickyHeader$: Observable<boolean>;
    @Select(state => state.settings.language) language$: Observable<string>;
    @Select(state => state.settings.theme) theme$: Observable<string>;

    ngOnInit() {

        //init the internationalization
        //you can find the app strings in assets/i18n/en.json
        this.language$.pipe(
            tap((x: Language) => {
                this.store.dispatch(new ChangeLanguage(x));
            }),
            take(1)
        ).subscribe();
    }


}
