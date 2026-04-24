import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { id: 'digit', label: 'One digit (0-9)', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const ruleResults = useMemo(() => {
    return passwordRules.map(rule => ({
      ...rule,
      passed: rule.test(password)
    }));
  }, [password]);

  const passedCount = ruleResults.filter(r => r.passed).length;
  const allPassed = passedCount === passwordRules.length;

  const strengthLabel = passedCount === 0 ? '' :
    passedCount <= 2 ? 'Weak' :
    passedCount <= 4 ? 'Medium' : 'Strong';

  const strengthColor = passedCount <= 2 ? '#ef4444' :
    passedCount <= 4 ? '#f59e0b' : '#22c55e';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allPassed) {
      setError('Password does not meet all security requirements.');
      setShowRules(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password entries do not match. Please verify.');
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await googleLogin();
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

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowRules(true)}
              required
              style={{
                borderColor: password.length > 0 ? (allPassed ? '#22c55e' : '#f59e0b') : undefined
              }}
            />

            {/* Password Strength Indicator */}
            {(showRules || password.length > 0) && (
              <div style={{
                marginTop: 'var(--space-sm)',
                padding: 'var(--space-md)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strength</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: strengthColor }}>{strengthLabel}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(passedCount / passwordRules.length) * 100}%`,
                        background: strengthColor,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease, background 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}

                {/* Rule checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {ruleResults.map(rule => (
                    <div key={rule.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      color: rule.passed ? '#22c55e' : 'var(--text-tertiary)',
                      fontWeight: rule.passed ? 600 : 400,
                      transition: 'color 0.2s ease'
                    }}>
                      <span style={{ fontSize: '12px', width: '16px', textAlign: 'center' }}>
                        {rule.passed ? '✓' : '✗'}
                      </span>
                      {rule.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                borderColor: confirmPassword.length > 0 ? (confirmPassword === password ? '#22c55e' : '#ef4444') : undefined
              }}
            />
            {confirmPassword.length > 0 && confirmPassword !== password && (
              <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: 'var(--font-sm)', fontWeight: 700, marginTop: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }} disabled={loading || !allPassed}>
            {loading ? 'Processing Registration...' : 'Commit Portal Registration'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-lg) 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <div style={{ padding: '0 10px', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Or Social Login</div>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="btn"
            style={{ width: '100%', padding: '0.75rem', fontSize: 'var(--font-sm)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'white', color: '#333', border: '1px solid #ccc' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          Already enrolled?{' '}
          <Link to="/login" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>Sign In Here</Link>
        </div>
      </div>
    </div>
  );
}
