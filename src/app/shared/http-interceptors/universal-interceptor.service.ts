import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';


/**
* Fix for server side rendering.  Captures are all http client requests and 
* looks to see if they are trying to hit a relative URL.  If they are 
* it appends the localhost:PORT that is provided in either server.js 
* or prerender.js as "serverUrl" paramter to form a complete URL 
* to serve local resources during SSR
**/
@Injectable()
export class UniversalInterceptor implements HttpInterceptor {

    constructor(@Optional() @Inject('serverUrl') protected serverUrl: string) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        //Simple check to see if the req is in the form of
        //'http[s]://somehost/blalbla' or '/assets/en.json'
        let outside: boolean = req.url.indexOf('http') >= 0;

        const serverReq = (!this.serverUrl || outside) ? req : req.clone({
            url: `${this.serverUrl}${req.url}`
        });

        return next.handle(serverReq);

    }

}
