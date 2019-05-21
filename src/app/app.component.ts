import {
    Component,
    ChangeDetectionStrategy,
    Inject,
    AfterViewInit,
    PLATFORM_ID,
    ChangeDetectorRef
} from '@angular/core';
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

import { Login, Logout, EmailLogin } from './shared/state/auth.actions';

import { MatSelectChange, MatDialog } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { routeAnimations } from './shared/animations/route.animations';
import { environment as env } from '../environments/environment';
import { SEOService, DefaultMetaTags } from './shared/seo/seo.service';
import { TitleService } from './shared/title/title.service';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { themes } from './shared/state/settings.state';
import { NotificationService } from './shared/notifications/notification.service';
import { SpinnerService } from './shared/spinner/spinner.service';
import { SpinnerDefaultConfig } from './shared/spinner/spinner.overlay';



@Component({
    selector: 'increate-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [routeAnimations],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
    logo = '../assets/increate-logo.svg';
    //creating a member var for settings.state.languages const 
    languages = languages;
    version = env.versions.app;
    year = new Date().getFullYear();
    isProd = env.production;
    envName = env.envName;
    themes = themes;

    sub: Subscription = new Subscription();

    navigation = [
        { link: 'myhome', label: 'increate.menu.home' },
        { link: 'about', label: 'increate.menu.about' },
        { link: 'dynamic', label: 'increate.menu.dynamic' },

    ];

    navigationSideMenu = [
        ...this.navigation,
    ];


    constructor(private router: Router,
        private seo: SEOService,
        private title: TitleService,
        private notification: NotificationService,
        private store: Store,
        private dialog: MatDialog,
        private changDetRef: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId) {


        this.sub.add(this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            tap((event: NavigationEnd) => {
                let tags = DefaultMetaTags;
                //TODO: I'm relyng on the fact that I reset tags
                //well after the route ends (so that my custom changes
                //on the pages that have them call generateTags after
                //this guy.  
                //tags.description = tags.description + tags.timestamp();
                this.seo.generateTags(tags);

                this.title.setTitle(
                    this.router.routerState.snapshot.root
                );

            })
        ).subscribe());

    }
    @Select(state => state.auth.isAuthenticated) isAuthenticated$: Observable<boolean>;
    @Select(state => state.auth.displayName) displayName$: Observable<string>;
    @Select(state => state.settings.stickyHeader) stickyHeader$: Observable<boolean>;
    @Select(state => state.settings.language) language$: Observable<string>;
    @Select(state => state.settings.theme) theme$: Observable<string>;


    ngOnDestroy() {
        if (this.sub)
            this.sub.unsubscribe();
    }

    ngOnInit() {
        //this will initialize the theme and language from the last saved
        //state
        this.store.dispatch(new InitializeSettings());
        this.store.dispatch(new ChangeTheme('default-theme'));

        //disable the page animation on some browsers
        this.store.dispatch(
            new ChangePageAnimationsDisabled(true));
        this.store.dispatch(new ChangeElementAnimations(false));
        this.store.dispatch(new ChangePageAnimations(false));

    }

    ngAfterViewInit() {

        if (isPlatformBrowser(this.platformId)) {
            //disable the page animation on some browsers
            this.store.dispatch(
                new ChangePageAnimationsDisabled(AppComponent.isIEorEdgeOrSafari()));
            this.store.dispatch(new ChangeElementAnimations(true));
            this.store.dispatch(new ChangePageAnimations(true));


            this.sub.add(this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                tap((event: NavigationEnd) => {
                    (<any>window).ga('set', 'page', event.urlAfterRedirects);
                    (<any>window).ga('send', 'pageview');
                })
            ).subscribe());
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
        this.changDetRef.detectChanges();
    }

    onLoginClick($event) {
        this.router.navigate([{ outlets: { modal: 'modal/login' } }]);
    }

    onLogoutClick() {
        this.store.dispatch(new Logout());

    }

    onSettings() {
    }

    onThemeSelect(theme) {
        console.log(theme);
        this.store.dispatch(new ChangeTheme(theme));
        this.notification.info("Theme Changed");
    }


}
