import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { themes } from '../../shared/state/settings.state'
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators'
import { ChangeTheme } from '../../shared/state/setting.actions';
import { NotificationService } from '../../shared/notifications/notification.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


export interface RatesQueryResponse {
    rates: Rate[];
}

type Rate = {
    currency: string;
    rate: number;
}

@Component({
    selector: 'increate-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;


    rates$: Observable<any[]>;
    loading$: Observable<boolean>;
    errors$: Observable<any>;

    themes = themes;


    @Select(state => state.settings.theme) theme$: Observable<string>;




    constructor(private apollo: Apollo,
        private store: Store,
        private notification: NotificationService) { }

    ngOnInit() {
        //console.log("Home ngOnInit");

        const source$ = this.apollo.query<RatesQueryResponse>({
            query: gql`
        {
          rates(currency: "USD") {
            currency
            rate
          }
        }
      `
        }).pipe(shareReplay(1));

        this.rates$ = source$.pipe(map((result) => result.data && result.data.rates));
        this.loading$ = source$.pipe(map(result => result.loading));
        this.errors$ = source$.pipe(map(result => result.errors));
    }

    onThemeSelect($event) {
        this.store.dispatch(new ChangeTheme($event.value));
        this.notification.info("Theme Changed");
    }

}
