import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), 'dist');

//Here are a prerendered pages
import { ROUTES } from './static.paths';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./Increate-server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'Increate'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

// Server static files from /browser
/*
app.get('robots.txt', express.static(join(DIST_FOLDER, '/Increate/assets/'), {
    maxAge: '10m'
}));

app.get('sitemap.xml', express.static(join(DIST_FOLDER, 'Increate/assets/sitemap.xml'), {
    maxAge: '10m'
}));
*/
app.get('*.*', express.static(join(DIST_FOLDER, 'Increate'), {
    maxAge: '10m'
}));

app.get("/sitemap.xml", function (req, res, next) {
    res.set('Cache-Control', 'public, max-age=600');
    res.sendFile(__dirname + '/Increate/assets/sitemap.xml');
});


app.get("/robots.txt", function (req, res, next) {
    res.set('Cache-Control', 'public, max-age=600');
    res.sendFile(__dirname + '/Increate/assets/robots.txt');
});


// All regular routes use the Universal engine
app.get('*', (req, res) => {
    //console.log(req);
    //console.log("path is: ", req.path);

    res.set('Cache-Control', 'public, max-age=600');

    if (ROUTES.includes(req.path)) {
        console.log('sending the pregenerated site: ', req.path);
        const path = join(DIST_FOLDER
            + '/Increate'
            + req.path
            + '/rendered-'
            + req.path.replace('/', '') + '.html'
        );

        console.log("Sending ", path);
        res.sendFile(path);


    }
    else {
        console.log("Server Side rendering");
        res.render('index', {
            req, res,
            providers: [{
                //providing an http interceptor to allow server side use
                //of httpclient
                provide: 'serverUrl',
                useValue: `${req.protocol}://${req.get('host')}`
            }]
        });
    }
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
});
