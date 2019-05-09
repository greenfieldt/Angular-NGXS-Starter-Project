import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DbService } from '../firestore/db.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

declare const require: any;
import * as firebase from 'firebase/app';
import { isPlatformBrowser } from '@angular/common';
require('firebase/functions');
require('firebase/storage');



@Injectable({
    providedIn: 'root'
})
export class FacebookService {
    functionURL = env.firebaseFunctionURL;
    constructor(private http: HttpClient,
        private db: DbService,
        @Inject(PLATFORM_ID) private platformId) {

    }

    authenticate(uid): Promise<any> {
        return this._postRequest('facebookredirect', uid)
            .then(r => {
                if (r.data.code && (r.data.code === 401)) {
                    throw new Error(r.data.message);
                }
                else if (r.data.code && (r.data.code === 200)) {
                    if (isPlatformBrowser(this.platformId)) {
                        //redirect in the client
                        window.location.href = r.data.redirect;
                    }
                }
                else {
                    throw new Error("unexpected server response");
                }
            });
    }

    accounts(uid): Promise<any> {
        return firebase.functions().httpsCallable('facebookaccounts')(uid)
            .then(r => {
                //do we need to do anything -- all the data will
                //already be saved in firestore
                return r;
            });
    }


    async post(message, dataurl): Promise<any> {

        if (isPlatformBrowser(this.platformId)) {

            const storageRef = firebase.storage().ref();
            const picRef = storageRef.child(dataurl.name);

            const reader = new FileReader();
            let fileblob = '';
            reader.addEventListener('load', (event: any) => {
                fileblob = event.target.result;
                const metadata = {
                    contentType: dataurl.type,
                };
                const uploadtask = picRef.put(dataurl, metadata)
                    .then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                        return snapshot.ref.getDownloadURL().then((url) => {
                            return firebase.functions().httpsCallable('facebookpostimage')({ caption: message, url: url })
                                .then(r => {
                                    if (r.data.code === 401) {
                                        throw new Error(r.data.message);
                                    }
                                });
                        });
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });

            });
            reader.readAsDataURL(dataurl);
        }


    }

    _postRequest(endpoint, uid): Promise<any> {
        const url = `${this.functionURL}${endpoint}`;

        return firebase.auth().currentUser.getIdToken()
            .then(authToken => {
                const headers = new HttpHeaders(
                    {
                        'Authorization': 'Bearer ' + authToken,
                    }
                );
                const myUID = { uid: uid };
                return this.http.post(url, myUID, { headers: headers }).toPromise();
            });

    }

}

