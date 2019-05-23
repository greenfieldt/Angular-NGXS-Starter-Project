import { Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
declare const require: any;
import * as firebase from 'firebase/app';
import { Store } from '@ngxs/store';
require('firebase/functions');

@Injectable({
    providedIn: 'root'
})
export class TwitterService {

    constructor(private http: HttpClient,
        private store: Store,
        @Inject(PLATFORM_ID) private platformId) {

    }

    getFeed(searchTerm: string, uid?: string) {
        //do I need to do something special if the user is logged in?
        const _uid = uid ? uid : 'guest';


        return firebase.functions().httpsCallable('twitterFeed')({ uid: _uid, searchTerm: searchTerm })
            .then(r => {
                console.log("Twitter:", r);
                //do we need to do anything -- all the data will
                //already be saved in firestore
                return r;
            });


    }

}
