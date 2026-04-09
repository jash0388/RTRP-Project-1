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

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'RoadSuraksha-CitizenPortal-v1.0'
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAddress(data.display_name || `Area near ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setAddress(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat.toString());
        setLongitude(lon.toString());
        reverseGeocode(lat, lon);
        setGpsLoading(false);
      },
      (err) => {
        console.log('GPS error:', err.message);
        // Default to Mumbai center if GPS fails
        const defLat = 19.0760;
        const defLon = 72.8777;
        setLatitude(defLat.toString());
        setLongitude(defLon.toString());
        setAddress('Mumbai, Maharashtra (Default Location)');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);

    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreviews(prev => [...prev, { url: ev.target.result, name: file.name, type: 'image' }]);
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
      setError('Violation Category is required.');
      return;
    }

    if (!address) {
      setError('Location information is required.');
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
        setError(result.message || 'Submission failed.');
      }
    } catch (err) {
      setError('An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>✅</div>
        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, marginBottom: 'var(--space-md)', color: 'var(--primary-800)' }}>
          Submission Successful
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Your report has been logged in the system for official review.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
        <h1 className="page-title">Violation Reporting Portal</h1>
        <p className="page-subtitle">File an official report with photographic or video evidence.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 'var(--space-xl)' }}>
          {/* Left Panel */}
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-header">
                <h3 className="card-title">Violation Category</h3>
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
                        border: `2px solid ${violationType === vt.value ? 'var(--primary-700)' : 'var(--border-color)'}`,
                        background: violationType === vt.value ? 'var(--primary-50)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
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
                        <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: violationType === vt.value ? 'var(--primary-800)' : 'inherit' }}>
                          {vt.label.slice(vt.label.indexOf(' ') + 1)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3 className="card-title">Additional Details</h3></div>
              <div className="card-body">
                <textarea
                  className="form-textarea"
                  placeholder="Provide any additional context regarding the observed violation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-header"><h3 className="card-title">Evidence Upload</h3></div>
              <div className="card-body">
                <div className="file-upload" onClick={() => fileInput.current?.click()} style={{ padding: 'var(--space-lg)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📁</div>
                  <div style={{ fontWeight: 700 }}>Choose Files</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Images or Videos (max 5)</div>
                </div>
                <input ref={fileInput} type="file" accept="image/*,video/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                
                {previews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xs)', marginTop: 'var(--space-md)' }}>
                    {previews.map((p, i) => (
                      <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {p.type === 'image' ? <img src={p.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>🎥</div>}
                        <button type="button" onClick={() => removeFile(i)} style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '10px' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-header">
                <h3 className="card-title">Incident Location</h3>
                <button type="button" className="btn btn-ghost btn-sm" onClick={detectLocation} disabled={gpsLoading}>
                  {gpsLoading ? 'Detecting...' : '📍 Refresh GPS'}
                </button>
              </div>
              <div className="card-body">
                {/* Lat/Long hidden from UI but used in form submission */}
                <div className="form-group">
                  <label className="form-label">Location Address</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Auto-detecting location..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    readOnly={gpsLoading}
                    style={{ background: 'var(--bg-tertiary)', fontWeight: 500 }}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    Address tracked via GPS subsystem. You can manually refine the text if needed.
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Processing Submission...' : 'Submit Official Report'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
