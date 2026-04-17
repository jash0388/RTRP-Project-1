import React from 'react';
const { useState, useEffect } = React;
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PoliceDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('sphn_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, reportsRes] = await Promise.all([
        fetch('/api/police/stats', { headers }).then(r => r.json()),
        fetch('/api/police/reports?limit=5', { headers }).then(r => r.json())
      ]);

      setStats(statsRes);
      setRecentReports(reportsRes.reports || []);
    } catch (err) {
      console.error('Failed to load police dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  const formatViolation = (type) => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Police Dashboard 🚔</h1>
        <p className="page-subtitle">Welcome, Officer {user?.name}. Review and manage violation reports.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{stats?.totalReports || 0}</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{stats?.pendingReports || 0}</div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{stats?.approvedReports || 0}</div>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{stats?.rejectedReports || 0}</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-label">This Week</div>
            <div className="stat-value">{stats?.weeklyCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <Link to="/police/reports" className="btn btn-primary btn-lg">📑 Review All Reports</Link>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Reports</h3>
          <Link to="/police/reports" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recentReports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3 className="empty-state-title">No reports yet</h3>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Reporter</th>
                    <th>Violation</th>
                    <th>Location</th>
                    <th>AI Plate</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 500 }}>{r.user?.name || 'Citizen'}</td>
                      <td><span className="violation-badge">{formatViolation(r.violationType)}</span></td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                        {r.location?.address || 'GPS Location'}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-sm)', fontWeight: 600 }}>
                        {r.aiResults?.numberPlate || '—'}
                      </td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
