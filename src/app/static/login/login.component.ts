import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { tap, take, filter, debounceTime } from 'rxjs/operators'

import { Store, Select } from '@ngxs/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations';
import { EmailLogin } from 'src/app/shared/state/auth.actions';
import { MatDialog } from '@angular/material';

export interface LoginForm {
    email: string;
    password: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
    @Select(state => state.auth.isAuthenticated) isAuthenticated$: Observable<boolean>;

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    loginFailed = false;
    loginErrorMessage = "";

    constructor(private fb: FormBuilder,
        private matDialog: MatDialog,
        private store: Store,
        private changeDetRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.isAuthenticated$.pipe(
            filter(x => !!x),
            tap((x) => {

                //do something here if login works
                this.matDialog.closeAll();

            }),
            take(1),
        ).subscribe();
    }

    save() {
        this.store.dispatch(
            new EmailLogin(this.form.get('email').value,
                this.form.get('password').value,
                ((err: any) => {
                    console.log(err);
                    this.loginErrorMessage = err.message;
                    this.loginFailed = true;
                    this.changeDetRef.detectChanges();

                    timer(5000).pipe(
                        tap(_ => {
                            this.loginErrorMessage = '';
                            this.loginFailed = false;
                            this.changeDetRef.detectChanges();
                        }),
                        take(1)
                    ).subscribe();
                })
            ));
    }


    reset() {
        this.matDialog.closeAll();
    }
}
