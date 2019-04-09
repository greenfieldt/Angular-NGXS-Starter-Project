import { Inject, Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, PLATFORM_ID } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { themes } from '../../shared/state/settings.state'
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators'
import { ChangeTheme } from '../../shared/state/setting.actions';
import { NotificationService } from '../../shared/notifications/notification.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { isPlatformBrowser } from '@angular/common';



@Component({
    selector: 'increate-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeComponent implements OnInit {
    @ViewChild('belowTheFold') btf: ElementRef;


    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;



    constructor(private apollo: Apollo,
        private store: Store,
        private notification: NotificationService,
        @Inject(PLATFORM_ID) private platformId) {



    }


    public loadScript() {
        if (isPlatformBrowser(this.platformId)) {

            let body = <HTMLDivElement>document.body;
            let script = document.createElement('script');
            script.innerHTML = '';
            script.src = 'assets/news-app-dcfdf98018818e301e7c.js';
            script.async = true;
            script.defer = true;
            body.appendChild(script);
        }
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {

            //this.loadScript();
            //console.log("btf:", this.btf);
            //var child = document.createElement('<news-source> </news-source>');
            //this.btf.nativeElement.append(child);
        }
    }

}
