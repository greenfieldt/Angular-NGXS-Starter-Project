import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-blogpost',
    templateUrl: './blogpost.component.html',
    styleUrls: ['./blogpost.component.scss']
})
export class BlogpostComponent implements OnInit {
    private sub: Subscription = new Subscription();
    post: string;

    constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) { }

    ngOnInit() {

        this.sub.add(this.activatedRoute.params.subscribe(params => {
            if (Object.keys(params).length === 1) {
                this.post = './assets/tutorials/' + params['file'];
            }
            else {
                this.post = 'https://raw.githubusercontent.com/greenfieldt/'
                    + params['repo'] + '/'
                    + params['branch'] + '/'
                    + params['file'];
            }
            console.log("Params: ", this.post);
        }));

    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

}
