import { Injectable } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { finalize } from 'rxjs/operators';
import { DbService } from './db.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
task: AngularFireUploadTask;

precentage: Observable<number>;
snapshot: Observable<any>;

downloadPicURL: Observable<string>;
  PicURL: string;

constructor(
  private storage: AngularFireStorage,
  private afAuth: AngularFireAuth,
  private db: DbService,
  private afs: AngularFirestore
  ) { }

updateUser(user) {
const data = {
  photoURL: this.PicURL
};
this.afs.doc(`users/${user.id}`).update(data);
}

uploadProfilePic(pic, user) {
  const randNo = Math.floor(Math.random() * 10000000);
    const picName = 'picture' + randNo;
    const path = `${`usersProfile/${user.displayName}`}/${picName}`;
    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, pic);
    this.precentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();

    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadPicURL =  ref.getDownloadURL();
        this.downloadPicURL.subscribe(url => {
          this.PicURL = url;
            this.updateUser(user);
        });
      })
    )
    .subscribe();
  }
}

