import { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../services/api';
import L from 'leaflet';

export default function AdminReports() {
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
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    loadReports();
  }, [page, filterStatus, filterType]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.violationType = filterType;

      const data = await adminAPI.getReports(params);
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    if (showMap && mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
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
      await adminAPI.updateReport(editingReport._id, {
        status: editStatus,
        adminNotes: editNotes
      });
      setEditingReport(null);
      loadReports();
    } catch (err) {
      console.error('Failed to update report:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Proceed with permanent removal of this report from the database?')) return;
    try {
      await adminAPI.deleteReport(id);
      loadReports();
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const openEdit = (report) => {
    setEditingReport(report);
    setEditStatus(report.status);
    setEditNotes(report.adminNotes || '');
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const formatViolation = (type) => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
        <h1 className="page-title">Violation Audit Registry</h1>
        <p className="page-subtitle">Centralized review and management of citizen-submitted incident reports.</p>
      </div>

      {/* Control Panel */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', gap: 'var(--space-sm)' }}>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              style={{ maxWidth: '200px' }}
            >
              <option value="">Filter: All Status</option>
              <option value="pending">Awaiting Review</option>
              <option value="approved">Verified</option>
              <option value="rejected">Dismissed</option>
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
            {showMap ? 'Show Table Listing' : 'Show Incident Map'}
          </button>
        </div>
      </div>

      {/* Map View Frame */}
      {showMap && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-sm)' }}>
          <div className="map-container" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
          </div>
        </div>
      )}

      {/* Data Presentation */}
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No matching records found in the audit registry.</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Reporter Entity</th>
                    <th>Incident Category</th>
                    <th>Observation Point</th>
                    <th>System Metadata</th>
                    <th>Registration Date</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Audit Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r._id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>{r.user?.name || 'Anonymous'}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>ID: {r.user?._id?.slice(-6)}</div>
                      </td>
                      <td><span style={{ fontSize: 'var(--font-xs)', fontWeight: 700 }}>{formatViolation(r.violationType)}</span></td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                        {r.location?.address || 'GPS Subsystem Active'}
                      </td>
                      <td>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800 }}>{r.aiResults?.numberPlate || 'SECURED'}</div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{r.aiResults?.vehicleType || 'Unknown'}</div>
                      </td>
                      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Review</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(r._id)} style={{ color: '#ef4444' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
          <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-md)', fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--primary-800)' }}>
            Page {page} of {totalPages}
          </div>
          <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}

      {/* Audit Detail Modal */}
      {editingReport && (
        <div className="modal-overlay" onClick={() => setEditingReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Surveillance Audit: {editingReport._id.slice(-8).toUpperCase()}</h3>
              <button className="modal-close" onClick={() => setEditingReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              {editingReport.media?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={editingReport.media[0].url} alt="Evidence" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#000' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Classification</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>{formatViolation(editingReport.violationType)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Location Entry</div>
                  <div style={{ fontSize: '11px', fontWeight: 500 }}>{editingReport.location?.address || 'SECURED'}</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Audit Decision</label>
                <select className="form-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="pending">Awaiting Review</option>
                  <option value="approved">Verify Incident</option>
                  <option value="rejected">Dismiss Incident</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Internal Audit Notes</label>
                <textarea
                  className="form-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record compliance notes or dismissal justification..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditingReport(null)}>Exit</button>
              <button className="btn btn-primary" onClick={handleUpdateReport}>Commit Decision</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
