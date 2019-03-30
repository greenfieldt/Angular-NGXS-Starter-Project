import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { themes } from '../../shared/state/settings.state'
import { Observable } from 'rxjs';
import { ChangeTheme } from 'src/app/shared/state/setting.actions';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'

@Component({
    selector: 'increate-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;


    themes = themes;

    @Select(state => state.settings.theme) theme$: Observable<string>;

    constructor(private store: Store, private notification: NotificationService) { }

    ngOnInit() {
    }

    onThemeSelect($event) {
        this.store.dispatch(new ChangeTheme($event.value));
        this.notification.info("Theme Changed");
    }

}
