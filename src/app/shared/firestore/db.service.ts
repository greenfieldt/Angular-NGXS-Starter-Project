import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { map, tap } from 'rxjs/operators';


//Basic read/write in firestore
@Injectable({
    providedIn: 'root'
})
export class DbService {
    constructor(private afs: AngularFirestore) {
    }

    createUID() {
        return this.afs.createId();
    }

    getTimestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    collection$(path, query?) {
        return this.afs.collection(path, query).snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data: Object = a.payload.doc.data();
                    const id: Object = a.payload.doc.id;
                    return { id, ...data };
                });
            }));
    }

    doc$(path): Observable<any> {
        return this.afs.doc(path).snapshotChanges().pipe(
            map(doc => {
                return { id: doc.payload.id, ...doc.payload.data() };
            }));
    }

    /**  
       * @param  {string} path 'collection' or 'collection/docID'
       * @param  {object} data new data
       *
       * Creates or updates data on a collection or document.
       **/
    updateAt(path: string, data: Object): Promise<any> {
        const segments = path.split('/').filter(v => v);
        if (segments.length % 2) {
            return this.afs.collection(path).add(data);
        }
        else {
            this.afs.doc(path).set(data, { merge: true });
        }
    }

    /**  
       * @param  {string} path 'collection/docID'
       * @param  {object} data field (array in doc)
       * @param  {object} data new data
       * @param  {object} command [add | remove]
       *
       * Creates or updates data in a document array.
       **/
    updateDocArray(path, field, data, command) {
        let doc = this.afs.doc(path);

        if (!doc || !data || !command || !field) {
            throw new Error('Invalid Input');
        }

        if (command === 'add') {
            doc.set({
                field: firebase.firestore.FieldValue.arrayUnion(data)
            }, { merge: true });
        }
        else if (command === 'remove') {
            doc.set({
                field: firebase.firestore.FieldValue.arrayRemove(data)
            }, { merge: true });
        }
    }

    delete(path) {
        return this.afs.doc(path).delete();
    }


}
