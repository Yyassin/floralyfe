import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/app";
import { connectFirestoreEmulator, Firestore, getFirestore } from "firebase/firestore";

// Emulator needs project id and env isn't defined in workflow environment (could post in github secrets).
const FIREBASE_TEST_PROJECT_ID =
    process.env.NEXT_PUBLIC_FIREBASE_TEST_PROJECT_ID || "floralyfe-test";
const firebaseTestConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_TEST_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_TEST_AUTH_DOMAIN,
    projectId: FIREBASE_TEST_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_TEST_STORAGE_BUCKET,
    messagingSenderId:
        process.env.NEXT_PUBLIC_FIREBASE_TEST_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_TEST_APP_ID,
};

const app = firebase.initializeApp(firebaseTestConfig);
const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);

export { firebase, db };
