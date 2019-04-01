import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import { writeFileSync } from 'fs';

const { AppServerModuleNgFactory } = require('./dist/Increate-Server/main');


renderModuleFactory(AppServerModuleNgFactory, {
    document: '<increate-root></increate-root>',
    url: '/'
})
    .then(html => {
        console.log('Pre-rendering successful, saving prerender.html');
        writeFileSync('./prerender.html', html);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });
