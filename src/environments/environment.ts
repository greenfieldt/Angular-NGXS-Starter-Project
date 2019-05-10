// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { VERSION } from './version';


export const environment = {
    production: false,
    i18nPrefix: '',
    test: false,
    envName: 'DEV',
    appName: "Increate",
    continueURL: 'https://localhost:4200/user',
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
        app: VERSION.version,
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
