import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  const features = [
    {
      icon: '📸',
      title: 'Report Violations',
      desc: 'Capture and submit photo or video evidence of traffic violations directly from your phone.',
      link: '/submit-report',
      label: 'File a Report',
      color: '#3b82f6'
    },
    {
      icon: '📊',
      title: 'Track Status',
      desc: 'Follow the real-time progress of your reports — from submission to enforcement action.',
      link: '/report-history',
      label: 'View Reports',
      color: '#8b5cf6'
    },
    {
      icon: '🛡️',
      title: 'Stay Informed',
      desc: 'Access official road safety guidelines and the latest enforcement protocols from the ministry.',
      link: 'https://morth.nic.in/road-safety',
      external: true,
      label: 'Read Guidelines',
      color: '#10b981'
    }
  ];

  const valueProps = [
    { icon: '⚡', text: 'Quick Submission' },
    { icon: '🔒', text: 'Secure & Private' },
    { icon: '✓', text: 'Verified Review' },
    { icon: '📍', text: 'Geo-tagged Evidence' }
  ];

  return (
    <div className="rs-home">
      {/* ===== TOP NAVIGATION BAR ===== */}
      <nav className="rs-nav">
        <div className="rs-nav-inner">
          <div className="rs-brand">
            <div className="rs-brand-mark">RS</div>
            <div>
              <div className="rs-brand-name">RoadSuraksha</div>
              <div className="rs-brand-sub">Citizen Reporting Portal</div>
            </div>
          </div>

          <div className="rs-nav-actions">
            {isAuthenticated ? (
              <>
                <span className="rs-greeting">
                  Hi, <strong>{user?.name?.split(' ')[0] || 'User'}</strong>
                </span>
                <Link to="/dashboard" className="rs-btn rs-btn-ghost">Dashboard</Link>
                <button onClick={logout} className="rs-btn rs-btn-outline">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rs-btn rs-btn-ghost">Sign In</Link>
                <Link to="/register" className="rs-btn rs-btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="rs-hero">
        <div className="rs-hero-bg-grid" />
        <div className="rs-hero-blob rs-blob-1" />
        <div className="rs-hero-blob rs-blob-2" />

        <div className="rs-hero-content">
          <span className="rs-pill">
            <span className="rs-pill-dot" />
            Official Government Initiative
          </span>

          <h1 className="rs-hero-title">
            Smart, Safer Roads —<br />
            <span className="rs-hero-gradient-text">Powered by Citizens.</span>
          </h1>

          <p className="rs-hero-sub">
            Report traffic violations, track enforcement, and contribute to safer streets — backed by a verified review process from trained officers.
          </p>

          <div className="rs-hero-cta">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="rs-btn rs-btn-hero-primary">
                  Open Dashboard <span className="rs-arrow">→</span>
                </Link>
                <Link to="/submit-report" className="rs-btn rs-btn-hero-secondary">
                  File a Report
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="rs-btn rs-btn-hero-primary">
                  Create Free Account <span className="rs-arrow">→</span>
                </Link>
                <Link to="/login" className="rs-btn rs-btn-hero-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Honest value props instead of fake stats */}
          <div className="rs-value-props">
            {valueProps.map((v, i) => (
              <div key={i} className="rs-value-chip">
                <span className="rs-value-icon">{v.icon}</span>
                <span>{v.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES (compact, single section) ===== */}
      <section className="rs-section">
        <div className="rs-section-head">
          <span className="rs-eyebrow">What you can do</span>
          <h2 className="rs-h2">Everything in one secure portal</h2>
        </div>

        <div className="rs-grid-3">
          {features.map((f, i) => (
            <div key={i} className="rs-feature-card">
              <div
                className="rs-feature-icon"
                style={{
                  background: `linear-gradient(135deg, ${f.color}1a, ${f.color}33)`,
                  color: f.color
                }}
              >
                {f.icon}
              </div>
              <h3 className="rs-feature-title">{f.title}</h3>
              <p className="rs-feature-desc">{f.desc}</p>
              {f.external ? (
                <a href={f.link} target="_blank" rel="noopener noreferrer" className="rs-feature-link">
                  {f.label} <span className="rs-arrow">→</span>
                </a>
              ) : (
                <Link to={f.link} className="rs-feature-link">
                  {f.label} <span className="rs-arrow">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="rs-footer">
        <div className="rs-footer-inner">
          <div className="rs-footer-brand">
            <div className="rs-brand-mark">RS</div>
            <div>
              <div className="rs-footer-brand-name">RoadSuraksha</div>
              <div className="rs-footer-brand-sub">Ministry of Road Transport &amp; Safety</div>
            </div>
          </div>
          <div className="rs-footer-links">
            <Link to="/admin/login">Administration</Link>
            <Link to="/police/login">Enforcement</Link>
            <a href="https://morth.nic.in" target="_blank" rel="noopener noreferrer">Ministry</a>
          </div>
        </div>
        <div className="rs-footer-copy">© 2026 RoadSuraksha · Official Citizen Portal</div>
      </footer>

      <style>{`
        .rs-home {
          min-height: 100vh;
          width: 100vw;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
          position: relative;
          left: 0;
          right: 0;
        }

        /* ===== NAV ===== */
        .rs-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.85);
          backdrop-filter: saturate(180%) blur(14px);
          -webkit-backdrop-filter: saturate(180%) blur(14px);
          border-bottom: 1px solid rgba(15,23,42,0.06);
        }
        .rs-nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 12px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }
        .rs-brand { display: flex; align-items: center; gap: 12px; }
        .rs-brand-mark {
          width: 38px; height: 38px;
          border-radius: 9px;
          background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%);
          color: white; font-weight: 800; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px -2px rgba(124,58,237,0.4);
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        .rs-brand-name { font-weight: 800; font-size: 15px; letter-spacing: -0.01em; color: #0f172a; line-height: 1.1; }
        .rs-brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; font-weight: 500; }
        .rs-nav-actions { display: flex; align-items: center; gap: 8px; }
        .rs-greeting { font-size: 13px; color: #475569; margin-right: 4px; }
        .rs-greeting strong { color: #0f172a; font-weight: 700; }

        /* ===== BUTTONS ===== */
        .rs-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: inherit; font-weight: 600;
          border: none; cursor: pointer; text-decoration: none;
          transition: all 180ms ease;
          white-space: nowrap;
        }
        .rs-btn-ghost {
          padding: 8px 14px; font-size: 13.5px;
          background: transparent; color: #334155;
          border-radius: 8px;
        }
        .rs-btn-ghost:hover { background: rgba(15,23,42,0.06); color: #0f172a; }
        .rs-btn-outline {
          padding: 8px 14px; font-size: 13.5px;
          background: white; color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .rs-btn-outline:hover { border-color: #cbd5e1; color: #0f172a; }
        .rs-btn-primary {
          padding: 9px 16px; font-size: 13.5px;
          background: linear-gradient(135deg, #1d4ed8, #7c3aed);
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px -2px rgba(29,78,216,0.4);
        }
        .rs-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px -4px rgba(29,78,216,0.5); }

        /* ===== HERO ===== */
        .rs-hero {
          position: relative;
          padding: clamp(40px, 6vw, 72px) 24px clamp(48px, 7vw, 80px);
          overflow: hidden;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.10), transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 30%, rgba(236,72,153,0.08), transparent 60%),
            linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
        }
        .rs-hero-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 75%);
          pointer-events: none;
        }
        .rs-hero-blob {
          position: absolute; border-radius: 50%; filter: blur(60px);
          pointer-events: none; opacity: 0.45;
        }
        .rs-blob-1 { top: -120px; right: -80px; width: 360px; height: 360px; background: #c4b5fd; }
        .rs-blob-2 { bottom: -150px; left: -100px; width: 400px; height: 400px; background: #93c5fd; }

        .rs-hero-content {
          position: relative;
          max-width: 980px; margin: 0 auto;
          text-align: center;
        }
        .rs-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          background: white;
          border: 1px solid #e2e8f0;
          font-size: 12px; font-weight: 600;
          color: #475569;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
          margin-bottom: 22px;
        }
        .rs-pill-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.18);
          animation: rs-pulse 2s ease-in-out infinite;
        }
        @keyframes rs-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(16,185,129,0.18); }
          50% { box-shadow: 0 0 0 8px rgba(16,185,129,0.05); }
        }

        .rs-hero-title {
          font-size: clamp(2rem, 4.6vw, 3.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #0f172a;
          margin: 0 0 18px;
        }
        .rs-hero-gradient-text {
          background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .rs-hero-sub {
          font-size: clamp(0.95rem, 1.3vw, 1.1rem);
          color: #475569;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto 28px;
        }
        .rs-hero-cta {
          display: flex; gap: 12px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 36px;
        }
        .rs-btn-hero-primary {
          padding: 13px 24px; font-size: 14.5px; font-weight: 700;
          background: linear-gradient(135deg, #1d4ed8, #7c3aed);
          color: white;
          border-radius: 11px;
          box-shadow: 0 8px 24px -6px rgba(124,58,237,0.5);
        }
        .rs-btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px -8px rgba(124,58,237,0.6);
        }
        .rs-btn-hero-secondary {
          padding: 13px 24px; font-size: 14.5px; font-weight: 600;
          background: white;
          color: #1d4ed8;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
        }
        .rs-btn-hero-secondary:hover {
          border-color: #1d4ed8;
          background: #f8fafc;
          transform: translateY(-2px);
        }
        .rs-arrow { transition: transform 180ms ease; display: inline-block; }
        .rs-btn:hover .rs-arrow,
        .rs-feature-link:hover .rs-arrow { transform: translateX(3px); }

        /* ===== VALUE PROPS (replaces fake stats) ===== */
        .rs-value-props {
          display: flex; gap: 10px; justify-content: center;
          flex-wrap: wrap;
        }
        .rs-value-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          font-size: 13px; font-weight: 600;
          color: #334155;
          box-shadow: 0 1px 3px rgba(15,23,42,0.04);
        }
        .rs-value-icon { font-size: 14px; }

        /* ===== SECTION ===== */
        .rs-section {
          max-width: 1200px; margin: 0 auto;
          padding: clamp(40px, 6vw, 72px) 24px;
        }
        .rs-section-head {
          text-align: center;
          margin-bottom: 36px;
          max-width: 640px; margin-left: auto; margin-right: auto;
        }
        .rs-eyebrow {
          display: inline-block;
          font-size: 11.5px; font-weight: 700;
          color: #7c3aed;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .rs-h2 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0;
        }

        /* ===== FEATURES ===== */
        .rs-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
        }
        .rs-feature-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 26px 24px;
          display: flex; flex-direction: column;
          transition: all 220ms ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .rs-feature-card:hover {
          transform: translateY(-3px);
          border-color: #c4b5fd;
          box-shadow: 0 14px 28px -10px rgba(124,58,237,0.18);
        }
        .rs-feature-icon {
          width: 48px; height: 48px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 16px;
        }
        .rs-feature-title {
          font-size: 17px; font-weight: 700;
          color: #0f172a; margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .rs-feature-desc {
          color: #64748b; font-size: 13.5px; line-height: 1.6;
          margin: 0 0 18px; flex: 1;
        }
        .rs-feature-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13.5px; font-weight: 700;
          color: #1d4ed8; text-decoration: none;
          align-self: flex-start;
          transition: color 150ms ease;
        }
        .rs-feature-link:hover { color: #7c3aed; }

        /* ===== FOOTER ===== */
        .rs-footer {
          border-top: 1px solid #e2e8f0;
          padding: 28px 24px 32px;
          background: white;
        }
        .rs-footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .rs-footer-brand { display: flex; align-items: center; gap: 12px; }
        .rs-footer-brand-name { font-weight: 800; font-size: 14px; color: #0f172a; line-height: 1.1; }
        .rs-footer-brand-sub { font-size: 11.5px; color: #64748b; margin-top: 3px; font-weight: 500; }
        .rs-footer-links {
          display: flex; align-items: center;
          gap: 20px; flex-wrap: wrap;
        }
        .rs-footer-links a {
          color: #475569; text-decoration: none; font-size: 13px; font-weight: 600;
          transition: color 150ms ease;
        }
        .rs-footer-links a:hover { color: #1d4ed8; }
        .rs-footer-copy {
          max-width: 1200px; margin: 0 auto;
          padding-top: 14px; border-top: 1px solid #f1f5f9;
          text-align: center;
          font-size: 12px; color: #94a3b8;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 640px) {
          .rs-nav-inner { padding: 12px 16px; }
          .rs-brand-sub { display: none; }
          .rs-greeting { display: none; }
          .rs-nav-actions .rs-btn-ghost { display: none; }
        }
      `}</style>
    </div>
  );
}
