import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, DatePipe } from '@angular/common';


export interface MetaTags {
    title?: string;
    description?: string;
    image?: string;
    slug?: string;
    site?: string;
    type?: string;
    site_name?: string;
    timestamp?: () => string;
}

export const DefaultMetaTags: MetaTags = {
    title: 'Increate Software LLC',
    image: 'https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/IncreateSoftware%2Ficon-512x512.png?alt=media&token=29787c7e-f60d-4211-a32c-5669ccf6bc48',
    slug: 'Software Engineering Management and Consulting Services',
    site: 'https://www.increatesoftware.com',
    type: 'page',
    site_name: 'Increate Software LLC',
    description: 'Software Engineering Management and Consulting Services in Denver, CO',
    timestamp: () => {
        const pipe = new DatePipe('en-US');
        const now = Date.now();
        const time = ' ' + pipe.transform(now, 'mediumTime');
        return time;
    }

};

@Injectable({
    providedIn: 'root'
})
export class SEOService {

    constructor(private meta: Meta,
        private titleService: Title,
        @Inject(DOCUMENT) private doc) { }


    createLinkForCanonicalURL(canonicalURL: string) {
        let link: HTMLLinkElement;
        let headChildren: HTMLCollection = this.doc.head.children;

        for (let i = 0; i < headChildren.length; i++) {
            const _element: Element = headChildren.item(i);
            if (_element.tagName === 'LINK') {
                if (_element.attributes.getNamedItem('rel').value === 'canonical') {
                    link = _element as HTMLLinkElement;

                    if (canonicalURL === null) {
                        //null means we don't know what the
                        //canonical url should be.
                        //probably best to remove the link
                        //so we don't confuse google
                        link.remove();
                    }

                }
            }
        }

        //If we don't understand what the canonicalURL is
        //it is probably better just to do nothing
        if (canonicalURL === null) {
            //our job is done now that the previous
            //canonical has been removed
            return;
        }
        //on the first page load we will need to create this element
        if (!link) {
            link = this.doc.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(link);
        }


        link.setAttribute('href', canonicalURL);
    }


    generateTags(tags: MetaTags) {
        // default values
        tags = {
            ...DefaultMetaTags,
            ...tags
        };



        // Set meta tags
        this.meta.updateTag({ name: 'twitter:card', content: tags.title });
        this.meta.updateTag({ name: 'twitter:site', content: tags.site });
        this.meta.updateTag({ name: 'twitter:title', content: tags.title });
        this.meta.updateTag({ name: 'twitter:description', content: tags.description });
        this.meta.updateTag({ name: 'twitter:image', content: tags.image });

        this.meta.updateTag({ property: 'og:type', content: tags.type });
        this.meta.updateTag({ property: 'og:title', content: tags.title });
        this.meta.updateTag({ property: 'og:description', content: tags.description });
        this.meta.updateTag({ property: 'og:image', content: tags.image });
        this.meta.updateTag({ property: 'og:site_name', content: tags.site_name });
        this.meta.updateTag({ property: 'og:url', content: tags.site });

        this.meta.updateTag({ name: 'title', content: tags.title });
        this.meta.updateTag({ name: 'description', content: tags.description });

    }
}
