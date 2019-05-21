/*
Stolen right from Angular Material IO
https://github.com/angular/material.angular.io/tree/master/src/app/shared/table-of-contents

*/

import { Component, ElementRef, Inject, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';


interface Link {
    /* id of the section*/
    id: string;

    /* header type h3/h4 */
    type: string;

    /* If the anchor is in view of the page */
    active: boolean;

    /* name of the anchor */
    name: string;

    /* top offset px of the anchor */
    top: number;
}

@Component({
    selector: 'table-of-contents',
    styleUrls: ['./table-of-contents.component.scss'],
    templateUrl: './table-of-contents.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableOfContentsComponent implements OnInit {

    @Input() links: Link[] = [];
    @Input() container: string;
    @Input() headerSelectors = '.post h2, .post h3';

    _rootUrl = this._router.url.split('#')[0];
    private _scrollContainer: any;
    private _destroyed = new Subject();
    private _urlFragment = '';

    constructor(private _router: Router,
        private _route: ActivatedRoute,
        private _element: ElementRef,
        private changeDet: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId,
        @Inject(DOCUMENT) private _document: Document) {

        this._router.events.pipe(takeUntil(this._destroyed)).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const rootUrl = _router.url.split('#')[0];
                if (rootUrl !== this._rootUrl) {
                    this.links = this.createLinks();
                    this._rootUrl = rootUrl;
                }
            }
        });

        this._route.fragment.pipe(takeUntil(this._destroyed)).subscribe(fragment => {
            this._urlFragment = fragment;
            if (isPlatformBrowser(this.platformId)) {
                const target = document.getElementById(this._urlFragment);
                if (target) {
                    target.scrollIntoView();
                }
            }
        });
    }

    ngOnInit(): void {
        // On init, the sidenav content element doesn't yet exist, so it's not possible
        // to subscribe to its scroll event until next tick (when it does exist).
        Promise.resolve().then(() => {
            if (isPlatformBrowser(this.platformId)) {

                this._scrollContainer = this.container ?
                    this._document.querySelectorAll(this.container)[0] : window;

                if (this._scrollContainer) {
                    fromEvent(this._scrollContainer, 'scroll').pipe(
                        takeUntil(this._destroyed),
                        debounceTime(10),
                        tap(_ => {
                            this.onScroll();
                        })
                    ).subscribe();
                }
            }
        });
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {

            this.updateScrollPosition();
        }
    }

    ngOnDestroy(): void {
        this._destroyed.next();
    }

    updateScrollPosition(): void {
        if (isPlatformBrowser(this.platformId)) {

            this.links = this.createLinks();

            const target = document.getElementById(this._urlFragment);
            if (target) {
                //            target.scrollIntoView(false);
                target.scrollTop = target.offsetTop - 64;
            }
        }
    }

    /** Gets the scroll offset of the scroll container */
    private getScrollOffset(): number {
        if (isPlatformBrowser(this.platformId)) {
            {
                const { top } = this._element.nativeElement.getBoundingClientRect();
                if (typeof this._scrollContainer.scrollTop !== 'undefined') {
                    return this._scrollContainer.scrollTop + top;
                } else if (typeof this._scrollContainer.pageYOffset !== 'undefined') {
                    return this._scrollContainer.pageYOffset + top;
                }
            }
        }
    }
    //called if page is not ready to be parsed right away
    onLoad($event) {
        this.links = this.createLinks();
        this.changeDet.detectChanges();

    }

    private createLinks(): Link[] {
        if (isPlatformBrowser(this.platformId)) {

            const links = [];
            const headers =
                Array.from(this._document.querySelectorAll(this.headerSelectors)) as HTMLElement[];

            if (headers.length) {
                for (const header of headers) {
                    // remove the 'link' icon name from the inner text
                    const name = header.innerText.trim().replace(/^link/, '');
                    const { top } = header.getBoundingClientRect();
                    links.push({
                        name,
                        type: header.tagName.toLowerCase(),
                        top: top,
                        id: header.id,
                        active: false
                    });
                }
            }

            return links;
        }
    }

    private onScroll(): void {
        for (let i = 0; i < this.links.length; i++) {
            this.links[i].active = this.isLinkActive(this.links[i], this.links[i + 1]);

        }
        this.changeDet.detectChanges();
    }

    private isLinkActive(currentLink: any, nextLink: any): boolean {
        // A link is considered active if the page is scrolled passed the anchor without also
        // being scrolled passed the next link
        const scrollOffset = this.getScrollOffset();
        return scrollOffset >= currentLink.top && !(nextLink && nextLink.top < scrollOffset);
    }

}
