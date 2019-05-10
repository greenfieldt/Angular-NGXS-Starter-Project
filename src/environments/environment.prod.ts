
import { VERSION } from './version';

export const environment = {
    production: true,
    i18nPrefix: '',
    test: false,
    envName: 'PROD',
    appName: "Increate Software LLC",
    continueURL: 'https://www.increatesoftware.com/user',
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
