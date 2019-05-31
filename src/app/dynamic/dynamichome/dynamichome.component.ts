import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../shared/animations/route.animations';
import { ViewEncapsulation } from '@angular/compiler/src/core';


@Component({
    selector: 'increate-dynamichome',
    templateUrl: './dynamichome.component.html',
    styleUrls: ['./dynamichome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimations]
})
export class DynamicHomeComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

    @Select(state => state.auth.isAuthenticated) isAuthenticated$: Observable<boolean>;

    examples = [
        { link: 'post/SBTutorial/master/tutorial.md', label: 'StoryBook 101' },
        { link: 'post/SpinnerTutorial/master/tutorial.md', label: 'CDK Overlay 101' },
        { link: 'post/SBTutorial/CustomElements/CustomElements.md', label: 'Custom Elements: News Reader' },
        { link: 'post/process/master/overview.md', label: 'The Process' },

        //        { link: 'pwt/customelements', label: 'Custom Elements: News Reader' }
    ];
    constructor() { }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

}
