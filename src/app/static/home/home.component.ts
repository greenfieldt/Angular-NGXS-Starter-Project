import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { themes } from '../../shared/state/settings.state'
import { Observable } from 'rxjs';
import { ChangeTheme } from '../../shared/state/setting.actions';
import { NotificationService } from '../../shared/notifications/notification.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'


@Component({
    selector: 'increate-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;


    themes = themes;

    @Select(state => state.settings.theme) theme$: Observable<string>;

    constructor(private store: Store, private notification: NotificationService) { }

    ngOnInit() {
        //console.log("Home ngOnInit");
    }

    onThemeSelect($event) {
        this.store.dispatch(new ChangeTheme($event.value));
        this.notification.info("Theme Changed");
    }

}
