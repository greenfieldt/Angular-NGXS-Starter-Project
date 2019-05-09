import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import * as org from 'org';
import { HttpClient } from '@angular/common/http';
//var org = require("org");


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
        this.sub.add(this.activatedRoute.fragment.pipe(
            tap((frag: string) => {
                this.post = './assets/blog/post/' + frag + '.md';
                console.log("Frags: ", this.post);
            })).subscribe());

        this.sub.add(this.activatedRoute.params.subscribe(params => {
            this.post = './assets/blog/post/' + params['id'] + '.md';
            console.log("Params: ", this.post);
        }));

        //        this.post = './assets/tutorials/storybook/tutorial.org';
        this.post = '/assets/tutorials/test.md';

        this.http.get(this.post, { responseType: 'text' }).pipe(
            first(),
        )
            .subscribe(data => {
                const parser = new org.Parser();
                const orgDocument = parser.parse(JSON.stringify(data));
                const orgHTMLDocument = orgDocument.convert(org.ConverterHTML, {
                    headerOffset: 1,
                    exportFromLineNumber: false,
                    suppressSubScriptHandling: false,
                    suppressAutoLink: false
                });

                console.dir(orgHTMLDocument); // => { title, contentHTML, tocHTML, toc }
                console.log(orgHTMLDocument.toString()) // => Rendered HTML
            });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

}
