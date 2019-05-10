import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { tap, take, filter, debounceTime } from 'rxjs/operators'
import { Store } from '@ngxs/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'
import { MatDialog } from '@angular/material';
import { EmailContinueSignInLink } from 'src/app/shared/state/auth.actions';
import { Router } from '@angular/router';


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


    setPasswordFailed = false;
    setPasswordErrorMessage = "";

    constructor(private fb: FormBuilder,
        private matDialog: MatDialog,
        private store: Store,
		private router: Router,
        private changeDetRef: ChangeDetectorRef) { }

    ngOnInit() {
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
                new EmailContinueSignInLink(this.form.get('password').value,
                    this.router.url,
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


    reset() {
        this.matDialog.closeAll();
    }

}
