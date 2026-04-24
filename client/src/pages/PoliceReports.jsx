import React from 'react';
const { useState, useEffect, useRef } = React;
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
  const [editNumberPlate, setEditNumberPlate] = useState('');
  const [editVehicleType, setEditVehicleType] = useState('');
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

  useEffect(() => {
    loadReports();
  }, [page, filterStatus, filterType]);

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
              <div style="font-family: Inter, sans-serif; padding: 4px;">
                <strong style="color: #1e40af">${formatViolation(r.violationType)}</strong><br/>
                <span style="font-size: 11px; color: #64748b">${r.location.address || 'GPS Location'}</span><br/>
                <span style="font-size: 11px; font-weight: 700">Status: ${r.status.toUpperCase()}</span>
              </div>
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
      const res = await fetch(`/api/police/reports/${editingReport._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          status: editStatus, 
          adminNotes: editNotes,
          verifiedNumberPlate: editNumberPlate,
          verifiedVehicleType: editVehicleType
        })
      });
      const data = await res.json();
      setEditingReport(null);
      if (editStatus === 'resolved') {
        alert('✅ Report resolved and deleted successfully.');
      }
      loadReports();
    } catch (err) {
      console.error('Failed to update report:', err);
    }
  };

  const openEdit = (report) => {
    setEditingReport(report);
    setEditStatus(report.status);
    setEditNotes(report.adminNotes || '');
    setEditNumberPlate(report.verifiedNumberPlate || '');
    setEditVehicleType(report.verifiedVehicleType || '');
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
        </div>
      );
    }
    return (
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
        <img src={first.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
        <h1 className="page-title">Enforcement Review Feed</h1>
        <p className="page-subtitle">Inspect submitted evidence and perform official verification of traffic violations.</p>
      </div>

      {/* Control Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', gap: 'var(--space-sm)' }}>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              style={{ maxWidth: '200px' }}
            >
              <option value="">Filter: All Case Status</option>
              <option value="pending">Awaiting Review</option>
              <option value="approved">Verified</option>
              <option value="rejected">Dismissed</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              className="form-select"
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              style={{ maxWidth: '200px' }}
            >
              <option value="">Filter: All Categories</option>
              <option value="no_helmet">No Helmet</option>
              <option value="signal_jump">Signal Jump</option>
              <option value="wrong_parking">Wrong Parking</option>
              <option value="overspeeding">Overspeeding</option>
              <option value="wrong_side">Wrong Side</option>
              <option value="no_seatbelt">No Seatbelt</option>
              <option value="overloading">Overloading</option>
              <option value="using_phone">Using Phone</option>
              <option value="drunk_driving">Drunk Driving</option>
              <option value="other">Other Violation</option>
            </select>
          </div>

          <button
            className={`btn ${showMap ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowMap(!showMap)}
            style={{ minWidth: '140px' }}
          >
            {showMap ? 'Show Table View' : 'Show Location Map'}
          </button>
        </div>
      </div>

      {/* Map Overlay */}
      {showMap && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-sm)' }}>
          <div className="map-container" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
          </div>
        </div>
      )}

      {/* Investigation Records */}
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No pending investigation records found in the current registry.</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Evidence</th>
                    <th>Classification</th>
                    <th>Observation Area</th>
                    <th>Identification</th>
                    <th>Vehicle</th>
                    <th>Date Registered</th>
                    <th>Outcome</th>
                    <th style={{ textAlign: 'right' }}>Audit</th>
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
                      <td><span style={{ fontSize: 'var(--font-xs)', fontWeight: 700 }}>{formatViolation(r.violationType)}</span></td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', maxWidth: 200 }}>
                        {r.location?.address || 'SECURED GPS POINT'}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800 }}>
                        {r.verifiedNumberPlate || '—'}
                      </td>
                      <td style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                        {r.verifiedVehicleType || '—'}
                      </td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Inspect</button>
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
          <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-md)', fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--primary-800)' }}>
            Page {page} of {totalPages}
          </div>
          <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}

      {/* Review Dashboard Modal */}
      {editingReport && (
        <div className="modal-overlay" onClick={() => setEditingReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Evidence Inspection: {editingReport._id.slice(-8).toUpperCase()}</h3>
              <button className="modal-close" onClick={() => setEditingReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              {editingReport.media?.length > 0 ? (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', position: 'relative', border: '1px solid var(--border-color)' }}>
                    {renderMediaItem(editingReport.media[mediaIndex])}
                    {editingReport.media.length > 1 && (
                      <>
                        <button onClick={() => setMediaIndex(i => (i - 1 + editingReport.media.length) % editingReport.media.length)} className="carousel-btn left">◀</button>
                        <button onClick={() => setMediaIndex(i => (i + 1) % editingReport.media.length)} className="carousel-btn right">▶</button>
                      </>
                    )}
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <span>{editingReport.media[mediaIndex]?.type || 'MEDIA'} SOURCE</span>
                    {editingReport.media.length > 1 && <span>FILE {mediaIndex + 1} OF {editingReport.media.length}</span>}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: 'var(--font-sm)' }}>No evidence media metadata found.</div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Classification</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>{formatViolation(editingReport.violationType)}</div>
                </div>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Incident Location</div>
                  <div style={{ fontSize: '11px', fontWeight: 500 }}>{editingReport.location?.address || 'SECURED'}</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Verified Vehicle Type</label>
                <input
                  className="form-input"
                  type="text"
                  value={editVehicleType}
                  onChange={(e) => setEditVehicleType(e.target.value)}
                  placeholder="e.g., Car, Motorcycle, Truck"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Verified Number Plate</label>
                <input
                  className="form-input"
                  type="text"
                  value={editNumberPlate}
                  onChange={(e) => setEditNumberPlate(e.target.value.toUpperCase())}
                  placeholder="e.g., MH02AB1234"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Enforcement Decision</label>
                <select className="form-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="pending">Awaiting Review</option>
                  <option value="approved">Verify Violation</option>
                  <option value="rejected">Dismiss Case</option>
                  <option value="resolved">✅ Mark Resolved (Deletes Report & Media)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Audit Remarks</label>
                <textarea
                  className="form-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record official verification notes or dismissal justifications..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditingReport(null)}>Exit</button>
              <button className="btn btn-primary" onClick={handleUpdateReport}>Commit Review</button>
            </div>
          </div>
        </div>
      )}

      {lightboxMedia && (
        <div className="modal-overlay" style={{ zIndex: 2000, background: 'rgba(0,0,0,0.9)', cursor: 'zoom-out' }} onClick={() => setLightboxMedia(null)}>
          <img src={lightboxMedia.url} alt="Examination" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}
