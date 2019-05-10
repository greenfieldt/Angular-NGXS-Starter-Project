import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { tap, take, filter, debounceTime } from 'rxjs/operators'

import { Store, Select } from '@ngxs/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations';
import { EmailLogin, EmailCreateUser, EmailSignInLink } from 'src/app/shared/state/auth.actions';
import { MatDialog } from '@angular/material';

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

    form = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
    });

    signinFailed = false;
    signinErrorMessage = "";

    constructor(private fb: FormBuilder,
        private matDialog: MatDialog,
        private store: Store,
        private changeDetRef: ChangeDetectorRef) { }

    ngOnInit() {
    }
    save() {

        this.store.dispatch(
            new EmailSignInLink(this.form.get('email').value,
                ((err: any) => {
                    console.log(err);
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
        //we need to set something
        this.reset();
    }


    reset() {
        this.matDialog.closeAll();
    }

}
