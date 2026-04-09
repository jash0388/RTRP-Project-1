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
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-2xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-xl)' }}>
        <h1 className="page-title">Executive Control</h1>
        <p className="page-subtitle">Real-time surveillance monitoring and system-wide violation metrics.</p>
      </div>

      {/* Stats Grid - High contrast and minimalist */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Total Reports</div>
          <div className="serif" style={{ fontSize: 'var(--font-4xl)' }}>{stats?.totalReports || 0}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fbbf24', marginBottom: 'var(--space-sm)' }}>Pending Verification</div>
          <div className="serif" style={{ fontSize: 'var(--font-4xl)', color: '#fbbf24' }}>{stats?.pendingReports || 0}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ade80', marginBottom: 'var(--space-sm)' }}>Confirmed Violations</div>
          <div className="serif" style={{ fontSize: 'var(--font-4xl)', color: '#4ade80' }}>{stats?.approvedReports || 0}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Current Month</div>
          <div className="serif" style={{ fontSize: 'var(--font-4xl)' }}>{stats?.monthlyCount || 0}</div>
        </div>
      </div>

      {/* High Priority Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-3xl)', flexWrap: 'wrap' }}>
        <Link to="/admin/reports" className="btn btn-primary">Review Queue</Link>
        <Link to="/admin/users" className="btn btn-secondary">User Management</Link>
        <Link to="/analytics" className="btn btn-secondary">System Analytics</Link>
      </div>

      {/* Violations Distribution */}
      {stats?.violationsByType?.length > 0 && (
        <div style={{ marginBottom: 'var(--space-3xl)' }}>
          <h3 className="serif" style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)' }}>Surveillance Taxonomy</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
            {stats.violationsByType.slice(0, 8).map(v => (
              <div key={v._id} className="card" style={{
                padding: 'var(--space-lg)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xs)' }}>
                  {formatViolation(v._id)}
                </div>
                <div className="serif" style={{ fontSize: 'var(--font-2xl)' }}>{v.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log (Recent Reports) */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', padding: 'var(--space-lg) var(--space-xl)' }}>
          <h3 className="serif" style={{ fontSize: 'var(--font-xl)' }}>Security Audit Log</h3>
          <Link to="/admin/reports" className="btn btn-ghost btn-sm">Full Investigation Archive</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recentReports.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No surveillance entries recorded.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Entry Entity</th>
                    <th>Classification</th>
                    <th>Origin</th>
                    <th>Timestamp</th>
                    <th>Decision</th>
                    <th>Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 600 }}>{r.user?.name || 'Authorized Subsystem'}</td>
                      <td>
                        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700 }}>{formatViolation(r.violationType)}</span>
                      </td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                        {r.location?.address || 'GPS SECURED'}
                      </td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td>
                        <span className={`badge badge-${r.status}`}>{r.status}</span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                        {r.aiResults?.numberPlate || 'ENCRYPTED'}
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
