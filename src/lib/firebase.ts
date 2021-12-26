import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app =
  typeof window !== 'undefined'
    ? !getApps().length
      ? initializeApp(firebaseConfig)
      : getApp()
    : null;

const db = typeof window !== 'undefined' ? getFirestore() : null;
const storage = typeof window !== 'undefined' ? getStorage() : null;
const auth = typeof window !== 'undefined' ? getAuth() : null;
const analytics = typeof window !== 'undefined' ? getAnalytics() : null;

export { app, auth, db, storage, analytics };
