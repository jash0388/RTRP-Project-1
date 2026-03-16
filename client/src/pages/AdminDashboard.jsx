import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, analyticsAPI } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, reportsData] = await Promise.all([
        analyticsAPI.getSummary(),
        adminAPI.getReports({ limit: 5 })
      ]);
      setStats(summaryData);
      setRecentReports(reportsData.reports || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
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
        <h1 className="page-title">Admin Dashboard 🛡️</h1>
        <p className="page-subtitle">Overview of all traffic violation reports and system metrics</p>
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
        <div className="stat-card pink">
          <div className="stat-icon">📆</div>
          <div className="stat-info">
            <div className="stat-label">This Month</div>
            <div className="stat-value">{stats?.monthlyCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <Link to="/admin/reports" className="btn btn-primary">📑 Manage Reports</Link>
        <Link to="/admin/users" className="btn btn-secondary">👥 Manage Users</Link>
        <Link to="/analytics" className="btn btn-secondary">📈 Full Analytics</Link>
      </div>

      {/* Top Violations */}
      {stats?.violationsByType?.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="card-header">
            <h3 className="card-title">Top Violations</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              {stats.violationsByType.slice(0, 6).map(v => (
                <div key={v._id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  flex: '1 0 auto', minWidth: '160px'
                }}>
                  <span className="violation-badge">{formatViolation(v._id)}</span>
                  <span style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>{v.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Reports Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Reports</h3>
          <Link to="/admin/reports" className="btn btn-ghost btn-sm">View All →</Link>
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
                    <th>Type</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>AI Plate</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 500 }}>{r.user?.name || 'Unknown'}</td>
                      <td><span className="violation-badge">{formatViolation(r.violationType)}</span></td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                        {r.location?.address || 'GPS'}
                      </td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-sm)' }}>
                        {r.aiResults?.numberPlate || '—'}
                      </td>
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
