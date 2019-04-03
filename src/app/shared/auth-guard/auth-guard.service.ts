import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, pipe } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { take, tap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(private store: Store, private notification: NotificationService) { }

    //example auth guard
    canActivate(): Observable<boolean> {
        let ca = this.store.select(state => state.auth.isAuthenticated);
        ca.pipe(
            tap((x) => {
                if (x == false) {
                    console.log("sending notification");
                    this.notification.warn("You must be logged in to access this page!");
                }
            }),
            take(1)
        ).subscribe();
        return ca;
    }
}
