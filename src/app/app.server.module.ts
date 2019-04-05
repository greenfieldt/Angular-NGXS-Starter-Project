import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { STORAGE_ENGINE } from '@ngxs/storage-plugin';

//import { LOCAL_STORAGE } from '@shared/local-storage.token';

import { LocalStoragePolyfill } from './shared/polyfills/local-storage-polyfill';


@NgModule({
    imports: [
        AppModule,
        ServerModule,
    ],
    providers: [
        // replaces NGXS storage engine on server
        // allows us to use localstorage plugin in coremodule
        { provide: STORAGE_ENGINE, useClass: LocalStoragePolyfill },

        // you can also create a token for yourself
        //{ provide: LOCAL_STORAGE, useClass: LocalStoragePolyfill }
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule { }
