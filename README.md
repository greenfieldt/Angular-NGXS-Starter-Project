# CofChrist

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.2.

## Development and Prod Servers

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


Run `npm run start:prod` to clean; build prod; and start a simple express
server. Navigate to `http://localhost:4000/`. (fully client side rendered)

Run `npm start:pgssr` to clean; build prod; build ssr; pre-generate
site (compile time); and start a simple express server. Navigate to
`http://localhost:4000/`. Don't forget to run `npm run compile:server
first`!. (pre-generated at compile time and client side rendered)

Run `npm run start:ssr` . to clean; build prod; build ssr; and start
SSR.  Navigate to `http://localhost:4000/`. Don't forget to run `npm
run compile:server first`!.  (server side rendered and client side rendered)

Run `npm run express` for just an express server. Navigate to `http://localhost:4000/`

Run `npm run serve:ssr` to start the SSR server. Navigate to `http://localhost:4000/`

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/CofChrist` directory. 

Run `npm run build:prod` to build the prod project. The build artifacts will be stored in the `dist/Incrate` directory. 

Run `npm run build:ssr` to build the SSR project. The build artifacts will be stored in the `dist/CofChrist-server` directory. 

Run `npm run build:ssr:prod` to build the SSR prod project. The build artifacts will be stored in the `dist/CofChrist-server` directory. 

Run `npm run generate:prerender` to do compile time SSR to
pre-generate the index.html file located in `dist/CofChrist`. This file will be overwritten 

Run `ng compile:server` to compile server.ts and prerender.ts (into
the dist folder)


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
