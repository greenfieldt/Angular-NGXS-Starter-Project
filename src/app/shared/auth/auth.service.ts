import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Md5 } from 'ts-md5';
import { Observable, of } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { DbService } from '../firestore/db.service';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})


export class AuthService {
    user$: Observable<any>;

    constructor(
        private afAuth: AngularFireAuth,
        private store: Store,
        private db: DbService,
        @Inject(PLATFORM_ID) private platformId
    ) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                return user ? db.doc$(`users/${user.uid}`) : of(null);
            }
            ));
        this.handleRedirect();
    }

    UID(): Promise<any> {
        return this.user$.pipe(take(1), map(u => u && u.uid)).toPromise();
    }

    async anonymousLogin() {
        const creds = await this.afAuth.auth.signInAnonymously();
        return await this.updateUserData(creds.user);
    }

    private updateUserData({ uid, email, displayName, photoURL, isAnonymous }) {
        const data = {
            uid,
            email,
            displayName,
            photoURL,
            isAnonymous
        };

        this.db.updateAt(`users/${uid}`, data);
    }

    async logOut() {
        await this.afAuth.auth.signOut();
        // TODO turn this back on when we have a logout button
        // right now we are logging out on app load
        //      return this.store.dispatch(new Navigate(['/']));
    }

    setRedirect(val) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authRedirect', val);
        }
    }

    isRedirect(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('authRedirect') === 'true';
        } else {
            return false;
        }
    }

    async googleLogin() {
        try {
            let user;
            await this.setRedirect(true);
            const provider = new auth.GoogleAuthProvider();
            user = await this.afAuth.auth.signInWithRedirect(provider);
            await this.updateUserData(user);

        } catch (err) {
            console.log(err);
            return err;
        }
        return {};

    }

    emailResetPassword(email): Promise<any> {

        return this.afAuth.auth.sendPasswordResetEmail(email).
            then(() => {
                // there is nothing to return in this case
                return {};
            }).
            catch((err) => {
                console.log(err);
                return err;
            });
    }

    emailSignInLink(email): Promise<any> {
        const acs: firebase.auth.ActionCodeSettings = {
            url: environment.continueURL,
            iOS: {
                bundleId: 'com.example.cofc'
            },
            android: {
                packageName: 'com.example.cofc',
                installApp: true,
                minimumVersion: '12'
            },
            handleCodeInApp: true,
            // When multiple custom dynamic link domains are defined, specify
            // which one to use
            dynamicLinkDomain: environment.dynamicLinkDomain
        };
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('emailForSignIn', email);
        }
        return this.afAuth.auth.sendSignInLinkToEmail(email, acs)
            .then(() => {
                // there is nothing to return in this case
                return {};
            })
            .catch((err) => {
                // console.log(err);
                return err;
            });
    }

    emailContinueSignInLink(href, email, name): Promise<any> {
        const pID = this.platformId;
        if (this.afAuth.auth.isSignInWithEmailLink(href)) {
            // The client SDK will parse the code from the link for you.
            return this.afAuth.auth.signInWithEmailLink(email, href).then(() => {
                const data = {
                    uid: null,
                    email: null,
                    displayName: null,
                    photoURL: null,
                    isAnonymous: null
                };

                data.displayName = name
                    || this.afAuth.auth.currentUser.email;
                data.isAnonymous = this.afAuth.auth.currentUser.isAnonymous
                    || false;
                data.uid = this.afAuth.auth.currentUser.uid;

                data.photoURL = this.afAuth.auth.currentUser.photoURL
                    || 'https://www.gravatar.com/avatar/' + Md5.hashStr(this.afAuth.auth.currentUser.uid) + '?d=identicon';
                data.email = this.afAuth.auth.currentUser.email
                    ;
                // console.log("continue sign up link data", data);
                this.updateUserData(data);
                return {};
            })
                .then(function (result) {
                    // Clear email from storage.
                    if (isPlatformBrowser(pID)) {
                        localStorage.removeItem('emailForSignIn');
                    }
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                    return {};
                })
                .catch(function (error) {
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                    console.log(error);
                    return error;
                });
        }
    }

    async emailContinueSignInLinkSetPassword(password): Promise<any> {
        if (password.length < 3)
            throw new Error("Invalid Password");

        return this.afAuth.auth.currentUser
            .updatePassword(password).then(() => {

            }).catch((err) => {
                console.log(err);
                return err;
            });
    }


    emailCreateUser(email: string, password: string): Promise<any> {
        const data = {
            uid: null,
            email: null,
            displayName: null,
            photoURL: null,
            isAnonymous: null
        };


        return this.afAuth.auth.
            createUserWithEmailAndPassword(email, password)
            .then((user) => {
                data.displayName = user.additionalUserInfo.username || user.user.email;
                data.isAnonymous = user.user.isAnonymous || false;
                data.uid = user.user.uid;
                data.photoURL = user.user.photoURL || 'https://www.gravatar.com/avatar/' + Md5.hashStr(this.afAuth.auth.currentUser.uid) + '?d=identicon';
                data.email = user.user.email;
                this.updateUserData(data);
                return data;

            }).
            catch((err) => {
                console.log(err);
                return err;
            });
    }



    emailLogin(email, password): Promise<any> {
        const data = {
            uid: null,
            email: null,
            displayName: null,
            photoURL: null,
            isAnonymous: null
        };


        return this.afAuth.auth
            .signInWithEmailAndPassword(email, password).then((user) => {

                // How to handle the first user made for firebase console

                /*   data.displayName = user.user.displayName;
                   data.isAnonymous = user.user.isAnonymous || false;
                   data.uid = user.user.uid
                   data.photoURL = user.user.photoURL || '';
                   data.email = user.user.email;
   
                   this.updateUserData(data);
                   return data; */
            }).
            catch((err) => {
                // couldn't log in for some reason
                console.log(err);
                return err;
            });
    }

    private async handleRedirect() {
        if ((await this.isRedirect()) !== true) {
            return null;
        }

        const result = await this.afAuth.auth.getRedirectResult();

        if (result.user) {
            await this.updateUserData(result.user);
        }

        this.setRedirect(false);


    }


}

