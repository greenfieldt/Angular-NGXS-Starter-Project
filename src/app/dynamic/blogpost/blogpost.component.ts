import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/route.animations'
import { environment } from '../../../environments/environment';
import { SEOService, MetaTags } from '../../shared/seo/seo.service';
import * as marked from 'marked';
import { HttpClient } from '@angular/common/http';
import { TwitterService } from 'src/app/shared/social/twitter.service';

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
    blogURL;
    @ViewChild('toc') toc;

    constructor(private activatedRoute: ActivatedRoute,
        private changeDetRef: ChangeDetectorRef,
        private seo: SEOService,
        private router: Router,
        private twitter: TwitterService,
        private http: HttpClient) { }

    ngAfterViewInit(): void {
        // @ts-ignore
        twttr.widgets.load();
    }
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
            this.twitter.getFeed("#askIncreate");

            this.generateMetaTags();
            this.changeDetRef.detectChanges();

        }));

    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    onError($event) {
        this.notFound = true;
    }

    headerSelectors = '.post h1';

    generateMetaTags() {

        const lexer = new marked.Lexer({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        });

        //TODO hmm I have to download the data twice
        //to support SSR -- 
        this.http.get(this.post, {
            responseType: 'text'
        }).pipe(
            tap((data: string) => {
                let tags: MetaTags = {
                    title: "Blog Post",
                    description: "Blog Post Description",
                    slug: "Blog Slug",
                    site: 'Blog  site',
                    type: 'article',
                    site_name: 'Blog site name',
                };
                //This is dependent on the header format
                //I'm using in my markdown files
                const tokens = lexer.lex(data);
                const title = tokens[0]['text'].replace(/[\*]+/g, "");
                const desc = tokens[1]['text'].replace(/[\*]+/g, "");
                const author = tokens[3]['text'].replace(/[\*]+/g, "")
                    .replace(/Author:/g, "");
                let img = '';
                for (let i = 7; i++; i < 11) {
                    //search a little for a top image
                    img = tokens[i]['text'] ?
                        tokens[i]['text'].match(/\bhttps?:\/\/\S+/gi) :
                        '';
                    if (img != null && img != '')
                        break;
                }
                tags.title = title;
                tags.description = desc + ' by' + author;
                if (img && img != '')
                    tags.image = img;
                tags.slug = desc;
                tags.site = "https:.//www.increatesoftware.com" + this.router.url;
                tags.site_name = 'https://www.increatesoftware.com';
                //console.log(tokens);
                this.seo.generateTags(tags);

            }),
            first()
        ).subscribe();


        //console.log(lexer.rules);
    }

    onLoad($event) {
        this.toc.onLoad();
        this.changeDetRef.detectChanges();
    }

}
