# 🔥 Firebase Setup Guide

## Quick Fix for Current Error

If you're seeing the `Firebase: Error (auth/invalid-api-key)` error, follow these steps:

### 1. Environment Variables Setup

Your `.env.local` file has been created with placeholder values. You need to replace them with actual Firebase credentials:

```bash
# Current placeholder values in .env.local (REPLACE THESE)
NEXT_PUBLIC_FIREBASE_API_KEY=placeholder_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=placeholder.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=placeholder
# ... etc
```

### 2. Get Your Firebase Credentials

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** (or select existing one)
3. **Click on "Project Settings" (gear icon)**
4. **Scroll down to "Your apps" section**
5. **Click "Add app" → Web app (</> icon)**
6. **Register your app** with a nickname
7. **Copy the configuration values**

### 3. Update Your .env.local File

Replace the placeholder values with your actual Firebase config:

```bash
# Replace with your actual Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123DEF4
```

### 4. Enable Authentication Methods

In Firebase Console:
1. **Go to Authentication → Sign-in method**
2. **Enable "Email/Password"**
3. **Enable "Google"** (optional)
   - Add your domain to authorized domains
   - Configure OAuth consent screen

### 5. Configure Firestore (Optional)

If using database features:
1. **Go to Firestore Database**
2. **Create database**
3. **Choose security rules** (start in test mode for development)

### 6. Restart Development Server

```bash
npm run dev
```

## Error Handling Improvements

The application now includes:

✅ **Graceful degradation** - App won't crash with missing config
✅ **Clear error messages** - Helpful warnings in console
✅ **Development-friendly** - Works with placeholder values
✅ **Type safety** - Proper TypeScript types

## Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to version control
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Keep sensitive keys server-side only

### Firebase Security Rules
```javascript
// Example Firestore rules for authenticated users
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Check if API key is correct
   - Ensure no extra spaces in .env.local
   - Restart development server

2. **"Auth Domain" Error**
   - Verify auth domain matches your project
   - Check for typos in domain name

3. **Google Sign-in Issues**
   - Add localhost:3000 to authorized domains
   - Configure OAuth consent screen
   - Check Google provider is enabled

4. **CORS Errors**
   - Add your domain to Firebase authorized domains
   - Check Authentication → Settings → Authorized domains

### Development vs Production

**Development (.env.local)**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

**Production (.env.production)**
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

## Next Steps

1. ✅ Configure Firebase project
2. ✅ Update environment variables
3. ✅ Test authentication flow
4. 🔄 Set up Firestore security rules
5. 🔄 Configure email templates
6. 🔄 Set up production environment

## Support

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Check Firebase Console for any service outages

---

**Remember**: The app now gracefully handles missing Firebase configuration, so you can develop locally even without proper credentials. Just update them when you're ready to test authentication features!