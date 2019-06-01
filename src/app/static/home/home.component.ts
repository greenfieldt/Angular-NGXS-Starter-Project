import { Inject, Component, OnInit, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'


@Component({
    selector: 'increate-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeComponent implements OnInit {

    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;



    constructor() { }

    ngOnInit() {

    }

}
