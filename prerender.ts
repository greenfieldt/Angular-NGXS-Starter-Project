// Load zone.js for the server.
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { enableProdMode } from '@angular/core';
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';
import { ROUTES } from './static.paths';

// we need to start an express server to serve any local content that
// HTTPClient is ecpecting (like i18n files)

const express = require('express');
const compression = require('compression');

const CONTEXT = `/${process.env.CONTEXT || 'Increate'}`;
const PORT = 7722;

const app = express();

//we expect to be in the dist directory 
app.use(compression());
app.use(CONTEXT, express.static(__dirname + '/Increate'));
app.use('/', express.static(__dirname + '/Increate'));
app.use('*', express.static(__dirname + '/Increate'));

let httpServer = app.listen(PORT, () => {




    // * NOTE :: leave this as require() since this file is built Dynamically from webpack
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./Increate-server/main');

    const BROWSER_FOLDER = join(process.cwd(), 'Increate');

    // Load the index.html file containing referances to your application bundle.
    const index = readFileSync(join('Increate', 'index.html'), 'utf8');

    let previousRender = Promise.resolve();

    // Iterate each route path
    ROUTES.forEach(route => {
        const fullPath = join(BROWSER_FOLDER, route);

        // Make sure the directory structure is there
        if (!existsSync(fullPath)) {
            mkdirSync(fullPath);
        }

        // Writes rendered HTML to index.html, replacing the file if it already exists.
        previousRender = previousRender.then(_ => renderModuleFactory(AppServerModuleNgFactory, {
            document: index,
            url: route,
            extraProviders: [
                {
                    //providing an http interceptor to allow server side use
                    //of httpclient 
                    provide: 'serverUrl',
                    useValue: `http://localhost:${PORT}/Increate`,
                },
                provideModuleMap(LAZY_MODULE_MAP)
            ]
        })).then(html => {
            console.log("Writing pre-render to", fullPath);
            writeFileSync(join(fullPath, 'index.html'), html);
            console.log("Wrote");
        });

    });
    previousRender.then(_ => {
        httpServer.close();
        process.exit(0);
    });
});
