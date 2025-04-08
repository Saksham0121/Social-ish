// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ✅ Login using username
export const loginWithUsername = async (username, password) => {
  try {
    console.log(`Looking up username: ${username} in "usernames" collection`);
    const userDocRef = doc(db, "usernames", username);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      console.error("Username does not exist in the database");
      throw new Error("Username does not exist.");
    }

    const { email } = userSnapshot.data();
    console.log(`Found email: ${email} for username: ${username}`);
    
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error details:", error.message);
    throw error;
  }
};

// ✅ Sign up with email, password, and username
export const signUp = async (email, password, fullName, username) => {
  try {
    // Check if username already exists
    const usernameDocRef = doc(db, "usernames", username);
    const usernameDoc = await getDoc(usernameDocRef);
    
    if (usernameDoc.exists()) {
      throw new Error("Username is already taken.");
    }
    
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user details in users collection
    await setDoc(doc(db, 'users', user.uid), {
      email,
      fullName,
      username,
      createdAt: new Date()
    });
    
    // IMPORTANT: Store username to email mapping for login
    await setDoc(doc(db, 'usernames', username), {
      email,
      uid: user.uid
    });

    return user;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};