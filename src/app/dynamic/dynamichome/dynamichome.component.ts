import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { routeAnimations } from 'src/app/shared/animations/route.animations';


@Component({
    selector: 'app-dynamichome',
    templateUrl: './dynamichome.component.html',
    styleUrls: ['./dynamichome.component.scss'],
    animations: [routeAnimations]
})
export class DynamicHomeComponent implements OnInit {
    @Select(state => state.auth.isAuthenticated) isAuthenticated$: Observable<boolean>;

    examples = [
        { link: 'blog/storybook.md', label: 'Storybook 101' },
        { link: 'blog/SBTutorial/master/tutorial.org', label: 'Custom Elements 101' },
    ];
    constructor() { }

    ngOnInit() {
    }

}
