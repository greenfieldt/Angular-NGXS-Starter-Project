import { VERSION } from './version';
declare const require: any;
const packageJson = require('../../package.json');

export const environment = {
    production: true,
    i18nPrefix: '',
    test: false,
    envName: 'PROD',
    appName: "Increate Software LLC",
    continueURL: 'https://www.increatesoftware.com/home(modal:modal/setpassword)',
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
        ngrx: packageJson.dependencies['@ngrx/store'],
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
