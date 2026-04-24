const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

let firebaseApp = null;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized with service account');
  } catch (err) {
    console.warn('Firebase Admin SDK init failed:', err.message);
  }
} else if (process.env.FIREBASE_PROJECT_ID) {
  try {
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('Firebase Admin SDK initialized with projectId only (token verification only)');
  } catch (err) {
    console.warn('Firebase Admin SDK init failed:', err.message);
  }
} else {
  console.log('Firebase Admin SDK not configured. Firebase login routes will be disabled.');
}

const firebaseAuth = admin.apps.length ? admin.auth() : null;

const verifyFirebaseToken = async (idToken) => {
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK is not initialized.');
  }
  return await firebaseAuth.verifyIdToken(idToken);
};

const createFirebaseUser = async (email, password, displayName) => {
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK is not initialized.');
  }
  try {
    return await firebaseAuth.createUser({ email, password, displayName, emailVerified: true });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return await firebaseAuth.getUserByEmail(email);
    }
    throw error;
  }
};

const deleteFirebaseUser = async (email) => {
  if (!firebaseAuth) return;
  try {
    const userRecord = await firebaseAuth.getUserByEmail(email);
    await firebaseAuth.deleteUser(userRecord.uid);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      console.error('Error deleting Firebase user:', error.message);
    }
  }
};

module.exports = { firebaseAuth, verifyFirebaseToken, createFirebaseUser, deleteFirebaseUser };
