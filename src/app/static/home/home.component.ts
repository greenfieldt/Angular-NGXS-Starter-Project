import { Inject, Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, PLATFORM_ID } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { themes } from '../../shared/state/settings.state'
import { ChangeTheme } from '../../shared/state/setting.actions';
import { NotificationService } from '../../shared/notifications/notification.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { isPlatformBrowser } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { take } from 'rxjs/operators'



function loadScript(deadline, scriptOnload?) {
    let body = <HTMLDivElement>document.body;
    //I'm not sure if is totally necessary to use a fragment
    //here since we are only adding one item?
    let fragment = document.createDocumentFragment();
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/news-app-696119f1e6af3575acfc.js';
    script.async = true;
    script.defer = true;

    script.onload = function () {
        if (scriptOnload)
            scriptOnload();
    };
    fragment.appendChild(script);
    body.appendChild(fragment);
}


//we are passing in a callback that allows us to do whatever we need to do
//when it is time to load the below the fold content 
function onIntersection(entries, onScriptLoaded) {
    entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.intersectionRatio > 0);
        if (entry.intersectionRatio > 0) {
            (window as any).requestIdleCallback((deadline) => loadScript(deadline, onScriptLoaded), { timeout: 1000 });
            // Stop watching 
            HomeComponent.observer.unobserve(entry.target);
        }
    });
}



@Component({
    selector: 'increate-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeComponent implements OnInit {
    @ViewChild('belowTheFold') btf: ElementRef;
    static observer: IntersectionObserver;


    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;



    constructor(private apollo: Apollo,
        private store: Store,
        private notification: NotificationService,
        @Inject(PLATFORM_ID) private platformId) {
        if (isPlatformBrowser(this.platformId)) {

            (window as any).requestIdleCallback = (window as any).requestIdleCallback || function (handler) {
                let startTime = Date.now();

                return setTimeout(function () {
                    handler({
                        didTimeout: false,
                        timeRemaining: function () {
                            return Math.max(0, 50.0 - (Date.now() - startTime));
                        }
                    });
                }, 1);
            };

            (window as any).cancelIdleCallback = (window as any).cancelIdleCallback || function (id) {
                clearTimeout(id);
            };
        }
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            let intersectionObserverOptions = {
                root: null,
                rootMargin: '150px',
                threshold: 1.0
            }

            HomeComponent.observer = new IntersectionObserver(
                (entries) => onIntersection(entries, () => this.attachBTF(this))
                , intersectionObserverOptions);
            HomeComponent.observer.observe(this.btf.nativeElement);

        }
    }


    public attachBTF(scoped_this) {

        let child = document.createElement('ce-news-grid');
        scoped_this.btf.nativeElement.append(child);
    }

}
