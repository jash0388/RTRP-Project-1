import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../services/api';

const VIOLATION_TYPES = [
  { value: 'no_helmet', label: '🪖 No Helmet', desc: 'Riding without helmet' },
  { value: 'signal_jump', label: '🚦 Signal Jump', desc: 'Jumped traffic signal' },
  { value: 'wrong_parking', label: '🅿️ Wrong Parking', desc: 'Parked in no-parking zone' },
  { value: 'overspeeding', label: '💨 Overspeeding', desc: 'Exceeded speed limit' },
  { value: 'wrong_side', label: '↩️ Wrong Side', desc: 'Driving on wrong side' },
  { value: 'no_seatbelt', label: '🔗 No Seatbelt', desc: 'Driving without seatbelt' },
  { value: 'overloading', label: '⚖️ Overloading', desc: 'Vehicle overloaded' },
  { value: 'using_phone', label: '📱 Using Phone', desc: 'Using phone while driving' },
  { value: 'drunk_driving', label: '🍺 Drunk Driving', desc: 'Driving under influence' },
  { value: 'other', label: '📌 Other', desc: 'Other violation' }
];

export default function SubmitReport() {
  const [violationType, setViolationType] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInput = useRef(null);
  const navigate = useNavigate();

  // Auto-detect GPS on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setAddress(`Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`);
        setGpsLoading(false);
      },
      (err) => {
        console.log('GPS error:', err.message);
        // Set default location (Mumbai)
        setLatitude('19.0760');
        setLongitude('72.8777');
        setAddress('Mumbai, Maharashtra (Default)');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);

    // Generate previews
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, { url: e.target.result, name: file.name, type: 'image' }]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => [...prev, { url: null, name: file.name, type: 'video' }]);
      }
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!violationType) {
      setError('Please select a violation type');
      return;
    }

    if (!latitude || !longitude) {
      setError('Location is required. Please allow GPS access or enter manually.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('violationType', violationType);
      formData.append('description', description);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('address', address);

      files.forEach(file => {
        formData.append('media', file);
      });

      const result = await reportsAPI.create(formData);

      if (result._id) {
        setSuccess(true);
        setTimeout(() => navigate('/report-history'), 2000);
      } else {
        setError(result.message || 'Failed to submit report');
      }
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>✅</div>
        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          Report Submitted Successfully!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Your violation report has been received and is being processed by our AI system.
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
          Redirecting to report history...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Report a Violation 📸</h1>
        <p className="page-subtitle">Submit evidence of a traffic violation for review</p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          color: 'var(--danger-500)',
          fontSize: 'var(--font-sm)',
          marginBottom: 'var(--space-lg)'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
          {/* Left Column */}
          <div style={{ minWidth: 0 }}>
            {/* Violation Type */}
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-header">
                <h3 className="card-title">Violation Type</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-sm)' }}>
                  {VIOLATION_TYPES.map(vt => (
                    <label
                      key={vt.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${violationType === vt.value ? 'var(--primary-500)' : 'var(--border-color)'}`,
                        background: violationType === vt.value ? 'var(--primary-500)' : 'transparent',
                        color: violationType === vt.value ? '#fff' : 'inherit',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <input
                        type="radio"
                        name="violationType"
                        value={vt.value}
                        checked={violationType === vt.value}
                        onChange={(e) => setViolationType(e.target.value)}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '1.2rem' }}>{vt.label.split(' ')[0]}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{vt.label.slice(vt.label.indexOf(' ') + 1)}</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: violationType === vt.value ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-tertiary)' }}>{vt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-header">
                <h3 className="card-title">Description</h3>
              </div>
              <div className="card-body">
                <textarea
                  className="form-textarea"
                  placeholder="Describe the violation in detail (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  id="report-description"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ minWidth: 0 }}>
            {/* Media Upload */}
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-header">
                <h3 className="card-title">Evidence (Photo/Video)</h3>
              </div>
              <div className="card-body">
                <div
                  className="file-upload"
                  onClick={() => fileInput.current?.click()}
                >
                  <div className="file-upload-icon">📷</div>
                  <div className="file-upload-text">
                    Click to upload or drag and drop
                  </div>
                  <div className="file-upload-hint">
                    JPEG, PNG, MP4, MOV up to 50MB (max 5 files)
                  </div>
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="report-file-input"
                />

                {/* Previews */}
                {previews.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 'var(--space-sm)',
                    marginTop: 'var(--space-md)'
                  }}>
                    {previews.map((p, i) => (
                      <div key={i} style={{
                        position: 'relative',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        aspectRatio: '1'
                      }}>
                        {p.type === 'image' && p.url ? (
                          <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            height: '100%', background: 'var(--bg-tertiary)', fontSize: '2rem'
                          }}>🎥</div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          style={{
                            position: 'absolute', top: 4, right: 4,
                            background: 'rgba(0,0,0,0.6)', color: 'white',
                            border: 'none', borderRadius: '50%',
                            width: 24, height: 24, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem'
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-header">
                <h3 className="card-title">Location</h3>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={detectLocation}
                  disabled={gpsLoading}
                >
                  {gpsLoading ? '📡 Detecting...' : '📍 Detect GPS'}
                </button>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <input
                      type="text"
                      className="form-input"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="19.0760"
                      required
                      id="report-latitude"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <input
                      type="text"
                      className="form-input"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="72.8777"
                      required
                      id="report-longitude"
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Address / Area</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter area or landmark"
                    id="report-address"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={submitting}
              id="submit-report-btn"
            >
              {submitting ? (
                <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }}></div> Submitting & Analyzing...</>
              ) : (
                '🚀 Submit Violation Report'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
