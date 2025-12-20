# Firebase Configuration & Security Rules

## Overview
This guide provides Firebase Firestore and Storage rules to secure your salon management system while allowing proper access for admins and public users.

## 1. Firestore Security Rules

Copy these rules to your Firestore console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is admin (you can extend this based on custom claims)
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    // =============== PUBLIC COLLECTIONS (Read-only for everyone) ===============
    
    // Services - Public read, Admin write
    match /services/{document=**} {
      allow read: if true; // Everyone can read
      allow write: if isAdmin(); // Only admins can write
    }
    
    // Team members - Public read, Admin write
    match /team/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Gallery images - Public read, Admin write
    match /gallery/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Testimonials - Public read, Admin write
    match /testimonials/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // FAQs - Public read, Admin write
    match /faqs/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Blog posts - Public read (only published), Admin write
    match /blog/{document=**} {
      allow read: if resource.data.published == true || isAdmin();
      allow write: if isAdmin();
    }
    
    // Special offers - Public read (only active), Admin write
    match /offers/{document=**} {
      allow read: if resource.data.active == true || isAdmin();
      allow write: if isAdmin();
    }
    
    // Contact information - Public read, Admin write
    match /contact/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Hero content - Public read, Admin write
    match /hero/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // =============== ADMIN ONLY COLLECTIONS ===============
    
    // Admin activity logs
    match /adminLogs/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // User management
    match /users/{document=**} {
      allow read: if isAdmin() || request.auth.uid == document;
      allow write: if isAdmin();
    }
    
  }
}
```

## 2. Firebase Storage Rules

Copy these rules to your Storage console:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is admin
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    // All public content - Anyone can read, only admins can write
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Admin uploads - Only admins
    match /admin/{allPaths=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // User uploads - Each user can access their own
    match /users/{userId}/{allPaths=**} {
      allow read: if isAdmin() || request.auth.uid == userId;
      allow write: if isAdmin() || request.auth.uid == userId;
    }
    
  }
}
```

## 3. Setting Admin Claims

To make a user an admin, use the Firebase Admin SDK:

### Using Firebase Console (Easiest)
1. Go to Firebase Console → Authentication
2. Find the user
3. Click on the user to edit custom claims
4. Add: `{"admin": true}`

### Using Node.js Admin SDK
```javascript
const admin = require('firebase-admin');

admin.initializeApp();

async function setAdminClaim(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for user: ${uid}`);
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
}

// Usage
setAdminClaim('user-uid-here');
```

### Using Firebase CLI
```bash
firebase auth:import --hash-algo=scrypt path/to/users.json
```

## 4. Step-by-Step Setup

### Step 1: Create Firestore Database
1. Go to Firebase Console
2. Click "Firestore Database"
3. Click "Create Database"
4. Choose region (usually closest to your users)
5. Start in test mode (we'll secure it next)

### Step 2: Create Storage Bucket
1. Go to Firebase Console
2. Click "Storage"
3. Click "Get Started"
4. Choose region (same as Firestore if possible)
5. Choose "Start in test mode"

### Step 3: Apply Security Rules
1. Go to Firestore → Rules tab
2. Paste the Firestore rules above
3. Click "Publish"
4. Go to Storage → Rules tab
5. Paste the Storage rules above
6. Click "Publish"

### Step 4: Create Admin User
1. Go to Authentication tab
2. Create a test user (or use existing)
3. Set custom claim `{"admin": true}` for that user
4. Log out and log back in for claims to take effect

### Step 5: Test Access
1. Try adding content as admin - should work ✅
2. Try deleting with public session - should fail ✅
3. Try reading public content - should work ✅

## 5. Collection Structure in Firestore

The following collections will be created automatically by the app:

```
Firestore Collections:
├── services/
│   ├── service-id-1
│   │   ├── name: string
│   │   ├── description: string
│   │   ├── price: number
│   │   ├── duration: number
│   │   ├── featured: boolean
│   │   └── image: string (Storage URL)
│   └── ...
│
├── team/
│   ├── member-id-1
│   │   ├── name: string
│   │   ├── role: string
│   │   ├── specialties: array
│   │   ├── experience: number
│   │   └── image: string (Storage URL)
│   └── ...
│
├── gallery/
│   ├── image-id-1
│   │   ├── type: string (hair, nails, makeup, spa)
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── before: string (Storage URL)
│   │   ├── after: string (Storage URL)
│   │   └── timestamp: timestamp
│   └── ...
│
├── blog/
│   ├── post-id-1
│   │   ├── title: string
│   │   ├── content: string
│   │   ├── category: string
│   │   ├── published: boolean
│   │   ├── author: string
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
│
├── offers/
│   ├── offer-id-1
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── discountType: string (percentage/fixed)
│   │   ├── discountValue: number
│   │   ├── code: string
│   │   ├── active: boolean
│   │   └── timestamp: timestamp
│   └── ...
│
├── faqs/
│   ├── faq-id-1
│   │   ├── question: string
│   │   ├── answer: string
│   │   ├── category: string
│   │   └── order: number
│   └── ...
│
├── testimonials/
│   ├── review-id-1
│   │   ├── name: string
│   │   ├── text: string
│   │   ├── rating: number
│   │   ├── image: string (Storage URL)
│   │   └── timestamp: timestamp
│   └── ...
│
├── hero/
│   ├── main
│   │   ├── heading: string
│   │   ├── subheading: string
│   │   ├── ctaText: string
│   │   └── backgroundImage: string (Storage URL)
│
└── contact/
    └── main
        ├── address: string
        ├── phone: string
        ├── email: string
        └── hours: object
            ├── monday: string
            ├── tuesday: string
            └── ...
```

## 6. Storage Folder Structure

```
Storage Buckets:
└── salon-storage/
    ├── services/
    │   ├── service-id-1.jpg
    │   └── ...
    ├── team/
    │   ├── member-id-1.jpg
    │   └── ...
    ├── gallery/
    │   ├── image-id-1-before.jpg
    │   ├── image-id-1-after.jpg
    │   └── ...
    ├── blog/
    │   ├── post-id-1.jpg
    │   └── ...
    └── hero/
        └── hero-bg.jpg
```

## 7. Backup Configuration

### Enable Automatic Backups
1. Go to Firestore
2. Click "Backups" tab
3. Click "Manage backups"
4. Enable "On Demand" or "Scheduled"
5. Choose backup location

### Manual Backup
1. Go to Firestore → Backups
2. Click "Create backup"
3. Choose collections to backup
4. Click "Backup"

## 8. Monitoring & Analytics

### View Database Usage
1. Go to Firestore → Usage tab
2. Monitor read/write operations
3. Check storage consumption

### View Storage Usage
1. Go to Storage → Files tab
2. See file count and storage size
3. Monitor bandwidth usage

## 9. Cost Optimization

- **Read Optimization**: Cache data on frontend where possible
- **Write Optimization**: Batch updates together
- **Storage Optimization**: Compress images before uploading
- **Indexing**: Only create necessary composite indexes

## 10. Troubleshooting

### Issue: "Permission denied" when adding content
**Solution:**
- Check user has admin claim set
- Verify Firestore rules are published
- User may need to re-authenticate after claim is set

### Issue: Can't upload images
**Solution:**
- Check Storage rules are published
- Verify bucket exists
- Check file size limits
- Verify file format supported

### Issue: Public can't see blog posts
**Solution:**
- Verify blog posts have `published: true`
- Check Firestore read rules for blog collection
- Clear browser cache and reload

### Issue: Quota exceeded error
**Solution:**
- Check Firestore/Storage usage in console
- Consider enabling Blaze plan for higher limits
- Optimize queries to reduce reads
- Implement caching on frontend

## 11. Production Checklist ✅

- [ ] Firestore Security Rules reviewed and published
- [ ] Storage Security Rules reviewed and published
- [ ] Admin users set with custom claims
- [ ] Backup strategy configured
- [ ] Database indexes optimized
- [ ] Error logging configured
- [ ] Rate limiting considered
- [ ] CORS configured if needed
- [ ] Monitoring alerts set up
- [ ] Tested with production rules (not test mode)

---

## Additional Resources

- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Custom Claims](https://firebase.google.com/docs/auth/admin-setup)
- [Firebase Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Last Updated:** 2024
**Status:** Complete
**Security Level:** Production Ready
