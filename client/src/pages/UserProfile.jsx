import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../services/api';

const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { id: 'digit', label: 'One digit (0-9)', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function UserProfile() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const ruleResults = useMemo(() => passwordRules.map(rule => ({
    ...rule, passed: rule.test(newPassword)
  })), [newPassword]);
  const allRulesPassed = ruleResults.every(r => r.passed);
  const passedCount = ruleResults.filter(r => r.passed).length;
  const strengthLabel = passedCount <= 2 ? 'Weak' : passedCount <= 4 ? 'Medium' : 'Strong';
  const strengthColor = passedCount <= 2 ? '#ef4444' : passedCount <= 4 ? '#f59e0b' : '#22c55e';

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const data = await reportsAPI.getMyReports(1, 100);
      const reports = data.reports || [];
      setStats({
        total: data.total || reports.length || 0,
        pending: reports.filter(r => r.status === 'pending').length,
        approved: reports.filter(r => r.status === 'approved').length,
        rejected: reports.filter(r => r.status === 'rejected').length,
      });
    } catch (err) {
      console.error('Failed to load profile stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!allRulesPassed) {
      setPwError('New password does not meet all security requirements.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setPwError('New password must be different from current password.');
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      setPwSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'N/A';

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile 👤</h1>
        <p className="page-subtitle">View your account information and report activity</p>
      </div>

      <div className="profile-grid">
        {/* Left — Profile Card */}
        <div>
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="profile-name">{user?.name || 'User'}</div>
              <div className="profile-role-badge">
                🛡️ {user?.role === 'admin' ? 'System Admin' : user?.role === 'police' ? 'Traffic Police' : 'Citizen Reporter'}
              </div>
            </div>

            <div className="profile-card-body">
              <div className="profile-detail">
                <div className="profile-detail-icon">📧</div>
                <div className="profile-detail-info">
                  <div className="profile-detail-label">Email Address</div>
                  <div className="profile-detail-value">{user?.email || 'N/A'}</div>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">🏷️</div>
                <div className="profile-detail-info">
                  <div className="profile-detail-label">Account Role</div>
                  <div className="profile-detail-value" style={{ textTransform: 'capitalize' }}>{user?.role || 'user'}</div>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">📅</div>
                <div className="profile-detail-info">
                  <div className="profile-detail-label">Member Since</div>
                  <div className="profile-detail-value">{joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Stats & Activity */}
        <div>
          {/* Activity Stats */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">📋</div>
              <div className="profile-stat-value">{stats.total}</div>
              <div className="profile-stat-label">Total Reports</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">⏳</div>
              <div className="profile-stat-value">{stats.pending}</div>
              <div className="profile-stat-label">Pending Review</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">✅</div>
              <div className="profile-stat-value">{stats.approved}</div>
              <div className="profile-stat-label">Approved</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">❌</div>
              <div className="profile-stat-value">{stats.rejected}</div>
              <div className="profile-stat-label">Rejected</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <Link to="/submit-report" className="btn btn-primary" id="profile-report-btn">
                📸 Report a Violation
              </Link>
              <Link to="/report-history" className="btn btn-secondary" id="profile-history-btn">
                📋 View Report History
              </Link>
              <Link to="/dashboard" className="btn btn-ghost" id="profile-dashboard-btn">
                📊 Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Account Settings */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Account Settings</h3>
            </div>
            <div className="card-body">
              {/* Password Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-md)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: showPasswordForm ? 'var(--space-md)' : 'var(--space-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <span style={{ fontSize: '1.25rem' }}>🔒</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>Password</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                      {showPasswordForm ? 'Enter details below to change' : 'Click Change to update your password'}
                    </div>
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${showPasswordForm ? 'btn-ghost' : 'btn-secondary'}`}
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setPwError(''); setPwSuccess('');
                    setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
                  }}
                >
                  {showPasswordForm ? 'Cancel' : 'Change'}
                </button>
              </div>

              {/* Inline Password Change Form */}
              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-lg)',
                  marginBottom: 'var(--space-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  {pwError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-md)', color: '#b91c1c', fontSize: 'var(--font-xs)', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
                      {pwError}
                    </div>
                  )}
                  {pwSuccess && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-md)', color: '#166534', fontSize: 'var(--font-xs)', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
                      ✅ {pwSuccess}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--font-xs)' }}>Current Password</label>
                    <input type="password" className="form-input" placeholder="Enter current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--font-xs)' }}>New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Create a strong new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      style={{ borderColor: newPassword.length > 0 ? (allRulesPassed ? '#22c55e' : '#f59e0b') : undefined }}
                    />
                    {newPassword.length > 0 && (
                      <div style={{ marginTop: '8px', padding: 'var(--space-sm) var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Strength</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: strengthColor }}>{strengthLabel}</span>
                        </div>
                        <div style={{ height: '3px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                          <div style={{ height: '100%', width: `${(passedCount / 5) * 100}%`, background: strengthColor, borderRadius: '2px', transition: 'all 0.3s ease' }} />
                        </div>
                        {ruleResults.map(rule => (
                          <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: rule.passed ? '#22c55e' : 'var(--text-tertiary)', fontWeight: rule.passed ? 600 : 400, marginBottom: '2px' }}>
                            <span>{rule.passed ? '✓' : '✗'}</span>
                            {rule.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--font-xs)' }}>Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Repeat your new password"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required
                      style={{ borderColor: confirmNewPassword.length > 0 ? (confirmNewPassword === newPassword ? '#22c55e' : '#ef4444') : undefined }}
                    />
                    {confirmNewPassword.length > 0 && confirmNewPassword !== newPassword && (
                      <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>Passwords do not match</p>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm" disabled={pwLoading || !allRulesPassed} style={{ width: '100%' }}>
                    {pwLoading ? 'Updating...' : '🔐 Update Password'}
                  </button>
                </form>
              )}

              {/* Notifications Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-md)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <span style={{ fontSize: '1.25rem' }}>🔔</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>Notifications</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Email notifications enabled</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" disabled>Configure</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
