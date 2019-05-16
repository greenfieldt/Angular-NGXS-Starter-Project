import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../shared/animations/route.animations';


@Component({
    selector: 'app-dynamichome',
    templateUrl: './dynamichome.component.html',
    styleUrls: ['./dynamichome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimations]
})
export class DynamicHomeComponent implements OnInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

    @Select(state => state.auth.isAuthenticated) isAuthenticated$: Observable<boolean>;

    examples = [
        { link: 'blog/SBTutorial/master/tutorial.md', label: 'StoryBook 101' },
        { link: 'blog/SpinnerTutorial/master/tutorial.md', label: 'Spinners 101' },
        { link: 'blog/SBTutorial/CustomElements/CustomElements.md', label: 'Custom Elements: News Reader' },
        //        { link: 'pwt/customelements', label: 'Custom Elements: News Reader' }
    ];
    constructor() { }

    ngOnInit() {
    }

}
