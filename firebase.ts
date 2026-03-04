import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyA5r0OlCr23ephce_svdtjpVhjAH7LB8Dw",
    authDomain: "farmers-meenchatti.firebaseapp.com",
    projectId: "farmers-meenchatti",
    storageBucket: "farmers-meenchatti.firebasestorage.app",
    messagingSenderId: "1070131338966",
    appId: "1:1070131338966:web:306cb66be59ba74b76f377"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
