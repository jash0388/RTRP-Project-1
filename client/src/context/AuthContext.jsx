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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem('sphn_token', idToken);
        setToken(idToken);
        
        // You might want to map firebase user to your custom user format
        // For now, defaulting role to citizen or deriving from email
        let role = 'user';
        if (firebaseUser.email && firebaseUser.email.includes('admin')) {
          role = 'admin';
        } else if (firebaseUser.email && firebaseUser.email.includes('police')) {
          role = 'police';
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: role
        });
      } else {
        localStorage.removeItem('sphn_token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Wait for auth state change to set user, but we can return mocked data for immediate navigation
      let role = 'user';
      if (email.includes('admin')) role = 'admin';
      if (email.includes('police')) role = 'police';
      
      return { email, role };
    } catch (err) {
      throw new Error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // We could update profile with name here, but keeping it simple
      let role = 'user';
      if (email.includes('admin')) role = 'admin';
      if (email.includes('police')) role = 'police';

      return { email, name, role };
    } catch (err) {
      throw new Error(err.message || 'Registration failed.');
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email || '';
      
      let role = 'user';
      if (email.includes('admin')) role = 'admin';
      if (email.includes('police')) role = 'police';

      return { email, name: result.user.displayName, role };
    } catch (err) {
      throw new Error(err.message || 'Google Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
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
