//I think this will mess up SSR so I'll have to rethink it
//at a later point
import browser from 'browser-detect';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { Language, languages } from './shared/state/settings.state';
import {
    ChangeLanguage,
    ChangePageAnimationsDisabled,
    ChangeTheme,
    ChangeStickyHeader
} from './shared/state/setting.actions';

import { Login, Logout } from './shared/state/auth.actions';

import { Navigate } from '@ngxs/router-plugin';
import { MatSelectChange } from '@angular/material';


@Component({
    selector: 'increate-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    logo = '../assets/logo.png';
    //creating a member var for settings.state.languages const 
    languages = languages;

    constructor(private store: Store) {
    }
    @Select(state => state.auth.isAuthenticated) isAuthenticated$: Observable<boolean>;
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


        //disable the page animation on some browsers
        this.store.dispatch(
            new ChangePageAnimationsDisabled(AppComponent.isIEorEdgeOrSafari()));

        this.store.dispatch(new ChangeTheme("dark-theme"));

        this.store.dispatch(new ChangeStickyHeader(false));

        this.store.dispatch(new Navigate(['/home']))


    }

    private static isIEorEdgeOrSafari() {
        return ['ie', 'edge', 'safari'].includes(browser().name);
    }


    onLanguageSelect($event: MatSelectChange) {
        this.store.dispatch(new ChangeLanguage($event.value));

    }

    onLoginClick($event) {
        this.store.dispatch(new Login({ username: 'greenfit', password: 'password' }));
    }

    onLogoutClick() {
        this.store.dispatch(new Logout());

    }

}
