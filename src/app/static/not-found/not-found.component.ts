import { Component, OnInit, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express/lib/router';

@Component({
    selector: 'increate-notfound',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

    constructor(@Inject(PLATFORM_ID) private platformId,
        @Optional() @Inject(RESPONSE) private response: Response) { }

    ngOnInit() {

        if (!isPlatformBrowser(this.platformId)) {
            this.response.status(404);
        }
    }

}
