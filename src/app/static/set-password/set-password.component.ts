import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Observable, timer, Subscription } from 'rxjs';
import { tap, take, filter, debounceTime } from 'rxjs/operators'
import { Store } from '@ngxs/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'
import { MatDialog } from '@angular/material';
import { EmailContinueSignInLink } from 'src/app/shared/state/auth.actions';
import { Router } from '@angular/router';
import { PartialEmailSignUp } from 'src/app/shared/state/auth.state';
import { NotificationService } from 'src/app/shared/notifications/notification.service';


export interface LoginForm {
    name: string;
    email: string;
    password: string;
    password2: string;
}

@Component({
    selector: 'app-set-password',
    templateUrl: './set-password.component.html',
    styleUrls: ['./set-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetPasswordComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

    form = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        password2: ['', [Validators.required]]
    });

    sub: Subscription = new Subscription();


    setPasswordFailed = false;
    setPasswordErrorMessage = "";

    constructor(private fb: FormBuilder,
        private matDialog: MatDialog,
        private store: Store,
        private notification: NotificationService,
        private router: Router,
        private changeDetRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.sub.add(this.store.select(state => state.auth.partialEmailSignUp).pipe(
            tap((x: PartialEmailSignUp) => {

                if (x.state === 'EmailedSignInLink') {
                    this.form.get('name').setValue(x.name);
                    this.form.get('email').setValue(x.email);
                }
                else if (x.state === 'AccountCreated') {
                    //if I had a spinner I could spinner it right here
                }
                else if (x.state === 'PasswordSet') {
                    this.notification.success("Account Created!");
                    this.close();
                }
            }),
        ).subscribe());

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    save() {
        if (this.form.get('password').value != this.form.get('password2').value) {
            this.setPasswordErrorMessage = "Passwords Don't Match";
            this.setPasswordFailed = true;
            this.changeDetRef.detectChanges();

            timer(5000).pipe(
                tap(_ => {
                    this.setPasswordErrorMessage = '';
                    this.setPasswordFailed = false;
                    this.changeDetRef.detectChanges();
                }),
                take(1)
            ).subscribe();

        }
        else {
            this.store.dispatch(
                //EmailContinuesigninlink uses the email and name from the form
                //and not the one stored in state because whether those values
                //will actually be there is use case dependent.  They probably will
                //if you are signing yourself up but if you are in an admin use case
                //and entering someone else's email address they won't be there
                new EmailContinueSignInLink(this.form.get('password').value,
                    this.router.url,
                    this.form.get('email').value,
                    this.form.get('name').value,
                    ((err: any) => {
                        console.log(err);
                        this.setPasswordErrorMessage = err.message;
                        this.setPasswordFailed = true;
                        this.changeDetRef.detectChanges();

                        timer(5000).pipe(
                            tap(_ => {
                                this.setPasswordErrorMessage = '';
                                this.setPasswordFailed = false;
                                this.changeDetRef.detectChanges();
                            }),
                            take(1)
                        ).subscribe();
                    })
                ));


        }
    }


    close() {
        this.matDialog.closeAll();
    }

}
