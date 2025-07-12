# Firebase Integration Setup

This document provides a comprehensive guide for the Firebase integration in the Startup Copilot application.

## 🔥 Firebase Services Integrated

- **Authentication**: Email/password and Google OAuth
- **Firestore Database**: User profiles, startups, and consultations with optimized composite indexes
- **Analytics**: User behavior tracking
- **Storage**: File uploads (configured but not implemented)
- **Performance Optimization**: Composite indexes for fast query execution

## 📁 File Structure

```
src/
├── lib/
│   ├── firebase.ts              # Firebase configuration and initialization
│   └── firebase-service.ts      # Database service layer with CRUD operations
├── contexts/
│   └── AuthContext.tsx          # Authentication context provider
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx         # Login form component
│   │   ├── SignupForm.tsx        # Registration form component
│   │   └── ProtectedRoute.tsx    # Route protection wrapper
│   └── ui/
│       ├── alert.tsx             # Alert component for error messages
│       └── select.tsx            # Select dropdown component
└── app/
    └── auth/
        └── page.tsx              # Authentication page
```

## 🚀 Quick Start

### 1. Firebase Project Setup

Your Firebase project is already configured with the following details:
- **Project ID**: `startupcopilot-450dd`
- **Auth Domain**: `startupcopilot-450dd.firebaseapp.com`
- **Storage Bucket**: `startupcopilot-450dd.firebasestorage.app`

### 2. Environment Variables (Recommended)

For production, move your Firebase config to environment variables:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDScN_pRre0njQqoMMRHhe-8KedgNBKh-8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=startupcopilot-450dd.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=startupcopilot-450dd
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=startupcopilot-450dd.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=195338450714
NEXT_PUBLIC_FIREBASE_APP_ID=1:195338450714:web:98ce5a6a070cf1a00f1ea3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YXFWHXPMY8
```

### 3. Firebase Console Configuration

#### Authentication Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `startupcopilot-450dd`
3. Navigate to **Authentication** > **Sign-in method**
4. Enable the following providers:
   - **Email/Password**: Enable
   - **Google**: Enable and configure OAuth consent screen

#### Firestore Database Setup
1. Navigate to **Firestore Database**
2. Create database in **production mode**
3. Choose your preferred region
4. **Deploy composite indexes** (required for optimized performance):
   ```bash
   firebase deploy --only firestore:indexes
   ```
5. Set up the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Startups can be read by anyone, written by founders
    match /startups/{startupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.founderId;
    }
    
    // Consultations can be read/written by participants
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.startupId || 
         request.auth.uid == resource.data.consultantId);
    }
  }
}
```

## 💻 Usage Examples

### Authentication

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn('email@example.com', 'password')}>
          Sign In
        </button>
      )}
    </div>
  );
}
```

### Database Operations

```tsx
import { StartupService, UserService } from '@/lib/firebase-service';

// Create a startup
const startupId = await StartupService.createStartup({
  name: 'My Startup',
  description: 'Revolutionary app',
  industry: 'Technology',
  stage: 'mvp',
  founderId: user.uid,
  teamSize: 3
});

// Get user's startups
const startups = await StartupService.getStartupsByFounder(user.uid);

// Create user profile
const profileId = await UserService.createUserProfile({
  uid: user.uid,
  email: user.email!,
  displayName: user.displayName!,
  role: 'founder'
});
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function Dashboard() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

## 🔧 Available Components

### AuthContext
Provides authentication state and methods throughout the app.

**Methods:**
- `signIn(email, password)` - Email/password sign in
- `signUp(email, password, displayName)` - Create new account
- `signInWithGoogle()` - Google OAuth sign in
- `logout()` - Sign out current user
- `resetPassword(email)` - Send password reset email

### LoginForm
Complete login form with email/password and Google sign-in options.

### SignupForm
Registration form with role selection (founder/consultant).

### ProtectedRoute
Wrapper component that redirects unauthenticated users to login.

## 📊 Data Models

### User Profile
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'founder' | 'consultant' | 'admin';
  bio?: string;
  expertise?: string[];
  experience?: string;
  linkedIn?: string;
  twitter?: string;
}
```

### Startup
```typescript
interface StartupData {
  name: string;
  description: string;
  industry: string;
  stage: 'idea' | 'mvp' | 'growth' | 'scale';
  founderId: string;
  teamSize: number;
  funding?: {
    amount: number;
    round: string;
    investors?: string[];
  };
  metrics?: {
    revenue?: number;
    users?: number;
    growth?: number;
  };
}
```

### Consultation
```typescript
interface ConsultationData {
  startupId: string;
  consultantId: string;
  title: string;
  description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: Timestamp;
  duration?: number;
  notes?: string;
  recommendations?: string[];
}
```

## 🛡️ Security Best Practices

1. **Environment Variables**: Move Firebase config to environment variables in production
2. **Firestore Rules**: Implement proper security rules (examples provided above)
3. **Input Validation**: Always validate user inputs before saving to database
4. **Error Handling**: Implement proper error handling for all Firebase operations
5. **Rate Limiting**: Consider implementing rate limiting for sensitive operations

## 🚀 Next Steps

1. **Deploy Firestore indexes** (required): `firebase deploy --only firestore:indexes`
2. **Wrap your app with AuthProvider** in `layout.tsx` or `_app.tsx`
3. **Set up Firestore security rules** in Firebase Console
4. **Enable Google OAuth** in Firebase Console
5. **Test authentication flow** by visiting `/auth`
6. **Verify database optimization** in Firebase Console
7. **Implement user profile creation** after successful registration
8. **Add role-based access control** to ProtectedRoute component

## 📝 Testing

To test the Firebase integration:

1. Start your development server: `npm run dev`
2. Navigate to `/auth` to test authentication
3. Try both email/password and Google sign-in
4. Check Firebase Console to see user creation
5. Test protected routes with ProtectedRoute wrapper

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase app not initialized"**
   - Ensure Firebase config is correct
   - Check that firebase package is installed

2. **"Auth domain not authorized"**
   - Add your domain to authorized domains in Firebase Console
   - For localhost, add `localhost` to authorized domains

3. **"Google sign-in not working"**
   - Enable Google provider in Firebase Console
   - Configure OAuth consent screen
   - Add authorized domains

4. **"Firestore permission denied"**
   - Check Firestore security rules
   - Ensure user is authenticated
   - Verify document structure matches rules

5. **"The query requires an index"**
   - Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
   - Check Firebase Console → Firestore → Indexes for index status
   - Verify composite indexes are properly configured

### Debug Mode

Enable Firebase debug mode by adding to your environment:
```bash
NEXT_PUBLIC_FIREBASE_DEBUG=true
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js with Firebase](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)