import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password entries do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be a minimum of 6 characters for security.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please attempt again later.');
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
      setError(err.message || 'Google authentication unsuccessful.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-md)' }}>
      <div className="card fade-in" style={{ 
        maxWidth: '460px', 
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
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '4px' }}>Citizen Registration</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Official Portal Enrollment</p>
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="As per official documents"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter valid email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Verify password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: 'var(--font-sm)', fontWeight: 700, marginTop: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }} disabled={loading}>
            {loading ? 'Processing Registration...' : 'Commit Portal Registration'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-lg) 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <div style={{ padding: '0 10px', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Or Social Login</div>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Registration Failed')}
            theme="filled_blue"
            size="large"
            width="100%"
            text="signup_with"
          />
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          Already enrolled?{' '}
          <Link to="/login" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>Sign In Here</Link>
        </div>
      </div>
    </div>
  );
}
