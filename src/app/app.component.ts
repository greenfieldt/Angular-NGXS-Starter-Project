import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private store: Store) {
    }
    title = 'Increate';
    isAuthenticated$: Observable<boolean>;
    stickyHeader$: Observable<boolean>;
    language$: Observable<string>;
    theme$: Observable<string>;


}
