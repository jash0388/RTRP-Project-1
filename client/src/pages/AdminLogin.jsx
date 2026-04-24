import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await adminLogin(email, password);
      if (data.role !== 'admin') {
        throw new Error('Access denied. This portal is restricted to System Administrators.');
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-md)' }}>
      <div className="card fade-in" style={{ 
        maxWidth: '420px', 
        width: '100%', 
        padding: 'var(--space-2xl)', 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #1e293b',
        background: '#1e293b',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        borderTop: '4px solid #b91c1c'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: '#b91c1c', 
            color: 'white', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 900,
            margin: '0 auto var(--space-md) auto'
          }}>ADM</div>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>System Administration</h2>
          <p style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>High-Security Management Gateway</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-md)',
            color: '#fca5a5',
            fontSize: 'var(--font-xs)',
            marginBottom: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#e2e8f0' }}>Admin ID / Email</label>
            <input
              type="email"
              className="form-input"
              style={{ background: '#0f172a', borderColor: '#334155', color: '#fff' }}
              placeholder="admin@roadsuraksha.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="form-label" style={{ color: '#e2e8f0' }}>Terminal Password</label>
            <input
              type="password"
              className="form-input"
              style={{ background: '#0f172a', borderColor: '#334155', color: '#fff' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ 
            width: '100%', 
            padding: '0.75rem', 
            fontSize: 'var(--font-sm)', 
            fontWeight: 700, 
            background: '#b91c1c', 
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }} disabled={loading}>
            {loading ? 'Authenticating Terminal...' : 'Authorize Administrative Access'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 'var(--font-xs)', borderTop: '1px solid #334155', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          Authorized Personnel Only. All access attempts are logged.
          <div style={{ marginTop: 'var(--space-md)' }}>
            <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600 }}>Return to Citizen Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
