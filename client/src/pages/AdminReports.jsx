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
      // Clear existing markers
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add markers for all reports
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
    if (!confirm('Are you sure you want to delete this report?')) return;
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
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Reports 📑</h1>
        <p className="page-subtitle">Review and manage all violation reports</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          id="filter-status"
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
          id="filter-type"
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

      {/* Map View */}
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
                    <th>Reporter</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>AI Plate</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r._id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{r.user?.name || 'Unknown'}</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{r.user?.email}</div>
                      </td>
                      <td><span className="violation-badge">{formatViolation(r.violationType)}</span></td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', maxWidth: '150px' }}>
                        {r.location?.address || 'GPS Location'}
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
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)} title="Edit">✏️</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(r._id)} title="Delete">🗑️</button>
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

      {/* Edit Modal */}
      {editingReport && (
        <div className="modal-overlay" onClick={() => setEditingReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Review Report</h3>
              <button className="modal-close" onClick={() => setEditingReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              {editingReport.media?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <img src={editingReport.media[0].url} alt="Evidence" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-sm)' }}>
                <strong>Type:</strong> {formatViolation(editingReport.violationType)}<br />
                <strong>Reporter:</strong> {editingReport.user?.name} ({editingReport.user?.email})<br />
                <strong>Location:</strong> {editingReport.location?.address || 'GPS'}<br />
                {editingReport.aiResults?.numberPlate && <><strong>AI Plate:</strong> {editingReport.aiResults.numberPlate}<br /></>}
                {editingReport.aiResults?.vehicleType && <><strong>Vehicle:</strong> {editingReport.aiResults.vehicleType}<br /></>}
                {editingReport.description && <><strong>Description:</strong> {editingReport.description}<br /></>}
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Admin Notes</label>
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
              <button className="btn btn-primary" onClick={handleUpdateReport}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
