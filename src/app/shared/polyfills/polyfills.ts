import * as checkBrowser from 'check-browser';
let evergreenBrowser = checkBrowser({
    chrome: 49,
    firefox: 52,
    edge: 14,
    safari: 10
});

declare var System: any;

/** Import basic polyfills required by Angular itself */
import './polyfills.basic';

/** Import optional polyfills to target browsers */
if (!evergreenBrowser) {
    System.import('./polyfills.target');
}
