import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9Fsy1-2_s2M0oGNQaZUxQE3h2kHD0c0c",
  authDomain: "social-ish-5bd46.firebaseapp.com",
  projectId: "social-ish-5bd46",
  storageBucket: "social-ish-5bd46.firebasestorage.app",
  messagingSenderId: "110576136162",
  appId: "1:110576136162:web:6da7de8792c6fa90d413bb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth, app };