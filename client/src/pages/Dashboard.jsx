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
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner slide-up">
        <div className="welcome-banner-text">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Citizen'}! 👋</h1>
          <p>Help us make roads safer — report violations and track your contributions.</p>
        </div>
        <div className="welcome-banner-date">
          📅 {today}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{stats.approved}</div>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{stats.rejected}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/submit-report" className="quick-action-card" id="quick-action-report">
          <div className="quick-action-icon">📸</div>
          <div className="quick-action-label">Report Violation</div>
          <div className="quick-action-desc">Submit photo or video evidence</div>
        </Link>
        <Link to="/report-history" className="quick-action-card" id="quick-action-history">
          <div className="quick-action-icon">📋</div>
          <div className="quick-action-label">My Reports</div>
          <div className="quick-action-desc">Track your submissions</div>
        </Link>
        <Link to="/profile" className="quick-action-card" id="quick-action-profile">
          <div className="quick-action-icon">👤</div>
          <div className="quick-action-label">My Profile</div>
          <div className="quick-action-desc">View your account details</div>
        </Link>
        <Link to="/submit-report" className="quick-action-card" id="quick-action-emergency">
          <div className="quick-action-icon">🚨</div>
          <div className="quick-action-label">Quick Report</div>
          <div className="quick-action-desc">Report an ongoing violation</div>
        </Link>
      </div>

      {/* How It Works */}
      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-lg)' }}>
          📝 How It Works
        </h3>
      </div>
      <div className="how-it-works">
        <div className="how-step slide-up" style={{ animationDelay: '0s' }}>
          <div className="how-step-number">1</div>
          <div className="how-step-icon">📸</div>
          <div className="how-step-title">Capture Evidence</div>
          <div className="how-step-desc">Take a photo or video of the traffic violation you've witnessed</div>
        </div>
        <div className="how-step slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="how-step-number">2</div>
          <div className="how-step-icon">📤</div>
          <div className="how-step-title">Submit Report</div>
          <div className="how-step-desc">Upload evidence with details and GPS location for accurate reporting</div>
        </div>
        <div className="how-step slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="how-step-number">3</div>
          <div className="how-step-icon">🤖</div>
          <div className="how-step-title">AI Analysis</div>
          <div className="how-step-desc">Our AI detects violations, reads number plates, and verifies the evidence</div>
        </div>
        <div className="how-step slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="how-step-number">4</div>
          <div className="how-step-icon">⚖️</div>
          <div className="how-step-title">Action Taken</div>
          <div className="how-step-desc">Traffic police review and take appropriate enforcement action</div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="safety-tips">
        <div className="safety-tips-title">🛡️ Road Safety Tips</div>
        <div className="safety-tips-grid">
          <div className="safety-tip">
            <div className="safety-tip-icon">🪖</div>
            <div className="safety-tip-text">
              <strong>Always Wear a Helmet</strong>
              Reduces the risk of head injury by 69% for two-wheeler riders.
            </div>
          </div>
          <div className="safety-tip">
            <div className="safety-tip-icon">🔗</div>
            <div className="safety-tip-text">
              <strong>Buckle Your Seatbelt</strong>
              Seatbelts reduce the risk of fatal injury by up to 45%.
            </div>
          </div>
          <div className="safety-tip">
            <div className="safety-tip-icon">📵</div>
            <div className="safety-tip-text">
              <strong>No Phone While Driving</strong>
              Using a phone while driving leads to 1.6 million accidents per year.
            </div>
          </div>
          <div className="safety-tip">
            <div className="safety-tip-icon">🚦</div>
            <div className="safety-tip-text">
              <strong>Follow Traffic Signals</strong>
              Obeying signals prevents 40% of intersection-related crashes.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Reports</h3>
          <Link to="/report-history" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3 className="empty-state-title">No reports yet</h3>
              <p className="empty-state-text">Start by reporting your first traffic violation</p>
              <Link to="/submit-report" className="btn btn-primary">Submit Report</Link>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>AI Plate</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report._id}>
                      <td>
                        <span className="violation-badge">
                          {formatViolationType(report.violationType)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                        {report.location?.address || `${report.location?.coordinates?.[1]?.toFixed(4)}, ${report.location?.coordinates?.[0]?.toFixed(4)}`}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                        {formatDate(report.createdAt)}
                      </td>
                      <td>
                        <span className={`badge badge-${report.status}`}>{report.status}</span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-sm)' }}>
                        {report.aiResults?.numberPlate || '—'}
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
