import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import * as cors from 'cors';
admin.initializeApp();



export const removeUser = functions.https.onCall((data, context) => {
    if (!context.auth)
        return { status: 'error', code: 401, message: 'Not signed in' }

    return admin.auth().deleteUser(data.uid)
        .then((decoded) => {
            return { status: 'success', code: 200, message: 'User Deleted' }
        })
        .catch((err) => {
            console.log(err);
            throw new functions.https.HttpsError('internal', err);
        });
});


//Instagram authorization 

import { create } from 'simple-oauth2/index';
import { randomBytes } from 'crypto'


function getInstagramOAuth2() {

    const credentials = {
        client: {
            id: '128f9e185057467aa3ac465946b75031',
            secret: '174fe8cc79f54b02938b60f0dd3f2a06',
        },
        auth: {
            tokenHost: 'https://api.instagram.com',
            tokenPath: '/oauth/access_token'
        },
        options: {
            authorizationMethod: 'body',
        }

    };

    const oauth2 = create(credentials as any);

    return oauth2;

}

const OAUTH_CALLBACK_PATH = '/instagramcallback';





//https://us-central1-stagingcofchristthornton.cloudfunctions.net/instagramredirect

export const instagramredirect = functions.https.onRequest((req, res) => {
    // Instagram scopes requested.
    const OAUTH_SCOPES = 'basic';

    const oauth2 = getInstagramOAuth2();

    console.log("oath object", oauth2);

    let state;

    if (req && req.cookies && req.cookies.state)
        state = req.cookies.state
    else
        state = randomBytes(20).toString('hex');

    console.log('Setting state cookie for verification:', state);
    const host = req.get('host');
    if (host) {
        const secureCookie = host.indexOf('localhost:') !== 0;
        console.log('Need a secure cookie (i.e. not on localhost)?', secureCookie);
        res.cookie('state', state, { maxAge: 3600000, secure: secureCookie, httpOnly: true });
    }


    const redirectUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: `${req.protocol}://${req.get('host')}${OAUTH_CALLBACK_PATH}`,
        scope: OAUTH_SCOPES,
        state: state
    });
    console.log('Redirecting to:', redirectUri);
    res.redirect(redirectUri);
});




export const instagramcallback = functions.https.onRequest((req, res) => {

    //const clientID = request.get('clientID');
    //const oauth2 = getInstagramOAuth2(clientID);
    const oauth2 = getInstagramOAuth2();

    const myRedirect = 'https://staging.cofchristthornton.org/admin'


    if (req && req.cookies) {
        console.log('Received state cookie:', req.cookies.state);

        if (!req.cookies.state) {
            res.status(400).send('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
        }
        else if (req.cookies.state !== req.query.state) {
            res.status(400).send('State validation failed');
        }
    }

    console.log('Received state query parameter:', req.query.state);
    console.log('Received auth code:', req.query.code);

    oauth2.authorizationCode.getToken({
        code: req.query.code,
        redirect_uri: `${req.protocol}://${req.get('host')}${OAUTH_CALLBACK_PATH}`

    }).then((results: any) => {
        console.log('Auth code exchange result received:', results);
        // We have an Instagram access token and the user identity now.
        const accessToken = results.access_token;
        const instagramUserID = results.user.id;
        const profilePic = results.user.profile_picture;
        const userName = results.user.full_name;

        console.log(accessToken, instagramUserID, profilePic, userName);
        const igSettings = admin.firestore().doc(`social/instagram`);
        igSettings.set({ accessToken, instagramUserID, profilePic, userName })
            .then((x) => {
                console.log("It worked");
                res.redirect(myRedirect);
            }).catch((err) => {
                console.log(err);
                res.end();
            });

    }).catch((err: any) => {
        console.log(err);
        res.end();

    });

})

//Facebook


function getFacebookOAuth2() {
    //IncreatePostTestApp
    const credentials = {
        client: {
            id: '343604539840511',
            secret: '619bdbf7ded7178b42baea2910736a10',
        },
        auth: {
            authorizeHost: 'https://facebook.com/',
            authorizePath: '/dialog/oauth',

            tokenHost: 'https://graph.facebook.com',
            tokenPath: '/oauth/access_token'
        },
        options: {
            authorizationMethod: 'body',

        }

    };
    const oauth2 = create(credentials as any);

    return oauth2;

}


//firebase.io modified from google

// 1. Helper to validate auth header is present
function validateHeader(req: any) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('auth header found')
        return req.headers.authorization.split('Bearer ')[1]
    }
}

// 2. Helper to decode token to firebase UID (returns promise)
function decodeAuthToken(authToken: any) {
    return admin.auth()
        .verifyIdToken(authToken)
        .then(decodedToken => {
            // decode the current user's auth token
            return decodedToken.uid;
        })
}



const cors = require('cors')({ origin: true });

//https://us-central1-FIREBASEPROJECTNAME.cloudfunctions.net/facebookredirect
export const facebookredirect = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        // Check for POST request

        if (req.method !== "POST") {
            console.log("Not a POST req!");
            return res.status(400).send('Please send a POST request');
        }

        const requestedUid = req.body.uid     // resource the user is requsting to modify
        const authToken = validateHeader(req) // current user encrypted

        if (!authToken) {
            console.log("Missing auth token");
            return res.status(403).send('Unuthorized! Missing auth token!');
        }

        return decodeAuthToken(authToken)
            .then(uid => {
                if (uid === requestedUid) {
                    // Safe to do something important here
                    const OAUTH_SCOPES = ['publish_pages', 'manage_pages', 'public_profile'];

                    const oauth2 = getFacebookOAuth2();

                    console.log("oath object", oauth2);

                    let state;

                    if (req && req.cookies && req.cookies.state)
                        state = req.cookies.state
                    else
                        state = randomBytes(20).toString('hex');

                    console.log('Setting state cookie for verification:', state);
                    const host = req.get('host');
                    if (host) {
                        const secureCookie = host.indexOf('localhost:') !== 0;
                        console.log('Need a secure cookie (i.e. not on localhost)?', secureCookie);
                        res.cookie('state', state, { maxAge: 3600000, secure: secureCookie, httpOnly: true });
                    }
                    const redirectUri = oauth2.authorizationCode.authorizeURL({
                        redirect_uri: `${req.protocol}://${req.get('host')}/facebookcallback`,
                        scope: OAUTH_SCOPES,
                        state: state
                    });

                    console.log('Redirecting to:', redirectUri);
                    //I initially wanted to redirect here but I'm not sure
                    //about the proper cors proxy I need so I'm sending
                    //the redirect back to the client
                    //TODO: Revisit the security ramifications of this
                    //res.redirect(redirectUri);
                    const ret = { data: { code: 200, redirect: redirectUri } };
                    res.status(200).send(ret);

                }
                else {
                    console.log("uid and auth token didn't match");
                    res.status(403).send('Unauthorized to edit other user data')
                }
            })
            .catch(err => {
                console.log(err);
                res.status(403).send('Error -- see server console for more info');
            });
    });
});


export const facebookcallback = functions.https.onRequest((req, res) => {
    const oauth2 = getFacebookOAuth2();

    //TODO -- Find a way to get this from the build process 
    //req.get('host') is a string like this us-central1-devcofchristthornton.cloudfunctions.net

    const cloudHost: string = req.get('host') || 'us-central1-devcofchristthornton.cloudfunctions.net';
    const envGuess = cloudHost.slice(12, cloudHost.indexOf('of') - cloudHost.length - 1);

    console.log("env guess is: ", envGuess);


    const myRedirect = `https://${envGuess}.cofchristthornton.org/admin#connectsocial`
    //const myRedirect = `http://localhost:4200/admin#connectsocial`


    if (req && req.cookies) {
        console.log('Received state cookie:', req.cookies.state);

        if (!req.cookies.state) {
            res.status(400).send('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
        }
        else if (req.cookies.state !== req.query.state) {
            res.status(400).send('State validation failed');
        }
    }

    console.log('Received state query parameter:', req.query.state);
    console.log('Received auth code:', req.query.code);

    oauth2.authorizationCode.getToken({
        code: req.query.code,
        redirect_uri: `${req.protocol}://${req.get('host')}/facebookcallback`
    }).then((results: any) => {
        //Exchange for the access token.
        console.log('Auth code exchange result received:', results);


        const accessToken = oauth2.accessToken.create(results);

        console.log("My token is ", accessToken);
        const fbAuthenticate = admin.firestore().doc(`social/facebook/public/data`);
        const p1 = fbAuthenticate.set({ authenticated: true }).catch((err) => {
            console.log(err);
            res.end();
        });

        const fbSettings = admin.firestore().doc(`social/facebook/private/cred`);

        const p2 = fbSettings.set(accessToken.token)
            .then((x) => {
                console.log("Worked!!!");

                res.redirect(myRedirect);
                return;

            }).catch((err) => {
                console.log(err);
                res.end();
            });

        return Promise.all([p1, p2]);
    }).catch((err: any) => {
        console.log(err);
        res.end();
    });
})
/// <reference path="@types/request-promise/index.d.ts"/>
import { get, post } from 'request-promise';

export const facebookaccountinfo = functions.https.onCall((data, context) => {
    if (!context.auth)
        return { status: 'error', code: 401, message: 'Not signed in' }

    const fbSettings = admin.firestore().doc(`social/facebook`);
    return fbSettings.get().then((x) => {
        const options = {

            method: 'GET',
            uri: `https://graph.facebook.com/v3.2/${x.get('access_token')}`,
            qs: {
                access_token: x.get('access_token'),
            }
        };
        console.log("options", options);

        return get(options)
            .then(fbRes => {

                console.log(fbRes);

                const pages = fbRes.data;
                console.log(pages);

                return admin.firestore().collection('social/facebook/pages')
                    .add(pages)
                    .then((xx) => {
                        console.log("Data written", xx);
                        return { status: 'Ok', code: 200, message: 'Data Written' }
                    })
            })
    }).catch((err: any) => {
        console.log(err);
        throw new functions.https.HttpsError('internal', err);
    })
})








//866201577060453  (timg's fbuid)

export const facebookaccounts = functions.https.onCall((data, context) => {


    if (!context.auth)
        return { status: 'error', code: 401, message: 'Not signed in' }

    const fbPrivate = admin.firestore().doc(`social/facebook/private/cred`);
    const fbPublic = admin.firestore().doc(`social/facebook/public/data`);



    return fbPrivate.get().then((x) => {
        console.log(x);
        const accessKey = x.get('access_token');
        console.log("accessKey is", accessKey);

        return fbPublic.get().then((xx) => {
            const options = {

                method: 'GET',
                uri: `https://graph.facebook.com/v2.8/${xx.get('fb_uid')}/accounts`,
                qs: {
                    access_token: accessKey,
                }
            };
            console.log("options", options);

            return get(options)
                .then((fbRes: any) => {
                    console.log("ABC", JSON.parse(fbRes));


                    const pages: [] = JSON.parse(fbRes).data;
                    console.log(pages);

                    const pageNames = pages.map((a: any) => a.name);

                    console.log("pageNames are", pageNames);


                    //Store all the info in the private section
                    return admin.firestore().doc('social/facebook/private/pages')
                        .set(JSON.parse(fbRes))
                        .then((xxx) => {
                            console.log("private pages", xxx);
                            return admin.firestore().doc('social/facebook/public/data')
                                .set({ pages: pageNames }, { merge: true })
                                .then((xxxx) => {
                                    console.log("Public Page Names", xxxx);
                                    return { status: 'ok', code: 200, message: 'updated' }
                                })
                        })

                    //res.json(fbRes);

                })


        }).catch((err: any) => {
            console.log(err);
            throw new functions.https.HttpsError('internal', err);
        })
    })
})


export const facebookpostmessage = functions.https.onRequest((req, res) => {

    const fbSettings = admin.firestore().doc(`social/facebook`);
    fbSettings.get().then((x) => {

        const options = {
            method: 'POST',
            uri: `https://graph.facebook.com/v3.2/1900233130003735/feed`,
            qs: {
                message: 'Hello world!',
                access_token: '',
            }
        };

        console.log(options);

        post(options)
            .then((fbRes: any) => {
                console.log(res.json(fbRes));
                res.end();
            })
    }).catch((err: any) => {

        console.log(err);
        res.end();
    })
})

export const facebookpostimage = functions.https.onCall((data, context) => {

    if (!context.auth)
        return { status: 'error', code: 401, message: 'Not signed in' }

    const caption = data.caption;
    const url = data.url;

    console.log(caption, url);


    const fbSetting = admin.firestore().doc(`social/facebook/public/data`);
    return fbSetting.get().then((publicdata) => {

        const selectedPage = publicdata.get('selected_page');

        console.log(selectedPage);

        const fbPages = admin.firestore().doc(`social/facebook/private/pages`);
        return fbPages.get().then((privateData) => {

            const pagesArray: [] = privateData.get('data');
            console.log(pagesArray);

            const page: any = pagesArray.filter((x: any) => x.name === selectedPage)[0];

            console.log(page.access_token);

            const options = {
                method: 'POST',
                uri: `https://graph.facebook.com/v3.2/${page.id}/photos`,
                qs: {
                    caption: caption,
                    url: url,
                    access_token: page.access_token,
                }
            };

            console.log(options);

            return post(options)
                .then((fbRes: any) => {
                    console.log(JSON.parse(fbRes));
                    return { status: 'ok', code: 200, message: 'Posted' }

                })
        })
    }).catch((err: any) => {
        console.log(err);
        throw new functions.https.HttpsError('internal', err);
    })
})

//Twitter
/// <reference path="@types/twitter/index.d.ts"/>
//import * as Twitter from 'twitter';

//import * as Twitter from 'twitter-lite'
const Twitter = require('twitter-lite');

export const twitterFeed = functions.https.onCall((data, context) => {

    //   if (!context.auth)
    //       return { status: 'error', code: 401, message: 'Not signed in' }

    const searchTerm = data.searchTerm;

    console.log(searchTerm);


    const twitterSetting = admin.firestore().doc(`social/twitter`);
    return twitterSetting.get().then((privatedata) => {

        const client = new Twitter({
            sub_domain: 'api',
            consumer_key: privatedata.get('consumer_key'),
            consumer_secret: privatedata.get('consumer_secret'),
            access_token_key: privatedata.get('access_token_key'),
            access_token_secret: privatedata.get('access_token_secret')
        });

        console.log('Client:', client);
        return client.get('search/tweets/30day/prod', {
            q: searchTerm,
            count: 100,
            result_type: 'mixed',
        }).then((value: any): string => {
            console.log("value:", value);
            const status = value.statuses;
            console.log("Twitter Success:", status);
            return JSON.stringify(status);

        })
            .catch((err: any) => {
                console.log("Twitter Error:", err);
                return err;
            });
    });

    return "error";

});

//https://us-central1-FIREBASEPROJECTNAME.cloudfunctions.net/facebookredirect
export const twitterredirect = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        // Check for POST request

        if (req.method !== "POST") {
            console.log("Not a POST req!");
            return res.status(400).send('Please send a POST request');
        }

        const requestedUid = req.body.uid     // resource the user is requsting to modify
        const authToken = validateHeader(req) // current user encrypted

        if (!authToken) {
            console.log("Missing auth token");
            return res.status(403).send('Unuthorized! Missing auth token!');
        }

        return decodeAuthToken(authToken)
            .then(uid => {
                if (uid === requestedUid) {
                    // Safe to do something important here
                    //const OAUTH_SCOPES = [];

                    //const oauth2 = getFacebookOAuth2();

                    //console.log("oath object", oauth2);

                    let state;

                    if (req && req.cookies && req.cookies.state)
                        state = req.cookies.state
                    else
                        state = randomBytes(20).toString('hex');

                    console.log('Setting state cookie for verification:', state);
                    const host = req.get('host');
                    if (host) {
                        const secureCookie = host.indexOf('localhost:') !== 0;
                        console.log('Need a secure cookie (i.e. not on localhost)?', secureCookie);
                        res.cookie('state', state, { maxAge: 3600000, secure: secureCookie, httpOnly: true });
                    }
                    /*
                                        const redirectUri = oauth2.authorizationCode.authorizeURL({
                                            redirect_uri: `${req.protocol}://${req.get('host')}/twitterallback`,
                                            scope: OAUTH_SCOPES,
                                            state: state
                                        });
                    
                                        console.log('Redirecting to:', redirectUri);
                                        //I initially wanted to redirect here but I'm not sure
                                        //about the proper cors proxy I need so I'm sending
                                        //the redirect back to the client
                                        //TODO: Revisit the security ramifications of this
                                        //res.redirect(redirectUri);
                                        const ret = { data: { code: 200, redirect: redirectUri } };
                                        res.status(200).send(ret);
                    */
                }
                else {
                    console.log("uid and auth token didn't match");
                    res.status(403).send('Unauthorized to edit other user data')
                }
            })
            .catch(err => {
                console.log(err);
                res.status(403).send('Error -- see server console for more info');
            });
    });
});


export const twittercallback = functions.https.onRequest((req, res) => {

    //const oauth2 = getFacebookOAuth2();

    //TODO -- Find a way to get this from the build process 
    //req.get('host') is a string like this us-central1-devcofchristthornton.cloudfunctions.net

    const cloudHost: string = req.get('host') || 'us-central1-devcofchristthornton.cloudfunctions.net';
    const envGuess = cloudHost.slice(12, cloudHost.indexOf('of') - cloudHost.length - 1);

    console.log("env guess is: ", envGuess);


    // const myRedirect = `https://www.increatesoftware.com/admin#connectsocial`
    //const myRedirect = `http://localhost:4200/admin#connectsocial`


    if (req && req.cookies) {
        console.log('Received state cookie:', req.cookies.state);

        if (!req.cookies.state) {
            res.status(400).send('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
        }
        else if (req.cookies.state !== req.query.state) {
            res.status(400).send('State validation failed');
        }
    }

    console.log('Received state query parameter:', req.query.state);
    console.log('Received auth code:', req.query.code);
    /*
        oauth2.authorizationCode.getToken({
            code: req.query.code,
            redirect_uri: `${req.protocol}://${req.get('host')}/twittercallback`
        }).then((results: any) => {
            //Exchange for the access token.
            console.log('Auth code exchange result received:', results);
    
    
            const accessToken = oauth2.accessToken.create(results);
    
            console.log("My token is ", accessToken);
            const fbAuthenticate = admin.firestore().doc(`social/twitter/public/data`);
            const p1 = fbAuthenticate.set({ authenticated: true }).catch((err) => {
                console.log(err);
                res.end();
            });
    
            const fbSettings = admin.firestore().doc(`social/twitter/private/cred`);
    
            const p2 = fbSettings.set(accessToken.token)
                .then((x) => {
                    console.log("Worked!!!");
    
                    res.redirect(myRedirect);
                    return;
    
                }).catch((err) => {
                    console.log(err);
                    res.end();
                });
    
            return Promise.all([p1, p2]);
        }).catch((err: any) => {
            console.log(err);
            res.end();
        });
    */
})
