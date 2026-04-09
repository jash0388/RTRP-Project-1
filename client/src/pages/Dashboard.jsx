import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await reportsAPI.getMyReports(1, 5);
      setReports(data.reports || []);

      const all = data.total || 0;
      const pending = (data.reports || []).filter(r => r.status === 'pending').length;
      const approved = (data.reports || []).filter(r => r.status === 'approved').length;
      const rejected = (data.reports || []).filter(r => r.status === 'rejected').length;

      setStats({ total: all, pending, approved, rejected });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formatViolationType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  return (
    <div className="fade-in">
      {/* Official Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-2xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
        <h1 className="page-title">Citizen Oversight Dashboard</h1>
        <p className="page-subtitle">Personal violation reporting history and system status for {today}.</p>
      </div>

      {/* Numerical Metrics */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-700)' }}>
          <div className="stat-info">
            <div className="stat-label">Total Submissions</div>
            <div className="stat-value" style={{ color: 'var(--primary-600)' }}>{stats.total}</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #fbbf24' }}>
          <div className="stat-info">
            <div className="stat-label">Awaiting Verification</div>
            <div className="stat-value" style={{ color: '#854d0e' }}>{stats.pending}</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div className="stat-info">
            <div className="stat-label">Verified Violations</div>
            <div className="stat-value" style={{ color: '#166534' }}>{stats.approved}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 'var(--space-xl)' }}>
        {/* Activity Log */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity Stream</h3>
              <Link to="/report-history" className="btn btn-ghost btn-sm">Full History</Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {reports.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-text">No reporting activity found in current records.</p>
                  <Link to="/submit-report" className="btn btn-primary">File a New Report</Link>
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Violation Category</th>
                        <th>Incident Location</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map(report => (
                        <tr key={report._id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                            {formatViolationType(report.violationType)}
                          </td>
                          <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                            {report.location?.address || 'GPS Tracking Active'}
                          </td>
                          <td>
                            <span className={`badge badge-${report.status}`}>{report.status}</span>
                          </td>
                          <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                            {formatDate(report.createdAt)}
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

        {/* Sidebar Actions */}
        <div>
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-body">
              <h4 style={{ fontWeight: 800, color: 'var(--primary-600)', marginBottom: 'var(--space-md)' }}>Quick Actions</h4>
              <Link to="/submit-report" className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--space-sm)' }}>
                New Violation Entry
              </Link>
              <Link to="/profile" className="btn btn-secondary" style={{ width: '100%' }}>
                Manage Account
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 style={{ fontWeight: 800, color: 'var(--primary-600)', marginBottom: 'var(--space-xs)' }}>Safety Compliance</h4>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>Help maintain traffic order.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--primary-600)' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Helmet Protocol</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Required for all riders.</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--primary-600)' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Signal Discipline</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Follow intersection signals.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
