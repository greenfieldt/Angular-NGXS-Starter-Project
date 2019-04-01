import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';
import { readFileSync } from 'fs';
import { enableProdMode } from '@angular/core';

const { AppServerModuleNgFactory } = require('./dist/Increate-server/main');

enableProdMode();

const app = express();

const indexHtml = readFileSync(__dirname + '/dist/Increate/index.html', 'utf-8').toString();


app.get('*.*', express.static(__dirname + '/dist/Increate', {
    maxAge: '1y'
}));

app.get('*.*', express.static(__dirname + '/dist/Increate/assets', {
    maxAge: '1y'
}));


app.route('*').get((req, res) => {

    renderModuleFactory(AppServerModuleNgFactory, {
        document: indexHtml,
        url: req.url
    })
        .then(html => {
            res.status(200).send(html);
        })
        .catch(err => {
            console.log(req);
            console.log(err);
            res.sendStatus(500);
        });

});

app.listen(9000, () => {
    console.log(`Angular Universal Node Express server listening on http://localhost:9000`);
});
