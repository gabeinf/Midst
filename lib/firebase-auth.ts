import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Extended User type with Firestore data
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstName?: string;
  username?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface UserProfile {
  firstName?: string;
  username?: string;
  email?: string;
}

// Core auth state listener - EXACT copy from RallySphere
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();

        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userData
        };
        callback(user);
      } catch (error) {
        console.error('Error getting user data:', error);
        // Return basic user info if Firestore fails
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        callback(user);
      }
    } else {
      callback(null);
    }
  });
};

// Sign in function - EXACT copy from RallySphere
export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

// Sign up function - EXACT copy from RallySphere
export async function signUp(
  email: string,
  password: string,
  profile: UserProfile
) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Update display name
    await updateProfile(user, {
      displayName: profile.username || `${profile.firstName}`
    });

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, user };
  } catch (err: any) {
    console.error('Sign up error:', err.message);
    return { success: false, error: err.message };
  }
}

// Logout function - EXACT copy from RallySphere
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    return { success: false, error: error.message };
  }
};
