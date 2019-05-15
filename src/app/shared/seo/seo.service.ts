import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';


@Injectable({
    providedIn: 'root'
})
export class SEOService {

    constructor(private meta: Meta, private titleService: Title) { }
    generateTags(tags) {
        // default values
        tags = {
            title: 'Increate Software LLC',
            description: 'Engineering Management and Consulting Services',
            image: 'https://firebasestorage.googleapis.com/v0/b/increatesoftware.appspot.com/o/IncreateSoftware%2Ficon-512x512.png?alt=media&token=29787c7e-f60d-4211-a32c-5669ccf6bc48',
            slug: '',
            ...tags
        }

        //title service is taking care of this right now
        // Set a title
        //this.titleService.setTitle(tags.title);

        // Set meta tags
        this.meta.updateTag({ name: 'twitter:card', content: 'Engineering Management and Consulting Services' });
        this.meta.updateTag({ name: 'twitter:site', content: '@increatesoftware' });
        this.meta.updateTag({ name: 'twitter:title', content: tags.title });
        this.meta.updateTag({ name: 'twitter:description', content: tags.description });
        this.meta.updateTag({ name: 'twitter:image', content: tags.image });

        this.meta.updateTag({ property: 'og:type', content: 'article' });
        this.meta.updateTag({ property: 'og:site_name', content: 'Increate Software LLC' });
        this.meta.updateTag({ property: 'og:title', content: tags.title });
        this.meta.updateTag({ property: 'og:description', content: tags.description });
        this.meta.updateTag({ property: 'og:image', content: tags.image });
        this.meta.updateTag({ property: 'og:url', content: `https://www.increatesoftware.com` });

        this.meta.updateTag({ name: 'description', content: tags.description });

    }
}
