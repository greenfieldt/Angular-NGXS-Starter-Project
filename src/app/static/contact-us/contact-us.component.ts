import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable, timer, Subscription } from 'rxjs';
import { tap, take, filter, debounceTime } from 'rxjs/operators'

import { Store, Select } from '@ngxs/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations';
import { EmailLogin, EmailCreateUser, EmailSignInLink } from '../../shared/state/auth.actions';
import { MatDialog } from '@angular/material';
import { NotificationService } from '../../shared/notifications/notification.service';
import { SpinnerOverlayRef, SpinnerDefaultConfig } from '../../shared/spinner/spinner.overlay';
import { SpinnerService } from '../../shared/spinner/spinner.service';


export interface LoginForm {
    email: string;
    name: string;
}

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ContactUsComponent implements OnInit {
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
    }

    close() {

    }
}
