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
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-2xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-xl)' }}>
        <h1 className="page-title">Citizen Performance</h1>
        <p className="page-subtitle">Welcome back, {user?.name}. System status is operational for {today}.</p>
      </div>

      {/* Stats Grid - Minimalist approach */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Impact Score</div>
          <div className="serif" style={{ fontSize: 'var(--font-4xl)' }}>{stats.total * 10}</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--accent)' }}>+15% from last month</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Active Reports</div>
          <div className="serif" style={{ fontSize: 'var(--font-4xl)' }}>{stats.pending}</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Awaiting verification</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Safe Road Points</div>
          <div className="serif" style={{ fontSize: 'var(--font-4xl)' }}>{stats.approved * 50}</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--accent)' }}>Top 5% contributor</div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-2xl)' }}>
        <div className="left-panel">
          {/* Recent Reports Table */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', padding: 'var(--space-lg) var(--space-xl)' }}>
              <h3 className="serif" style={{ fontSize: 'var(--font-xl)' }}>Activity Stream</h3>
              <Link to="/report-history" className="btn btn-ghost btn-sm">Archive</Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {reports.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-text">No recent activity detected.</p>
                  <Link to="/submit-report" className="btn btn-primary">File First Report</Link>
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Identification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map(report => (
                        <tr key={report._id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{formatViolationType(report.violationType)}</div>
                            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{formatDate(report.createdAt)}</div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                            {report.location?.address?.split(',')[0] || 'Unknown Origin'}
                          </td>
                          <td>
                            <span className={`badge badge-${report.status}`}>{report.status}</span>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                            {report.aiResults?.numberPlate || 'SECURED'}
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

        <div className="right-panel">
          {/* Quick Action Sidebars */}
          <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', background: 'var(--bg-secondary)' }}>
            <h4 className="serif" style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--space-lg)' }}>Quick Initiation</h4>
            <Link to="/submit-report" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 'var(--space-sm)' }}>
              Report Violation
            </Link>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
              Upload evidence directly to the AI core for real-time verification.
            </p>
          </div>

          <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--bg-secondary)' }}>
            <h4 className="serif" style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--space-md)' }}>Safety Compliance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--space-md)' }}>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Helmet Protocol</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Reduces fatality risk by 69% in metropolitan zones.</div>
              </div>
              <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--space-md)' }}>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Active Attendance</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Road Suraksha is powered by your real-time vigilance.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
