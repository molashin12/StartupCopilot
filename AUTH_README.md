# Firebase Authentication Setup

## 🔥 Features Implemented

### ✅ Email & Password Authentication
- User registration with email, password, and display name
- User login with email and password
- Password reset functionality
- Form validation and error handling

### ✅ Google OAuth Authentication
- One-click Google sign-in
- Automatic user profile creation
- Seamless integration with Firebase Auth

### ✅ Authentication Context
- Global authentication state management
- Real-time user state updates
- Loading states for better UX
- Automatic session persistence

### ✅ UI Integration
- Dynamic navigation based on auth state
- Protected routes and conditional rendering
- Responsive authentication forms
- Beautiful glass-morphism design

## 🚀 How to Use

### 1. Environment Setup
Copy `.env.local.example` to `.env.local` and fill in your Firebase configuration:

```bash
cp .env.local.example .env.local
```

### 2. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication in the Firebase console
4. Enable Email/Password and Google sign-in methods
5. Copy your Firebase config to `.env.local`

### 3. Google OAuth Setup
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Google sign-in provider
3. Add your domain to authorized domains
4. Configure OAuth consent screen in Google Cloud Console

## 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context provider
├── components/
│   └── auth/
│       ├── LoginForm.tsx        # Email/password login form
│       └── SignupForm.tsx       # User registration form
├── config/
│   └── firebase.ts              # Firebase configuration
└── app/
    ├── layout.tsx               # Root layout with AuthProvider
    ├── page.tsx                 # Landing page with auth integration
    └── auth/
        └── page.tsx             # Authentication page
```

## 🔧 Available Methods

### AuthContext Hook
```tsx
const { 
  user,              // Current user object or null
  loading,           // Loading state
  signIn,            // Email/password sign in
  signUp,            // User registration
  signInWithGoogle,  // Google OAuth sign in
  logout,            // Sign out current user
  resetPassword      // Send password reset email
} = useAuth();
```

### Usage Example
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signOut } = useAuth();
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

## 🎨 UI Components

### LoginForm
- Email and password fields
- Google sign-in button
- Form validation
- Error handling
- Loading states

### SignupForm
- Email, password, and confirm password fields
- Display name field
- Role selection (founder/consultant)
- Google sign-up button
- Form validation
- Error handling

## 🔒 Security Features

- Client-side form validation
- Firebase security rules (configure in Firebase Console)
- Secure password requirements (minimum 6 characters)
- Email verification (can be enabled in Firebase Console)
- Session management with automatic token refresh

## 🚀 Next Steps

1. **Configure Firebase Security Rules**: Set up proper Firestore security rules
2. **Add Email Verification**: Enable email verification in Firebase Console
3. **Implement Protected Routes**: Create middleware for route protection
4. **Add User Profiles**: Create user profile management system
5. **Add Social Providers**: Enable additional OAuth providers (Facebook, Twitter, etc.)

## 📝 Notes

- The app is wrapped with `AuthProvider` in the root layout
- Authentication state persists across page refreshes
- All forms include proper loading states and error handling
- The design follows the app's glass-morphism theme
- Google OAuth requires proper domain configuration in Firebase Console