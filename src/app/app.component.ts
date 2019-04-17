import { Component, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, take, filter } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import * as checkBrowser from 'check-browser';
import { Language, languages } from './shared/state/settings.state';
import {
    ChangeLanguage,
    ChangePageAnimationsDisabled,
    ChangeTheme,
    ChangeStickyHeader,
    ChangeElementAnimations,
    ChangePageAnimations,
    InitializeSettings
} from './shared/state/setting.actions';

import { Login, Logout } from './shared/state/auth.actions';

import { MatSelectChange } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { routeAnimations } from './shared/animations/route.animations';
import { environment as env } from '../environments/environment'
import { SEOService } from './shared/seo/seo.service';
import { TitleService } from './shared/title/title.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'increate-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [routeAnimations],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    logo = '../assets/logo.png';
    //creating a member var for settings.state.languages const 
    languages = languages;
    version = env.versions.app;
    year = new Date().getFullYear();
    isProd = env.production;
    envName = env.envName;

    sub: Subscription = new Subscription();

    navigation = [
        { link: 'about', label: 'increate.menu.about' },
        { link: 'home', label: 'increate.menu.home' }
    ];

    navigationSideMenu = [
        ...this.navigation,
    ];


    constructor(private router: Router,
        private seo: SEOService,
        private title: TitleService,
        private store: Store,
        @Inject(PLATFORM_ID) private platformId) {
        /*
	  I have GA turned off in Index.html -- If you want to use it
	  you have to get an appid and uncomment the code there 
	  before you uncomment this code
                this.sub.add( = this.router.events.pipe(
                    filter(event => event instanceof NavigationEnd),
                    tap((event: NavigationEnd) => {
                        (<any>window).ga('set', 'page', event.urlAfterRedirects);
                        (<any>window).ga('send', 'pageview');
                    })
                ).subscribe());
        */
        this.sub.add(this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            tap((event: NavigationEnd) => {
                let description = "Angular SSR Description " + Date.now();
                this.seo.generateTags({ description: description })

                this.title.setTitle(
                    this.router.routerState.snapshot.root
                );

            })
        ).subscribe());

    }
    @Select(state => state.auth.isAuthenticated) isAuthenticated$: Observable<boolean>;
    @Select(state => state.settings.stickyHeader) stickyHeader$: Observable<boolean>;
    @Select(state => state.settings.language) language$: Observable<string>;
    @Select(state => state.settings.theme) theme$: Observable<string>;

    toKalendar() {
        document.getElementById("kalendar").scrollIntoView();
    }

    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }

    ngOnInit() {

        //this will initialize the theme and language from the last saved
        //state
        this.store.dispatch(new InitializeSettings());
        this.store.dispatch(new ChangeTheme('default-theme'));
        if (isPlatformBrowser(this.platformId)) {
            //disable the page animation on some browsers
            this.store.dispatch(
                new ChangePageAnimationsDisabled(AppComponent.isIEorEdgeOrSafari()));
            this.store.dispatch(new ChangeElementAnimations(true));
            this.store.dispatch(new ChangePageAnimations(true));
        }
        else {
            //disable the page animation on some browsers
            this.store.dispatch(
                new ChangePageAnimationsDisabled(true));
            this.store.dispatch(new ChangeElementAnimations(false));
            this.store.dispatch(new ChangePageAnimations(false));
        }

    }

    private static isIEorEdgeOrSafari() {
        return checkBrowser({
            msie: 1,
            edge: 1,
            safari: 1
        });
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
