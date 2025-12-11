import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyBpQMwRyiYL66LjS2SrXpHv_NT7swmWsZ8',
  appId: '1:821794346451:web:dbd19ec13e73a2d839cb26',
  messagingSenderId: '821794346451',
  projectId: 'zenify-7168a',
  authDomain: 'zenify-7168a.firebaseapp.com',
  storageBucket: 'zenify-7168a.firebasestorage.app',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enforce Local Persistence
import { setPersistence, browserLocalPersistence } from "firebase/auth";
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase Persistence Error:", error);
});
