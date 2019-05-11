import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Feature, features } from './feature.data';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations';


@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
    features: Feature[] = features;

    constructor() { }

    ngOnInit() {
    }

    openLink(link: string) {
        window.open(link, '_blank');
    }
}
