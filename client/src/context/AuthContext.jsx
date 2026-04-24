import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { supabase } from '../supabase';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sphn_token'));
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored backend token and validate it
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !token) {
        // Firebase user is signed in but we don't have a backend token yet
        // This can happen on page refresh — try to exchange the Firebase token
        try {
          const idToken = await firebaseUser.getIdToken(true);
          const data = await authAPI.firebaseLogin(idToken);
          localStorage.setItem('sphn_token', data.token);
          setToken(data.token);
          setUser(data);
        } catch (err) {
          console.error('Auto-login via Firebase failed:', err.message);
          // Don't clear Firebase session — user might just need to re-login on the portal
        }
      } else if (token) {
        // We have a backend token — validate it
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (err) {
          // Backend token is invalid/expired
          console.error('Backend token invalid:', err.message);
          localStorage.removeItem('sphn_token');
          setToken(null);
          setUser(null);
        }
      } else {
        // No Firebase user and no token
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login with email/password via Firebase, then exchange for backend JWT
   * @param {string} email
   * @param {string} password
   * @param {string} loginType - 'user' | 'police' | 'admin'
   */
  const login = async (email, password, loginType = 'user') => {
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Exchange Firebase token for backend JWT (with role enforcement)
      const data = await authAPI.firebaseLogin(idToken, loginType);

      // 3. Store backend token and user data
      localStorage.setItem('sphn_token', data.token);
      setToken(data.token);
      setUser(data);

      return data;
    } catch (err) {
      // Sign out of Firebase if backend rejected the login
      try { await signOut(auth); } catch (_) {}
      throw new Error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  /**
   * Register a new citizen account via Firebase, then exchange for backend JWT
   */
  const register = async (name, email, password) => {
    try {
      // 1. Create account in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Exchange Firebase token for backend JWT (auto-creates user record with role 'user')
      const data = await authAPI.firebaseLogin(idToken, 'user');

      // 3. Store backend token and user data
      localStorage.setItem('sphn_token', data.token);
      setToken(data.token);
      setUser(data);

      return data;
    } catch (err) {
      throw new Error(err.message || 'Registration failed.');
    }
  };

  /**
   * Google sign-in via Firebase popup, then exchange for backend JWT
   */
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Exchange for backend JWT (auto-creates citizen account if new)
      const data = await authAPI.firebaseLogin(idToken, 'user');

      localStorage.setItem('sphn_token', data.token);
      setToken(data.token);
      setUser(data);

      return data;
    } catch (err) {
      throw new Error(err.message || 'Google Login failed. Please try again.');
    }
  };

  /**
   * Admin Login via Supabase
   */
  const adminLogin = async (email, password) => {
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // 2. Exchange Supabase token for backend JWT
      const data = await authAPI.supabaseLogin(authData.session.access_token);

      // 3. Store backend token and user data
      localStorage.setItem('sphn_token', data.token);
      setToken(data.token);
      setUser(data);

      return data;
    } catch (err) {
      // Sign out of Supabase if backend rejected
      try { await supabase.auth.signOut(); } catch (_) {}
      throw new Error(err.message || 'Admin login failed. Please check your credentials.');
    }
  };

  /**
   * Logout from both Firebase, Supabase and the backend
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signOut error:', err);
    }
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase signOut error:', err);
    }
    localStorage.removeItem('sphn_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    adminLogin,
    googleLogin,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
