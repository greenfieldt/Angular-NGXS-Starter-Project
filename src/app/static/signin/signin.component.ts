import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable, timer, Subscription } from 'rxjs';
import { tap, take, filter, debounceTime } from 'rxjs/operators'

import { Store, Select } from '@ngxs/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations';
import { EmailLogin, EmailCreateUser, EmailSignInLink } from 'src/app/shared/state/auth.actions';
import { MatDialog } from '@angular/material';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { SpinnerOverlayRef, SpinnerDefaultConfig } from 'src/app/shared/spinner/spinner.overlay';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';

export interface LoginForm {
    email: string;
    name: string;
}

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class SigninComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
    sub: Subscription = new Subscription();
    form = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
    });

    spinnerRef: SpinnerOverlayRef;

    signinFailed = false;
    signinErrorMessage = "";

    constructor(private fb: FormBuilder,
        private matDialog: MatDialog,
        private spinner: SpinnerService,
        private notification: NotificationService,
        private store: Store,
        private changeDetRef: ChangeDetectorRef) { }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    save() {
        //This will take some back and forth with the server so let's start
        //a spinner which we will stop when we get the password complete
        //state or encounter an error
        let config = SpinnerDefaultConfig;
        config.defaultTimeOut = undefined;
        this.spinnerRef = this.spinner.open(config);

        this.store.dispatch(
            new EmailSignInLink(this.form.get('email').value,
                this.form.get('name').value,
                ((err: any) => {
                    if (this.spinnerRef)
                        this.spinnerRef.close();

                    this.signinErrorMessage = err.message;
                    this.signinFailed = true;
                    this.changeDetRef.detectChanges();

                    timer(5000).pipe(
                        tap(_ => {
                            this.signinErrorMessage = '';
                            this.signinFailed = false;
                            this.changeDetRef.detectChanges();
                        }),
                        take(1)
                    ).subscribe();
                })
            ));

        this.sub.add(this.store.select(state => state.auth.partialEmailSignUp).pipe(
            filter((x) => !!x), //we may get a null if we have old state and need to clear it
            tap((x) => {
                if (this.spinnerRef)
                    this.spinnerRef.close();
                this.notification.success("Check Your Email!");
                this.close();
            }),
            take(1),
        ).subscribe());

    }

    close() {
        this.matDialog.closeAll();
    }


}
