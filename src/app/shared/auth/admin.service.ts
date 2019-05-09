import { Injectable } from '@angular/core';
import { DbService } from '../firestore/db.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare const require: any;
import * as firebase from 'firebase/app';
require('firebase/functions');


@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(private http: HttpClient, private db: DbService) {
    }

    removeUser(uid): Promise<any> {
        return firebase.functions().httpsCallable('removeUser')({ uid })
            .then(r => {
                if (r.data.code === 401) {
                    throw new Error(r.data.message);
                }
            }).catch(function (err) {
                console.log(err);
                return err;
            });

    }

}
