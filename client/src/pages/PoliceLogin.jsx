import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PoliceLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password, 'police');
      // Allow both police and admin to login here if they have credentials, 
      // but primarily intended for enforcement.
      if (data.role === 'user') {
        throw new Error('Access denied. This portal is reserved for Enforcement Personnel.');
      }
      navigate('/police');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
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
        boxShadow: 'var(--shadow-lg)',
        borderTop: '4px solid var(--primary-700)'
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
          }}>POL</div>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '4px' }}>Enforcement Gateway</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Traffic Authority Official Login</p>
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
            <label className="form-label">Personnel ID / Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="officer@roadsuraksha.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="form-label">Duty Password</label>
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
            {loading ? 'Verifying Credentials...' : 'Sign In to Enforcement System'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--font-xs)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          Restricted to Traffic Enforcement Officials.
          <div style={{ marginTop: 'var(--space-md)' }}>
            <Link to="/login" style={{ color: 'var(--primary-700)', fontWeight: 600 }}>Citizen Entry Point</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
