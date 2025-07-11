// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDScN_pRre0njQqoMMRHhe-8KedgNBKh-8",
  authDomain: "startupcopilot-450dd.firebaseapp.com",
  projectId: "startupcopilot-450dd",
  storageBucket: "startupcopilot-450dd.firebasestorage.app",
  messagingSenderId: "195338450714",
  appId: "1:195338450714:web:98ce5a6a070cf1a00f1ea3",
  measurementId: "G-YXFWHXPMY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;