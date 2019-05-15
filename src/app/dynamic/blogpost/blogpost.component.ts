import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-blogpost',
    templateUrl: './blogpost.component.html',
    styleUrls: ['./blogpost.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogpostComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
    private sub: Subscription = new Subscription();
    post: string;
    notFound: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private changeDetRef: ChangeDetectorRef) { }

    ngOnInit() {

        this.sub.add(this.activatedRoute.params.subscribe(params => {
            if (Object.keys(params).length === 1) {
                this.post = './assets/blogs/' + params['file'];
            }
            else {
                if (environment.production) {
                    this.post = 'https://raw.githubusercontent.com/greenfieldt/'
                        + params['repo'] + '/'
                        + params['branch'] + '/'
                        + params['file'];

                }
                else {
                    const nowString = Date.now().toString();
                    this.post = 'https://raw.githubusercontent.com/greenfieldt/'
                        + params['repo'] + '/'
                        + params['branch'] + '/'
                        + params['file'] +
                        '?' + nowString; //cache bust git-hub-raw
                }
            }
            this.changeDetRef.detectChanges();

        }));

    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    onError($event) {

    }

}
