import { createContext, useContext, useState, useEffect } from 'react';

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
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          setUser(data);
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const safeJsonParse = async (res) => {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const login = async (email, password) => {
    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch {
      throw new Error('Unable to connect to the server. Make sure the backend is running.');
    }
    const data = await safeJsonParse(res);
    if (!res.ok) throw new Error(data?.message || 'Login failed. Please check your credentials.');
    if (!data?.token) throw new Error('Invalid response from server.');
    localStorage.setItem('sphn_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    let res;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
    } catch {
      throw new Error('Unable to connect to the server. Make sure the backend is running.');
    }
    const data = await safeJsonParse(res);
    if (!res.ok) throw new Error(data?.message || 'Registration failed.');
    if (!data?.token) throw new Error('Invalid response from server.');
    localStorage.setItem('sphn_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const googleLogin = async (credentialToken) => {
    let res;
    try {
      res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialToken })
      });
    } catch {
      throw new Error('Unable to connect to the server. Make sure the backend is running.');
    }
    const data = await safeJsonParse(res);
    if (!res.ok) throw new Error(data?.message || 'Google Login failed. Please try again.');
    if (!data?.token) throw new Error('Invalid response from server.');
    localStorage.setItem('sphn_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sphn_token');
    setToken(null);
    setUser(null);
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
      {children}
    </AuthContext.Provider>
  );
}
