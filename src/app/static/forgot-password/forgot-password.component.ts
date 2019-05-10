import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, timer } from 'rxjs';
import { tap, take, filter, debounceTime } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations';
import { Store } from '@ngxs/store';
import { EmailLoginResetPassword } from 'src/app/shared/state/auth.actions';


export interface PasswordResetForm {
    email: string;
}


@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ForgotPasswordComponent implements OnInit {
    loginFailed = false;
    loginErrorMessage = "";
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
    });


    constructor(private fb: FormBuilder,
        private matDialog: MatDialog,
        private store: Store,
        private changeDetRef: ChangeDetectorRef) { }

    ngOnInit() {
    }

    resetPassword() {
        this.store.dispatch(
            new EmailLoginResetPassword(this.form.get('email').value,
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


    close() {
        this.matDialog.closeAll();
    }
}

