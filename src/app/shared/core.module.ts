import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../../environments/environment';
import { SettingState } from './state/settings.state';
import { AuthState } from './state/auth.state';
import { NotificationService } from './notifications/notification.service';


@NgModule({
    imports: [
        // angular
        CommonModule,
        HttpClientModule,

        // ngxs
        NgxsModule.forRoot([SettingState, AuthState], { developmentMode: !environment.production }),
        environment.production
            ? []
            : [NgxsReduxDevtoolsPluginModule.forRoot(),
            NgxsLoggerPluginModule.forRoot()],
        NgxsRouterPluginModule.forRoot(),
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
        NotificationService
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
    return new TranslateHttpLoader(http);
}
/*
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(
        http,
        `${environment.i18nPrefix}/assets/i18n/`,
        '.json'
    );
}
*/
