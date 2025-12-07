import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBlzf7vRIjM4dAk4-hHgw5RCl5eDIxBHwM", // Taken from the user's provided link
  authDomain: "zenify-7168a.firebaseapp.com",
  projectId: "zenify-7168a",
  storageBucket: "zenify-7168a.appspot.com",
  messagingSenderId: "473065268076", 
  appId: "1:473065268076:web:..." 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
