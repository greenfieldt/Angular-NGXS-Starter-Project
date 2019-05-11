// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { VERSION } from './version';
declare const require: any;
const packageJson = require('../../package.json');


export const environment = {
    production: false,
    i18nPrefix: '',
    test: false,
    envName: 'DEV',
    appName: "Increate",
    continueURL: 'https://localhost:4200/home(modal:modal/setpassword)',
    dynamicLinkDomain: 'IncreateSoftware.page.link',
    firebaseFunctionURL: 'https://us-central1-increatesoftware.cloudfunctions.net/',
    firebase: {
        apiKey: "AIzaSyCmOc1iw5kJ-yNGqpL-cGxxbN0OmNIzAcw",
        authDomain: "increatesoftware.firebaseapp.com",
        databaseURL: "https://increatesoftware.firebaseio.com",
        projectId: "increatesoftware",
        storageBucket: "increatesoftware.appspot.com",
        messagingSenderId: "691343917758",
        appId: "1:691343917758:web:d52029d166330634"
    },

    versions: {
        app: packageJson.version,
        angular: packageJson.dependencies['@angular/core'],
        ngxs: packageJson.dependencies['@ngxs/store'],
        material: packageJson.dependencies['@angular/material'],
        bootstrap: packageJson.dependencies.bootstrap,
        rxjs: packageJson.dependencies.rxjs,
        ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
        fontAwesome:
            packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
        angularCli: packageJson.devDependencies['@angular/cli'],
        typescript: packageJson.devDependencies['typescript'],
        cypress: packageJson.devDependencies['cypress']
    }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
