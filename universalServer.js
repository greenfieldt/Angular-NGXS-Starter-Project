"use strict";
exports.__esModule = true;
require("zone.js/dist/zone-node");
require("reflect-metadata");
var platform_server_1 = require("@angular/platform-server");
var express = require("express");
var fs_1 = require("fs");
var core_1 = require("@angular/core");
var AppServerModuleNgFactory = require('./dist/Increate-server/main').AppServerModuleNgFactory;
core_1.enableProdMode();
var app = express();
var indexHtml = fs_1.readFileSync(__dirname + '/dist/Increate/index.html', 'utf-8').toString();
app.get('*.*', express.static(__dirname + '/dist/Increate', {
    maxAge: '1y'
}));
app.get('*.*', express.static(__dirname + '/dist/Increate/assets', {
    maxAge: '1y'
}));
app.route('*').get(function (req, res) {
    platform_server_1.renderModuleFactory(AppServerModuleNgFactory, {
        document: indexHtml,
        url: req.url
    })
        .then(function (html) {
        res.status(200).send(html);
    })["catch"](function (err) {
        console.log(req);
        console.log(err);
        res.sendStatus(500);
    });
});
app.listen(9000, function () {
    console.log("Angular Universal Node Express server listening on http://localhost:9000");
});
