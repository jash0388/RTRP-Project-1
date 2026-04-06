import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

export default function PoliceReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingReport, setEditingReport] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const token = localStorage.getItem('sphn_token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    loadReports();
  }, [page, filterStatus, filterType]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterStatus) params.append('status', filterStatus);
      if (filterType) params.append('violationType', filterType);

      const res = await fetch(`/api/police/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Map logic
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstanceRef.current);
    }

    if (showMap && mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) mapInstanceRef.current.removeLayer(layer);
      });

      reports.forEach(r => {
        if (r.location?.coordinates) {
          const [lng, lat] = r.location.coordinates;
          L.marker([lat, lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <strong>${formatViolation(r.violationType)}</strong><br/>
              ${r.location.address || ''}<br/>
              Status: ${r.status}<br/>
              ${r.aiResults?.numberPlate ? 'Plate: ' + r.aiResults.numberPlate : ''}
            `);
        }
      });
    }

    return () => {
      if (!showMap && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap, reports]);

  const handleUpdateReport = async () => {
    if (!editingReport) return;
    try {
      await fetch(`/api/police/reports/${editingReport._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: editStatus, adminNotes: editNotes })
      });
      setEditingReport(null);
      loadReports();
    } catch (err) {
      console.error('Failed to update report:', err);
    }
  };

  const openEdit = (report) => {
    setEditingReport(report);
    setEditStatus(report.status);
    setEditNotes(report.adminNotes || '');
    setMediaIndex(0);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const formatViolation = (type) => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Render a single media item (image or video)
  const renderMediaItem = (item, style = {}) => {
    if (!item) return null;
    if (item.type === 'video') {
      return (
        <video
          src={item.url}
          controls
          style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: 'var(--radius-md)', background: '#000', ...style }}
        />
      );
    }
    return (
      <img
        src={item.url}
        alt="Evidence"
        style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: 'var(--radius-md)', cursor: 'pointer', ...style }}
        onClick={() => setLightboxMedia(item)}
      />
    );
  };

  // Thumbnail for table rows
  const renderThumbnail = (media) => {
    if (!media || media.length === 0) {
      return (
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)',
          background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '18px', color: 'var(--text-tertiary)'
        }}>
          📷
        </div>
      );
    }
    const first = media[0];
    if (first.type === 'video') {
      return (
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)',
          background: '#000', display: 'flex', alignItems: 'center',
          justifyContent: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <video src={first.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(0,0,0,0.35)', color: '#fff', fontSize: '16px'
          }}>▶</div>
          {media.length > 1 && (
            <div style={{
              position: 'absolute', top: 2, right: 2, background: 'rgba(99,102,241,0.9)',
              borderRadius: 'var(--radius-sm)', fontSize: '9px', padding: '1px 4px',
              color: '#fff', fontWeight: 700
            }}>{media.length}</div>
          )}
        </div>
      );
    }
    return (
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
        <img src={first.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {media.length > 1 && (
          <div style={{
            position: 'absolute', top: 2, right: 2, background: 'rgba(99,102,241,0.9)',
            borderRadius: 'var(--radius-sm)', fontSize: '9px', padding: '1px 4px',
            color: '#fff', fontWeight: 700
          }}>{media.length}</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Review Reports 📑</h1>
        <p className="page-subtitle">Review evidence and approve or reject violation reports</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          className="form-select"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
        >
          <option value="">All Types</option>
          <option value="no_helmet">No Helmet</option>
          <option value="signal_jump">Signal Jump</option>
          <option value="wrong_parking">Wrong Parking</option>
          <option value="overspeeding">Overspeeding</option>
          <option value="wrong_side">Wrong Side</option>
          <option value="no_seatbelt">No Seatbelt</option>
          <option value="overloading">Overloading</option>
          <option value="using_phone">Using Phone</option>
          <option value="drunk_driving">Drunk Driving</option>
          <option value="other">Other</option>
        </select>

        <button
          className={`btn ${showMap ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? '📋 Table View' : '🗺️ Map View'}
        </button>
      </div>

      {/* Map */}
      {showMap && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="card-header">
            <h3 className="card-title">Violation Locations</h3>
          </div>
          <div className="map-container">
            <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No reports found</h3>
          <p className="empty-state-text">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Evidence</th>
                    <th>Violation</th>
                    <th>Location</th>
                    <th>AI Plate</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r._id}>
                      <td>
                        <div style={{ cursor: 'pointer' }} onClick={() => openEdit(r)}>
                          {renderThumbnail(r.media)}
                        </div>
                      </td>
                      <td><span className="violation-badge">{formatViolation(r.violationType)}</span></td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', maxWidth: 150 }}>
                        {r.location?.address || 'GPS'}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-sm)', fontWeight: 600 }}>
                        {r.aiResults?.numberPlate || '—'}
                      </td>
                      <td style={{ fontSize: 'var(--font-sm)', textTransform: 'capitalize' }}>
                        {r.aiResults?.vehicleType || '—'}
                      </td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)} title="Review">✏️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = Math.max(1, page - 2) + i;
            if (pageNum > totalPages) return null;
            return (
              <button key={pageNum} className={`pagination-btn ${page === pageNum ? 'active' : ''}`} onClick={() => setPage(pageNum)}>
                {pageNum}
              </button>
            );
          })}
          <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Review Modal */}
      {editingReport && (
        <div className="modal-overlay" onClick={() => setEditingReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Review Report</h3>
              <button className="modal-close" onClick={() => setEditingReport(null)}>✕</button>
            </div>
            <div className="modal-body">

              {/* === EVIDENCE MEDIA GALLERY === */}
              {editingReport.media?.length > 0 ? (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label className="form-label" style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    📎 Evidence ({editingReport.media.length} file{editingReport.media.length > 1 ? 's' : ''})
                  </label>
                  <div style={{
                    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                    background: '#000', position: 'relative'
                  }}>
                    {renderMediaItem(editingReport.media[mediaIndex])}

                    {/* Navigation controls for multiple media */}
                    {editingReport.media.length > 1 && (
                      <>
                        <button
                          onClick={() => setMediaIndex(i => (i - 1 + editingReport.media.length) % editingReport.media.length)}
                          style={{
                            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                            borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', backdropFilter: 'blur(4px)', transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.background = 'rgba(99,102,241,0.8)'}
                          onMouseLeave={e => e.target.style.background = 'rgba(0,0,0,0.6)'}
                        >◀</button>
                        <button
                          onClick={() => setMediaIndex(i => (i + 1) % editingReport.media.length)}
                          style={{
                            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                            borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', backdropFilter: 'blur(4px)', transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.background = 'rgba(99,102,241,0.8)'}
                          onMouseLeave={e => e.target.style.background = 'rgba(0,0,0,0.6)'}
                        >▶</button>

                        {/* Dots indicator */}
                        <div style={{
                          position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                          display: 'flex', gap: 6
                        }}>
                          {editingReport.media.map((_, i) => (
                            <div
                              key={i}
                              onClick={() => setMediaIndex(i)}
                              style={{
                                width: i === mediaIndex ? 20 : 8, height: 8,
                                borderRadius: 4, cursor: 'pointer',
                                background: i === mediaIndex ? 'var(--primary-400)' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.3s ease'
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Media type label */}
                  <div style={{
                    marginTop: 'var(--space-xs)', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)'
                  }}>
                    <span>{editingReport.media[mediaIndex]?.type === 'video' ? '🎥 Video' : '🖼️ Image'}</span>
                    {editingReport.media.length > 1 && <span>{mediaIndex + 1} / {editingReport.media.length}</span>}
                  </div>
                </div>
              ) : (
                <div style={{
                  marginBottom: 'var(--space-lg)', padding: 'var(--space-xl)',
                  background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)',
                  textAlign: 'center', color: 'var(--text-tertiary)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>📷</div>
                  <div style={{ fontSize: 'var(--font-sm)' }}>No evidence media attached</div>
                </div>
              )}

              {/* Report details */}
              <div style={{
                marginBottom: 'var(--space-md)', fontSize: 'var(--font-sm)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)'
              }}>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginBottom: 2 }}>Violation Type</div>
                  <div style={{ fontWeight: 600 }}>{formatViolation(editingReport.violationType)}</div>
                </div>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginBottom: 2 }}>Location</div>
                  <div style={{ fontWeight: 600 }}>{editingReport.location?.address || 'GPS'}</div>
                </div>
                {editingReport.aiResults?.numberPlate && (
                  <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginBottom: 2 }}>AI Number Plate</div>
                    <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{editingReport.aiResults.numberPlate}</div>
                  </div>
                )}
                {editingReport.aiResults?.vehicleType && (
                  <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginBottom: 2 }}>Vehicle Type</div>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{editingReport.aiResults.vehicleType}</div>
                  </div>
                )}
                {editingReport.aiResults?.helmetDetected !== null && editingReport.aiResults?.helmetDetected !== undefined && (
                  <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginBottom: 2 }}>Helmet Detected</div>
                    <div style={{ fontWeight: 600 }}>{editingReport.aiResults.helmetDetected ? '✅ Yes' : '❌ No'}</div>
                  </div>
                )}
                {editingReport.aiResults?.confidence > 0 && (
                  <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginBottom: 2 }}>AI Confidence</div>
                    <div style={{ fontWeight: 600 }}>{Math.round(editingReport.aiResults.confidence * 100)}%</div>
                  </div>
                )}
              </div>

              {editingReport.description && (
                <div style={{
                  marginBottom: 'var(--space-md)', padding: 'var(--space-md)',
                  background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)', lineHeight: 1.6
                }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginBottom: 4 }}>Description</div>
                  {editingReport.description}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Decision</label>
                <select className="form-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approve ✅</option>
                  <option value="rejected">Reject ❌</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Officer Notes</label>
                <textarea
                  className="form-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add review notes..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditingReport(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdateReport}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for full-size image viewing */}
      {lightboxMedia && (
        <div
          className="modal-overlay"
          style={{ zIndex: 2000, background: 'rgba(0,0,0,0.9)', cursor: 'zoom-out' }}
          onClick={() => setLightboxMedia(null)}
        >
          <img
            src={lightboxMedia.url}
            alt="Full evidence"
            style={{
              maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain',
              borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          />
          <button
            onClick={() => setLightboxMedia(null)}
            style={{
              position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)',
              border: 'none', color: '#fff', fontSize: '24px', width: 44, height: 44,
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
            }}
          >✕</button>
        </div>
      )}
    </div>
  );
}

