import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { debug } from "./src/util";
// Version 9 imports: https://stackoverflow.com/questions/69139443/property-auth-does-not-exist-on-type-typeof-import-firebase-auth/69489577#69489577

const testing = process.env.TEST !== undefined;

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Emulator needs project id and env isn't defined in workflow environment (could post in github secrets).
const FIREBASE_TEST_PROJECT_ID =
    process.env.FIREBASE_TEST_PROJECT_ID || "floralyfe-test";
const firebaseTestConfig = {
    apiKey: process.env.FIREBASE_TEST_API_KEY,
    authDomain: process.env.FIREBASE_TEST_AUTH_DOMAIN,
    projectId: FIREBASE_TEST_PROJECT_ID,
    storageBucket: process.env.FIREBASE_TEST_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_TEST_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_TEST_APP_ID,
};

// Initialize the app.
firebase.initializeApp(testing ? firebaseTestConfig : firebaseConfig);
// const auth = firebase.auth()
const db = firebase.firestore();
// firebase.firestore.setLogLevel('debug');
if (testing) {
    debug("Firestore connecting to emulator...");
    db.useEmulator("localhost", 8080);
}

export { db };
