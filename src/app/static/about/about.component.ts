import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'


@Component({
    selector: 'AngularAdvisors-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

    constructor() { }

    public loadScript() {
        let body = <HTMLDivElement>document.body;
        let script = document.createElement('script');
        script.innerHTML = '';
        script.src = 'assets/news-app-dcfdf98018818e301e7c.js';
        script.async = true;
        script.defer = true;
        body.appendChild(script);
    }

    ngOnInit() {
        this.loadScript();
    }

}
