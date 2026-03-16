import { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';

export default function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, [page]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await reportsAPI.getMyReports(page, 12);
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const formatViolation = (type) => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Report History 📋</h1>
        <p className="page-subtitle">Track the status of your submitted violation reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No reports yet</h3>
          <p className="empty-state-text">You haven't submitted any violation reports yet.</p>
        </div>
      ) : (
        <>
          <div className="reports-grid">
            {reports.map(report => (
              <div className="report-card" key={report._id} onClick={() => setSelectedReport(report)}>
                <div className="report-card-media">
                  {report.media && report.media.length > 0 ? (
                    <img src={report.media[0].url} alt="Evidence" />
                  ) : (
                    <div className="no-media">📷</div>
                  )}
                  <div className="report-card-status">
                    <span className={`badge badge-${report.status}`}>{report.status}</span>
                  </div>
                </div>
                <div className="report-card-body">
                  <div className="report-card-type">
                    <span className="violation-badge">{formatViolation(report.violationType)}</span>
                  </div>
                  <p className="report-card-desc">
                    {report.description || 'No description provided'}
                  </p>
                  <div className="report-card-meta">
                    <span>📍 {report.location?.address || 'GPS Location'}</span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                  {report.aiResults?.numberPlate && (
                    <div style={{
                      marginTop: 'var(--space-sm)',
                      padding: 'var(--space-xs) var(--space-sm)',
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'monospace',
                      fontSize: 'var(--font-xs)',
                      display: 'inline-block'
                    }}>
                      🔢 {report.aiResults.numberPlate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Report Details</h3>
              <button className="modal-close" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedReport.media?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <img src={selectedReport.media[0].url} alt="Evidence" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Type</div>
                  <span className="violation-badge">{formatViolation(selectedReport.violationType)}</span>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Status</div>
                  <span className={`badge badge-${selectedReport.status}`}>{selectedReport.status}</span>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Date</div>
                  <div style={{ fontSize: 'var(--font-sm)' }}>{formatDate(selectedReport.createdAt)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Location</div>
                  <div style={{ fontSize: 'var(--font-sm)' }}>{selectedReport.location?.address || 'GPS'}</div>
                </div>
              </div>

              {selectedReport.description && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Description</div>
                  <p style={{ fontSize: 'var(--font-sm)' }}>{selectedReport.description}</p>
                </div>
              )}

              {/* AI Results */}
              {selectedReport.aiResults && (
                <div style={{
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>🤖 AI Analysis</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', fontSize: 'var(--font-sm)' }}>
                    <div>Helmet: {selectedReport.aiResults.helmetDetected === null ? '—' : selectedReport.aiResults.helmetDetected ? '✅ Yes' : '❌ No'}</div>
                    <div>Vehicle: {selectedReport.aiResults.vehicleType || '—'}</div>
                    <div>Plate: {selectedReport.aiResults.numberPlate || '—'}</div>
                    <div>Confidence: {selectedReport.aiResults.confidence ? `${(selectedReport.aiResults.confidence * 100).toFixed(0)}%` : '—'}</div>
                  </div>
                  {selectedReport.aiResults.autoTags?.length > 0 && (
                    <div style={{ marginTop: 'var(--space-sm)' }}>
                      Tags: {selectedReport.aiResults.autoTags.map(t => (
                        <span className="violation-badge" key={t} style={{ marginRight: 4 }}>{formatViolation(t)}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedReport.adminNotes && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Admin Notes</div>
                  <p style={{ fontSize: 'var(--font-sm)', fontStyle: 'italic' }}>{selectedReport.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
