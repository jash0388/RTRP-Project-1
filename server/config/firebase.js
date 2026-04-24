const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
// Looks for service account JSON in config/ directory
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

let firebaseApp;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized with service account');
} else {
  // Fallback: Use just the project ID. This allows verifyIdToken to work
  // even without a service account (but creating users will fail).
  try {
    firebaseApp = admin.initializeApp({
      projectId: 'rtrp-a11b1'
    });
    console.log('Firebase Admin SDK initialized with projectId (token verification enabled)');
  } catch (err) {
    console.warn('⚠️  Firebase Admin SDK NOT initialized. Place firebase-service-account.json in server/config/');
    console.warn('   Download from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key');
  }
}

const firebaseAuth = admin.apps.length ? admin.auth() : null;

/**
 * Verify a Firebase ID token and return the decoded payload
 * @param {string} idToken - Firebase ID token from the client
 * @returns {Promise<admin.auth.DecodedIdToken>}
 */
const verifyFirebaseToken = async (idToken) => {
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK is not initialized. Cannot verify tokens.');
  }
  return await firebaseAuth.verifyIdToken(idToken);
};

/**
 * Create a user in Firebase Auth
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<admin.auth.UserRecord>}
 */
const createFirebaseUser = async (email, password, displayName) => {
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK is not initialized. Cannot create users.');
  }
  try {
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: true
    });
    return userRecord;
  } catch (error) {
    // If user already exists in Firebase, that's OK
    if (error.code === 'auth/email-already-exists') {
      console.log(`Firebase user already exists: ${email}`);
      return await firebaseAuth.getUserByEmail(email);
    }
    throw error;
  }
};

/**
 * Delete a user from Firebase Auth by email
 * @param {string} email
 */
const deleteFirebaseUser = async (email) => {
  if (!firebaseAuth) return;
  try {
    const userRecord = await firebaseAuth.getUserByEmail(email);
    await firebaseAuth.deleteUser(userRecord.uid);
  } catch (error) {
    // Ignore if user doesn't exist in Firebase
    if (error.code !== 'auth/user-not-found') {
      console.error('Error deleting Firebase user:', error.message);
    }
  }
};

module.exports = { firebaseAuth, verifyFirebaseToken, createFirebaseUser, deleteFirebaseUser };
