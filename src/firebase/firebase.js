import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// ✅ Load from environment variable
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
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
