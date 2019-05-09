import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'

@Component({
    selector: 'app-playing-with-tech',
    templateUrl: './playing-with-tech.component.html',
    styleUrls: ['./playing-with-tech.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayingWithTechComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

    constructor() { }
    public loadScript() {
        let body = <HTMLDivElement>document.body;
        let script = document.createElement('script');
        script.innerHTML = '';
        script.src = 'assets/news-app-696119f1e6af3575acfc.js';
        script.async = true;
        script.defer = true;
        body.appendChild(script);
    }

    ngOnInit() {
        this.loadScript();
    }

}
