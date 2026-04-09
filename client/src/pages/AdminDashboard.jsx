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
      {/* Official Admin Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-2xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
        <h1 className="page-title">Administration Management Console</h1>
        <p className="page-subtitle">Centralized oversight of all traffic violation categories and system analytical data.</p>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--primary-800)' }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Cumulative Submissions</div>
          <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--primary-800)' }}>{stats?.totalReports || 0}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--bg-secondary)', borderLeft: '4px solid #fbbf24' }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Pending Verifications</div>
          <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: '#854d0e' }}>{stats?.pendingReports || 0}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--bg-secondary)', borderLeft: '4px solid #16a34a' }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Validated Incidents</div>
          <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: '#166534' }}>{stats?.approvedReports || 0}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' }}>Monthly Throughput</div>
          <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--primary-800)' }}>{stats?.monthlyCount || 0}</div>
        </div>
      </div>

      {/* Primary Control Options */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-3xl)', flexWrap: 'wrap' }}>
        <Link to="/admin/reports" className="btn btn-primary">Incident Audit Registry</Link>
        <Link to="/admin/users" className="btn btn-secondary">System User Database</Link>
        <Link to="/analytics" className="btn btn-secondary">Detailed Analytics Hub</Link>
      </div>

      {/* Violation Taxonomy Overlay */}
      {stats?.violationsByType?.length > 0 && (
        <div style={{ marginBottom: 'var(--space-3xl)' }}>
          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: 'var(--space-lg)', color: 'var(--primary-800)' }}>Violation Distribution Analysis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
            {stats.violationsByType.slice(0, 8).map(v => (
              <div key={v._id} className="card" style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xs)' }}>
                  {formatViolation(v._id)}
                </div>
                <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{v.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Surveillance entries */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Activity Registry</h3>
          <Link to="/admin/reports" className="btn btn-ghost btn-sm">Full Investigation Archive →</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recentReports.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No incident records found in surveillance data.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Submitting Entity</th>
                    <th>Classification</th>
                    <th>Observed Location</th>
                    <th>Timestamp</th>
                    <th>Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 700 }}>{r.user?.name || 'Authorized Subsystem'}</td>
                      <td>
                        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--primary-700)' }}>{formatViolation(r.violationType)}</span>
                      </td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                        {r.location?.address?.split(',').slice(0, 2).join(',') || 'GPS Tracking Active'}
                      </td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td>
                        <span className={`badge badge-${r.status}`}>{r.status}</span>
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
