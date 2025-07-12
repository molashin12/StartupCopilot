import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
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

// Enable offline persistence
if (typeof window !== 'undefined' && db) {
  // Enable offline persistence for better user experience
  import('firebase/firestore').then(({ enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence }) => {
    // Try to enable multi-tab persistence first, fallback to single-tab
    enableMultiTabIndexedDbPersistence(db)
      .then(() => {
        console.log('Multi-tab offline persistence enabled');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time
          console.warn('Multi-tab persistence failed, trying single-tab persistence');
          return enableIndexedDbPersistence(db);
        } else if (err.code === 'unimplemented') {
          // The current browser doesn't support persistence
          console.warn('Offline persistence is not supported in this browser');
        } else {
          console.error('Failed to enable offline persistence:', err);
        }
      })
      .then(() => {
        if (typeof console !== 'undefined') {
          console.log('Single-tab offline persistence enabled');
        }
      })
      .catch((err) => {
        console.warn('Failed to enable any offline persistence:', err);
      });
  });
}

// Initialize Analytics (only in browser)
export const analytics = app && typeof window !== 'undefined' ? getAnalytics(app) : null;

// Connection management utilities
export const connectionManager = {
  isOnline: true,
  retryAttempts: 0,
  maxRetries: 3,
  retryDelay: 1000,
  sessionRecoveryAttempts: 0,
  maxSessionRecoveryAttempts: 2,

  async enableOfflineMode() {
    if (db) {
      try {
        await disableNetwork(db);
        this.isOnline = false;
        console.log('🔌 Firebase offline mode enabled');
      } catch (error) {
        console.error('Failed to enable offline mode:', error);
      }
    }
  },

  async enableOnlineMode() {
    if (db) {
      try {
        await enableNetwork(db);
        this.isOnline = true;
        this.retryAttempts = 0;
        console.log('🌐 Firebase online mode enabled');
      } catch (error) {
        console.error('Failed to enable online mode:', error);
        throw error;
      }
    }
  },

  async retryConnection() {
    if (this.retryAttempts >= this.maxRetries) {
      console.error('❌ Max retry attempts reached');
      return false;
    }

    this.retryAttempts++;
    const delay = this.retryDelay * Math.pow(2, this.retryAttempts - 1); // Exponential backoff
    
    console.log(`🔄 Retrying connection (attempt ${this.retryAttempts}/${this.maxRetries}) in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      await this.enableOnlineMode();
      return true;
    } catch (error) {
      console.error(`Retry attempt ${this.retryAttempts} failed:`, error);
      return false;
    }
  },

  async handleSessionRecovery() {
    if (this.sessionRecoveryAttempts >= this.maxSessionRecoveryAttempts) {
      console.error('❌ Max session recovery attempts reached, forcing page reload');
      window.location.reload();
      return false;
    }

    this.sessionRecoveryAttempts++;
    console.log(`🔄 Attempting session recovery (${this.sessionRecoveryAttempts}/${this.maxSessionRecoveryAttempts})`);
    
    try {
      // Try to disable and re-enable network to force a new session
      if (db) {
        await disableNetwork(db);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await enableNetwork(db);
        console.log('✅ Session recovery successful');
        this.sessionRecoveryAttempts = 0;
        return true;
      }
    } catch (error) {
      console.error(`Session recovery attempt ${this.sessionRecoveryAttempts} failed:`, error);
      // If this was the last attempt, reload the page
      if (this.sessionRecoveryAttempts >= this.maxSessionRecoveryAttempts) {
        setTimeout(() => window.location.reload(), 2000);
      }
      return false;
    }
    return false;
  },

  handleConnectionError(error: any) {
    console.error('🚨 Firebase connection error:', error);
    
    // Check for session-related errors (400 Bad Request, Unknown SID)
    if (error.message?.includes('400') || 
        error.message?.includes('Bad Request') ||
        error.message?.includes('Unknown SID') ||
        error.message?.includes('gsessionid')) {
      console.log('🔄 Detected session error, attempting recovery...');
      this.handleSessionRecovery();
      return;
    }
    
    // Check if it's a network-related error
    if (error.code === 'unavailable' || error.message?.includes('network')) {
      this.retryConnection();
    }
  }
};

// Network status monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('🌐 Network connection restored');
    connectionManager.enableOnlineMode();
  });

  window.addEventListener('offline', () => {
    console.log('🔌 Network connection lost');
    connectionManager.enableOfflineMode();
  });
}

// Export configuration status
export const isFirebaseConfigured = app !== null;

export default app;