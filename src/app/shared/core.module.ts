import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../../environments/environment';

/*
import { httpInterceptorProviders } from './http-interceptors';
import { LocalStorageService } from './local-storage/local-storage.service';
import { AuthEffects } from './auth/auth.effects';
import { AuthGuardService } from './auth/auth-guard.service';
import { AnimationsService } from './animations/animations.service';
import { TitleService } from './title/title.service';
import { reducers, metaReducers } from './core.state';
import { AppErrorHandler } from './error-handler/app-error-handler.service';
import { CustomSerializer } from './router/custom-serializer';
import { NotificationService } from './notifications/notification.service';
import { GoogleAnalyticsEffects } from './google-analytics/google-analytics.effects';
*/

@NgModule({
    imports: [
        // angular
        CommonModule,
        HttpClientModule,

        // ngxs
        NgxsModule.forRoot([], { developmentMode: !environment.production }),
        environment.production
            ? []
            : [NgxsReduxDevtoolsPluginModule.forRoot(),
            NgxsLoggerPluginModule.forRoot()],
        // 3rd party
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    declarations: [],
    providers: [
        /*
            NotificationService,
            LocalStorageService,
            AuthGuardService,
            AnimationsService,
            httpInterceptorProviders,
            TitleService,
        */
        //     { provide: ErrorHandler, useClass: AppErrorHandler },
        //     { provide: RouterStateSerializer, useClass: CustomSerializer }
    ],
    exports: [TranslateModule]
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
    return new TranslateHttpLoader(
        http,
        `${environment.i18nPrefix}/assets/i18n/`,
        '.json'
    );
}
