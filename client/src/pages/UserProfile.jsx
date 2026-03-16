import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../services/api';

export default function UserProfile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

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

          {/* Account Settings Placeholder */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Account Settings</h3>
            </div>
            <div className="card-body">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-md)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <span style={{ fontSize: '1.25rem' }}>🔒</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>Password</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Last changed: Never</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" disabled>Change</button>
              </div>
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
