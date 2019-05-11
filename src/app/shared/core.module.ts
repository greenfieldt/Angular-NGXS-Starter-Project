import { Inject, NgModule, Optional, SkipSelf, ErrorHandler, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';

import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../../environments/environment';

import { SettingState } from './state/settings.state';
import { AuthState } from './state/auth.state';
import { ContactsState } from './state/contacts.state';
import { SocialState } from './state/social.state';

import { NotificationService } from './notifications/notification.service';
import { HttpErrorInterceptor } from './http-interceptors/http-error-interceptor.service';
import { AppErrorHandler } from './error-handler/app-error-handler.service';
import { AnimationService } from './animations/animation.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { TitleService } from './title/title.service';
import { SEOService } from './seo/seo.service';
import { UniversalInterceptor } from './http-interceptors/universal-interceptor.service';
import { AppShellNoRenderDirective } from './ssr/app-shell-no-render';
import { AppShellRenderDirective } from './ssr/app-shell-render';



import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UsersState } from './state/users.state';
import { SpinnerService } from './spinner/spinner.service';

@NgModule({
    imports: [
        // angular
        CommonModule,
        HttpClientModule,

        //firebase
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,



        // ngxs
        NgxsModule.forRoot([SettingState, AuthState, UsersState, ContactsState, SocialState], { developmentMode: !environment.production }),
        environment.production
            ? []
            : [NgxsReduxDevtoolsPluginModule.forRoot(),
            NgxsLoggerPluginModule.forRoot(), NgxsRouterPluginModule.forRoot()],
        NgxsStoragePluginModule.forRoot({ key: ['settings', 'auth'] }),
        // 3rd party
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    declarations: [AppShellNoRenderDirective, AppShellRenderDirective],
    providers: [
        NotificationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UniversalInterceptor,
            multi: true
        },

        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        AnimationService,
        AuthGuardService,
        TitleService,
        SEOService,
        SpinnerService,
        { provide: ErrorHandler, useClass: AppErrorHandler },
    ],
    exports: [TranslateModule, AppShellNoRenderDirective, AppShellRenderDirective]
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule
    ) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }
}

export function HttpLoaderFactory(http: HttpClient) {

    //see the Universalinterceptor to understand how
    //urls are being updated during prerender
    //and ssr to continue working
    return new TranslateHttpLoader(
        http,
        `${environment.i18nPrefix}/assets/i18n/`,
        '.json'
    );
}

