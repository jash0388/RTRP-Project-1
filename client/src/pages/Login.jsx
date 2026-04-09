import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      switch (data.role) {
        case 'admin': navigate('/admin'); break;
        case 'police': navigate('/police'); break;
        default: navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setError('');
    setLoading(true);
    try {
      const data = await googleLogin(response.credential);
      switch (data.role) {
        case 'admin': navigate('/admin'); break;
        case 'police': navigate('/police'); break;
        default: navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Login was unsuccessful. Try again.');
  };

  return (
    <div className="auth-page" style={{ background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-md)' }}>
      <div className="auth-card glass fade-in" style={{ 
        maxWidth: '440px', 
        width: '100%', 
        padding: 'var(--space-3xl) var(--space-2xl)', 
        borderRadius: 'var(--radius-2xl)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="auth-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
          <div className="auth-logo-icon" style={{ 
            width: '56px', 
            height: '56px', 
            background: 'white', 
            color: 'black', 
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-xl)',
            fontWeight: 800
          }}>R</div>
          <div className="serif" style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>RoadSuraksha</div>
        </div>

        <h2 className="serif" style={{ fontSize: 'var(--font-3xl)', marginBottom: 'var(--space-xs)' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-2xl)' }}>
          Access your secure management portal
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            color: '#f87171',
            fontSize: 'var(--font-xs)',
            marginBottom: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'white' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="login-email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="form-label" style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'white' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="login-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: 'var(--space-lg)' }} disabled={loading} id="login-submit">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-sm)', marginBottom: 'var(--space-lg)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          — or continue with —
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text="signin_with"
          />
        </div>

        <div className="auth-footer" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
          New to the platform?{' '}
          <Link to="/register" style={{ color: 'white', fontWeight: 600 }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}
