import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './shared/core.module';

import { AppComponent } from './app.component';
import { StaticModule } from './static';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { DynamicModule } from './dynamic/dynamic.module';
import { LoginComponent } from './dynamic/login/login.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,

        SharedModule,
        CoreModule,

        StaticModule,

        AppRoutingModule,

        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

        GraphQLModule,

        HttpClientModule,

    ],
    entryComponents: [LoginComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
