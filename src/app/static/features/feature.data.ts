import { environment as env } from '../../../environments/environment';

export interface Feature {
    name: string;
    version?: string;
    description: string;
    github?: string;
    documentation: string;
    medium?: string;
    image?: string;
}

export const features: Feature[] = [
    {
        name: 'Angular',
        version: env.versions.angular,
        description: 'increate.features.angular',
        github: 'https://github.com/angular/angular',
        documentation: 'https://angular.io/docs/ts/latest/',
        image: '/assets/AngularLogos/angular.svg'
    },
    {
        name: 'Angular Material',
        version: env.versions.material,
        description: 'increate.features.angular-material',
        github: 'https://github.com/angular/material2/',
        documentation: 'https://material.angular.io/',
        image: '/assets/AngularLogos/material.svg'

    },
    {
        name: 'Angular Cli',
        version: env.versions.angularCli,
        description: 'increate.features.angular-cli',
        github: 'https://github.com/angular/angular-cli',
        documentation: 'https://cli.angular.io/',
        image: '/assets/AngularLogos/cli.svg'

    },
    {
        name: 'NgXS',
        version: env.versions.ngxs,
        description: 'increate.features.ngxs',
        github: 'https://github.com/ngxs/platform',
        documentation: 'http://ngrx.github.io/',
        image: '/assets/AngularLogos/NGXS.png'

    },
    {
        name: 'RxJS',
        version: env.versions.rxjs,
        description: 'increate.features.rxjs',
        github: 'https://github.com/ReactiveX/RxJS',
        documentation: 'http://reactivex.io/rxjs/',
        image: '/assets/AngularLogos/rxjs.png'

    },
    {
        name: 'Bootstrap',
        version: env.versions.bootstrap,
        description: 'increate.features.bootstrap',
        github: 'https://github.com/twbs/bootstrap',
        documentation: 'https://getbootstrap.com/docs/4.0/layout/grid/',
        image: '/assets/AngularLogos/bootstrap.svg'

    },
    {
        name: 'Typescript',
        version: env.versions.typescript,
        description: 'increate.features.typescript',
        github: 'https://github.com/Microsoft/TypeScript',
        documentation: 'https://www.typescriptlang.org/docs/home.html',
        image: '/assets/AngularLogos/typescript.svg'

    },
    {
        name: 'I18n',
        version: env.versions.ngxtranslate,
        description: 'increate.features.ngxtranslate',
        github: 'https://github.com/ngx-translate/core',
        documentation: 'http://www.ngx-translate.com/',
        image: '/assets/AngularLogos/i18n.svg'

    },
    {
        name: 'Font Awesome',
        version: env.versions.fontAwesome,
        description: 'increate.features.fontawesome',
        github: 'https://github.com/FortAwesome/Font-Awesome',
        documentation: 'https://fontawesome.com/icons',
        image: '/assets/AngularLogos/fontawesome.svg'

    },
    {
        name: 'Themeing with Angular',
        description: 'increate.features.themes.description',
        documentation: 'https://material.angular.io/guide/theming',
        image: '/assets/AngularLogos/angular.svg'

    },
    {
        name: 'Lazy Loading with Angular',
        description: 'increate.features.lazyloading.description',
        documentation:
            'https://angular.io/guide/router#lazy-loading-route-configuration',
        image: '/assets/AngularLogos/lazy-loading.svg'

    }
];

export const olderFeatures: Feature[] = [
    {
        name: 'C++',
        version: '17',
        description: 'increate.technologies.cpp',
        documentation: 'https://github.com/isocpp/CppCoreGuidelines',
        image: '/assets/AngularLogos/other/ISO_C++.svg'
    },
    {
        name: 'Objective C',
        version: '2.0',
        description: 'increate.technologies.obj-c',
        documentation: 'https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html',
        image: '/assets/AngularLogos/other/objective-c.png'

    },

]
