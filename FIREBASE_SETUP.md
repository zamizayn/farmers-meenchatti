# Firebase Setup Instructions

To make the reservation system and admin panel work, you need to set up a Firebase project.

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the steps.

## 2. Enable Firestore Database
1. In your project dashboard, go to **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose a location and start in **Test mode** (for development) or **Production mode** (you will need to update rules).
4. Create a collection named `reservations` (optional, the code will create it automatically when a reservation is made, but you might want to create it to set rules).

## 3. Enable Authentication
1. Go to **Build** > **Authentication**.
2. Click **Get started**.
3. Enable **Email/Password** provider.
4. Go to the **Users** tab and click **Add user**.
5. Enter an email and password (e.g., `admin@farmers.com` / `password123`). This will be your **Admin Credential**.

## 4. Get Configuration Keys
1. Go to **Project Settings** (gear icon).
2. Scroll down to **Your apps**.
3. Click the Web icon (`</>`) to create a web app.
4. Register the app (you can ignore hosting setup for now).
5. Copy the `firebaseConfig` object (apiKey, authDomain, etc.).

## 5. Update Code
1. Open `firebase.ts` in the root of your project.
2. Replace the placeholder values with your actual configuration keys from Step 4.

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "...",
  // ...
};
```

## 6. Firestore Rules (Production)
If you switch to Production mode, ensure your Firestore rules allow the public to **create** reservations, but only authenticated admins to **read/update/delete** them.

Example Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{reservation} {
      allow create: if true; // Public can book
      allow read, update, delete: if request.auth != null; // Only admin can manage
    }
  }
}
```
