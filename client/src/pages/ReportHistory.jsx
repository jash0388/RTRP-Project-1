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
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
        <h1 className="page-title">Personal Submission Archives</h1>
        <p className="page-subtitle">A comprehensive record of your traffic violation reports and their official audit status.</p>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No records found in your submission history.</p>
        </div>
      ) : (
        <>
          <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
            {reports.map(report => (
              <div className="card" key={report._id} onClick={() => setSelectedReport(report)} style={{ cursor: 'pointer', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '180px', background: 'var(--bg-tertiary)' }}>
                  {report.media && report.media.length > 0 ? (
                    <img src={report.media[0].url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🖼️</div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className={`badge badge-${report.status}`}>{report.status}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--primary-700)' }}>{formatViolation(report.violationType)}</span>
                  </div>
                  <p style={{ 
                    fontSize: 'var(--font-sm)', 
                    color: 'var(--text-secondary)', 
                    marginBottom: 'var(--space-md)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.4,
                    minHeight: '2.8em'
                  }}>
                    {report.description || 'No descriptive context provided.'}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '11px', 
                    color: 'var(--text-tertiary)',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: 'var(--space-sm)'
                  }}>
                    <span style={{ fontWeight: 600 }}>📍 {report.location?.address?.split(',')[0] || 'GPS Point'}</span>
                    <span>{formatDate(report.createdAt).split(',')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
              <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-md)', fontSize: 'var(--font-sm)', fontWeight: 700 }}>
                Page {page} of {totalPages}
              </div>
              <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}

      {/* Review Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Verification Transcript</h3>
              <button className="modal-close" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedReport.media?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={selectedReport.media[0].url} alt="Evidence" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#000' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 2 }}>Incident Category</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>{formatViolation(selectedReport.violationType)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 2 }}>Current Outcome</div>
                  <span className={`badge badge-${selectedReport.status}`}>{selectedReport.status}</span>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 2 }}>Registration Date</div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 500 }}>{formatDate(selectedReport.createdAt)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 2 }}>Reported Origin</div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 500 }}>{selectedReport.location?.address || 'SECURED GPS'}</div>
                </div>
              </div>

              {selectedReport.description && (
                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 4 }}>Submitter Statement</div>
                  <p style={{ fontSize: 'var(--font-sm)', lineHeight: 1.5 }}>{selectedReport.description}</p>
                </div>
              )}

              {/* Automated Audit (AI Results) */}
              {selectedReport.aiResults && (
                <div style={{
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-800)', marginBottom: 'var(--space-md)' }}>Automated System Diagnostics</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', fontSize: 'var(--font-sm)' }}>
                    <div>Helmet Detection: <span style={{ fontWeight: 700 }}>{selectedReport.aiResults.helmetDetected === null ? 'INCONCLUSIVE' : selectedReport.aiResults.helmetDetected ? 'IDENTIFIED' : 'NOT DETECTED'}</span></div>
                    <div>Vehicle Category: <span style={{ fontWeight: 700 }}>{selectedReport.aiResults.vehicleType || 'PROCESSING'}</span></div>
                    <div>Registration Plate: <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{selectedReport.aiResults.numberPlate || 'ENCRYPTED'}</span></div>
                    <div>Verification Confidence: <span style={{ fontWeight: 700 }}>{selectedReport.aiResults.confidence ? `${(selectedReport.aiResults.confidence * 100).toFixed(0)}%` : 'PENDING'}</span></div>
                  </div>
                </div>
              )}

              {selectedReport.adminNotes && (
                <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', borderLeft: '3px solid var(--primary-700)', background: 'var(--primary-50)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--primary-800)', fontWeight: 700, marginBottom: 4 }}>Official Auditor Remarks</div>
                  <p style={{ fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--primary-900)' }}>{selectedReport.adminNotes}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>Close Transcript</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
