import { environment as env } from '../../../environments/environment';

export interface Feature {
    name: string;
    version?: string;
    description: string;
    github?: string;
    documentation: string;
    medium?: string;
}

export const features: Feature[] = [
    {
        name: 'Angular',
        version: env.versions.angular,
        description: 'increate.features.angular',
        github: 'https://github.com/angular/angular',
        documentation: 'https://angular.io/docs/ts/latest/'
    },
    {
        name: 'Angular Material',
        version: env.versions.material,
        description: 'increate.features.angular-material',
        github: 'https://github.com/angular/material2/',
        documentation: 'https://material.angular.io/'
    },
    {
        name: 'Angular Cli',
        version: env.versions.angularCli,
        description: 'increate.features.angular-cli',
        github: 'https://github.com/angular/angular-cli',
        documentation: 'https://cli.angular.io/'
    },
    {
        name: 'NgRx',
        version: env.versions.ngrx,
        description: 'increate.features.ngrx',
        github: 'https://github.com/ngrx/platform',
        documentation: 'http://ngrx.github.io/',
    },
    {
        name: 'RxJS',
        version: env.versions.rxjs,
        description: 'increate.features.rxjs',
        github: 'https://github.com/ReactiveX/RxJS',
        documentation: 'http://reactivex.io/rxjs/',
    },
    {
        name: 'Bootstrap',
        version: env.versions.bootstrap,
        description: 'increate.features.bootstrap',
        github: 'https://github.com/twbs/bootstrap',
        documentation: 'https://getbootstrap.com/docs/4.0/layout/grid/',
    },
    {
        name: 'Typescript',
        version: env.versions.typescript,
        description: 'increate.features.typescript',
        github: 'https://github.com/Microsoft/TypeScript',
        documentation: 'https://www.typescriptlang.org/docs/home.html'
    },
    {
        name: 'I18n',
        version: env.versions.ngxtranslate,
        description: 'increate.features.ngxtranslate',
        github: 'https://github.com/ngx-translate/core',
        documentation: 'http://www.ngx-translate.com/'
    },
    {
        name: 'Font Awesome',
        version: env.versions.fontAwesome,
        description: 'increate.features.fontawesome',
        github: 'https://github.com/FortAwesome/Font-Awesome',
        documentation: 'https://fontawesome.com/icons'
    },
    {
        name: 'Themeing with Angular',
        description: 'increate.features.themes.description',
        documentation: 'https://material.angular.io/guide/theming',
    },
    {
        name: 'Lazy Loading with Angular',
        description: 'increate.features.lazyloading.description',
        documentation:
            'https://angular.io/guide/router#lazy-loading-route-configuration'
    }
];
