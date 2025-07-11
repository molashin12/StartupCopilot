import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value || value === 'placeholder_api_key' || value.includes('placeholder'))
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn('⚠️  Firebase configuration incomplete. Missing or placeholder values for:', missingVars.join(', '));
  console.warn('📝 Please update your .env.local file with actual Firebase credentials.');
  console.warn('🔗 Get your credentials from: https://console.firebase.google.com/');
}

// Firebase configuration
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || 'demo-api-key',
  authDomain: requiredEnvVars.authDomain || 'demo.firebaseapp.com',
  projectId: requiredEnvVars.projectId || 'demo-project',
  storageBucket: requiredEnvVars.storageBucket || 'demo-project.appspot.com',
  messagingSenderId: requiredEnvVars.messagingSenderId || '123456789',
  appId: requiredEnvVars.appId || '1:123456789:web:demo',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Create a mock app for development
  app = null;
}

// Initialize Firebase services with error handling
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const functions = app ? getFunctions(app) : null;
export const storage = app ? getStorage(app) : null;

// Initialize Analytics (only in browser)
export const analytics = app && typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export configuration status
export const isFirebaseConfigured = app !== null;

export default app;