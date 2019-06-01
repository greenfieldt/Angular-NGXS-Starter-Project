import { Injectable, PLATFORM_ID, Inject, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NotificationService } from '../notifications/notification.service';
import { Observable, interval, of, concat, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { first, tap, map, switchMap } from 'rxjs/operators';




@Injectable({
    providedIn: 'root'
})
export class SWUpdateService {

    updateReady$: Observable<string>;
    sub: Subscription = new Subscription();

    constructor(private swUpdate: SwUpdate,
        @Inject(PLATFORM_ID) private platformID,
        appRef: ApplicationRef,
        private notiService: NotificationService) {
        if (isPlatformBrowser(this.platformID)) {
            // per Angular docs
            // Allow the app to stabilize first, before starting polling for updates with `interval()`.
            const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
            const everyTenMinutes$ = interval(10 * 60 * 1000);
            const everyTenMinutesOnceAppIsStable$ = concat(appIsStable$, everyTenMinutes$);

            everyTenMinutesOnceAppIsStable$.subscribe(() => this.swUpdate.checkForUpdate());

            this.sub.add(this.swUpdate.available.subscribe(event => {
                notiService.warn(`There is an updated version of this site.  Click the version number in the bottom right hand corner of the page!`);
            }));
        }

    }

    ngOnDestory() {
        this.sub.unsubscribe();
    }

    checkUpdate(): Observable<string> {
        if (isPlatformBrowser(this.platformID)) {
            return this.swUpdate.available.pipe(
                map(x => {
                    return x.available.hash;
                }));
        } else {
            of(null);
        }

    }

    forceUpdate() {
        if (isPlatformBrowser(this.platformID)) {
            this.swUpdate.activateUpdate()
                .then(() => document.location.reload())
        }
    }
}
