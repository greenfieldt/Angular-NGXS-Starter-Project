import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(private store: Store) { }

    //example auth guard
    canActivate(): Observable<boolean> {
        return this.store.select(state => state.auth.isAuthenticated);
    }
}
