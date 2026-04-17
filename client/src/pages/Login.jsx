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
      setError(err.message || 'Verification failed. Please check your credentials.');
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
      const msg = err.message || 'Google authentication unsuccessful.';
      if (msg.includes('not configured') || msg.includes('GOOGLE_NOT_CONFIGURED')) {
        setError('Google Sign-In is not configured on the server. Please use email/password login instead.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-md)' }}>
      <div className="card fade-in" style={{ 
        maxWidth: '420px', 
        width: '100%', 
        padding: 'var(--space-2xl)', 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--primary-700)', 
            color: 'white', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 900,
            margin: '0 auto var(--space-md) auto'
          }}>RS</div>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '4px' }}>Citizen Portal</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Official Login</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-md)',
            color: '#b91c1c',
            fontSize: 'var(--font-xs)',
            marginBottom: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: 'var(--font-sm)', fontWeight: 700, marginBottom: 'var(--space-lg)' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Log In to System'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-lg) 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <div style={{ padding: '0 10px', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Social Access</div>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In failed. This may be due to popup being blocked or the Google Client ID not being configured. Please use email/password login instead.')}
            theme="filled_blue"
            size="large"
            width="100%"
          />
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          <div style={{ marginBottom: 'var(--space-sm)' }}>
            Identity not verified?{' '}
            <Link to="/register" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>Register as Citizen</Link>
          </div>
          <div style={{ fontSize: 'var(--font-xs)', marginTop: 'var(--space-md)', color: 'var(--text-tertiary)' }}>
            Official Personnel? Access the <Link to="/admin/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Admin Portal</Link> or <Link to="/police/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Police Gateway</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
