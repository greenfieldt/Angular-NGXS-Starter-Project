import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { filter, debounceTime, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Store } from '@ngxs/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations';
import { NotificationService } from '../../shared/notifications/notification.service';
import { EmailLogin } from 'src/app/shared/state/auth.actions';

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

    form = this.fb.group({
        autosave: false,
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        description: [
            '',
            [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(1000)
            ]
        ],
        requestGift: [''],
        birthday: ['', [Validators.required]],
        rating: [0, Validators.required]
    });

    formValueChanges$: Observable<LoginForm>;

    constructor(private fb: FormBuilder,
        private store: Store,
        private translate: TranslateService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.formValueChanges$ = this.form.valueChanges.pipe(
            debounceTime(500),
            //            filter((form: LoginForm) => form.autosave)
        );
    }

    update(form: LoginForm) {

    }

    save() {

        this.store.dispatch(new EmailLogin('emailadress', 'password'));

    }

    reset() {
        this.form.reset();
        this.form.clearValidators();
        this.form.clearAsyncValidators();
        //this.store.dispatch(new ActionFormReset());
    }
}
