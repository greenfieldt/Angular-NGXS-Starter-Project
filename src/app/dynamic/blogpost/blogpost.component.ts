import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'


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

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        this.sub.add(this.activatedRoute.params.subscribe(params => {
            if (Object.keys(params).length === 1) {
                this.post = './assets/blogs/' + params['file'];
            }
            else {
                this.post = 'https://raw.githubusercontent.com/greenfieldt/'
                    + params['repo'] + '/'
                    + params['branch'] + '/'
                    + params['file'];
            }
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
