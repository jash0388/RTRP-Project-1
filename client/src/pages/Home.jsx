import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  const services = [
    {
      icon: '📸',
      title: 'Violation Reporting',
      desc: 'Submit photographic or video evidence of traffic violations encountered on public roads with one tap.',
      link: '/submit-report',
      label: 'File a Report',
      color: '#3b82f6'
    },
    {
      icon: '📊',
      title: 'Status Tracking',
      desc: 'Track the real-time status of your submitted reports and view verification outcomes from enforcement.',
      link: '/report-history',
      label: 'Track Submissions',
      color: '#8b5cf6'
    },
    {
      icon: '🛡️',
      title: 'Safety Guidelines',
      desc: 'Review official road safety protocols and the latest enforcement guidelines from the ministry.',
      link: 'https://morth.nic.in/road-safety',
      external: true,
      label: 'View Guidelines',
      color: '#10b981'
    }
  ];

  const stats = [
    { value: '12.4K+', label: 'Reports Filed', icon: '📋' },
    { value: '8.7K+', label: 'Verified', icon: '✓' },
    { value: '320+', label: 'Officers', icon: '👮' },
    { value: '24/7', label: 'Support', icon: '🕒' }
  ];

  const steps = [
    { n: '01', t: 'Capture', d: 'Snap a photo or short video of the violation in progress.', icon: '📷' },
    { n: '02', t: 'Submit', d: 'Tag the location, choose the violation type, and upload securely.', icon: '📤' },
    { n: '03', t: 'Verify', d: 'Trained officers review the evidence and verify vehicle details.', icon: '🔍' },
    { n: '04', t: 'Action', d: 'Authorities take enforcement action and update you on the outcome.', icon: '⚖️' }
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
        <div className="rs-hero-blob rs-blob-3" />

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
            Report traffic violations, track enforcement, and contribute to safer streets.
            Backed by a verified review process from trained officers.
          </p>

          <div className="rs-hero-cta">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="rs-btn rs-btn-hero-primary">
                  Open Dashboard
                  <span className="rs-arrow">→</span>
                </Link>
                <Link to="/submit-report" className="rs-btn rs-btn-hero-secondary">
                  File a Report
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="rs-btn rs-btn-hero-primary">
                  Create Free Account
                  <span className="rs-arrow">→</span>
                </Link>
                <Link to="/login" className="rs-btn rs-btn-hero-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats inside hero */}
          <div className="rs-stats">
            {stats.map((s, i) => (
              <div key={i} className="rs-stat-card">
                <div className="rs-stat-icon">{s.icon}</div>
                <div>
                  <div className="rs-stat-value">{s.value}</div>
                  <div className="rs-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="rs-section">
        <div className="rs-section-head">
          <span className="rs-eyebrow">What you can do</span>
          <h2 className="rs-h2">Online Citizen Services</h2>
          <p className="rs-section-desc">
            Everything you need to report, track, and stay informed — all in one secure portal.
          </p>
        </div>

        <div className="rs-grid-3">
          {services.map((service, i) => (
            <div key={i} className="rs-service-card">
              <div className="rs-service-icon" style={{ background: `linear-gradient(135deg, ${service.color}20, ${service.color}40)`, color: service.color }}>
                {service.icon}
              </div>
              <h3 className="rs-service-title">{service.title}</h3>
              <p className="rs-service-desc">{service.desc}</p>
              {service.external ? (
                <a href={service.link} target="_blank" rel="noopener noreferrer" className="rs-btn rs-btn-card">
                  {service.label} <span className="rs-arrow">→</span>
                </a>
              ) : (
                <Link to={service.link} className="rs-btn rs-btn-card">
                  {service.label} <span className="rs-arrow">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="rs-section">
        <div className="rs-section-head">
          <span className="rs-eyebrow">The process</span>
          <h2 className="rs-h2">How RoadSuraksha Works</h2>
          <p className="rs-section-desc">From your camera to enforcement action — in four simple steps.</p>
        </div>

        <div className="rs-grid-4">
          {steps.map((s, i) => (
            <div key={i} className="rs-step-card">
              <div className="rs-step-number">{s.n}</div>
              <div className="rs-step-icon">{s.icon}</div>
              <h3 className="rs-step-title">{s.t}</h3>
              <p className="rs-step-desc">{s.d}</p>
              {i < steps.length - 1 && <div className="rs-step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      {!isAuthenticated && (
        <section className="rs-cta-banner">
          <div className="rs-cta-glow" />
          <div className="rs-cta-content">
            <h2 className="rs-cta-title">Be part of safer roads.</h2>
            <p className="rs-cta-sub">
              Register as a citizen reporter in under a minute. No app install required.
            </p>
            <Link to="/register" className="rs-btn rs-btn-cta">
              Create Free Account <span className="rs-arrow">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="rs-footer">
        <div className="rs-footer-links">
          <Link to="/admin/login">System Administration</Link>
          <span className="rs-dot-sep">•</span>
          <Link to="/police/login">Enforcement Gateway</Link>
          <span className="rs-dot-sep">•</span>
          <a href="https://morth.nic.in" target="_blank" rel="noopener noreferrer">Ministry Website</a>
        </div>
        <div className="rs-footer-line">
          Ministry of Road Transport &amp; Safety · Official Citizen Portal
        </div>
        <div className="rs-footer-copy">© 2026 RoadSuraksha System · All Rights Reserved</div>
      </footer>

      <style>{`
        .rs-home {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          margin: -1.5rem -2rem;
        }
        @media (max-width: 768px) {
          .rs-home { margin: -1rem; }
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
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }
        .rs-brand { display: flex; align-items: center; gap: 12px; }
        .rs-brand-mark {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%);
          color: white; font-weight: 800; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 16px -4px rgba(124,58,237,0.45);
          letter-spacing: 0.5px;
        }
        .rs-brand-name { font-weight: 800; font-size: 16px; letter-spacing: -0.01em; color: #0f172a; line-height: 1.1; }
        .rs-brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; font-weight: 500; }
        .rs-nav-actions { display: flex; align-items: center; gap: 10px; }
        .rs-greeting { font-size: 13px; color: #475569; margin-right: 6px; }
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
        .rs-btn-outline:hover { border-color: #cbd5e1; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
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
          padding: clamp(48px, 8vw, 96px) 24px clamp(64px, 9vw, 120px);
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
          pointer-events: none; opacity: 0.5;
        }
        .rs-blob-1 { top: -120px; right: -80px; width: 380px; height: 380px; background: #c4b5fd; }
        .rs-blob-2 { bottom: -150px; left: -100px; width: 420px; height: 420px; background: #93c5fd; }
        .rs-blob-3 { top: 30%; left: 50%; width: 260px; height: 260px; background: #fbcfe8; opacity: 0.35; }

        .rs-hero-content {
          position: relative;
          max-width: 1100px; margin: 0 auto;
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
          margin-bottom: 28px;
          letter-spacing: 0.02em;
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
          font-size: clamp(2.2rem, 5.2vw, 4rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #0f172a;
          margin: 0 0 20px;
        }
        .rs-hero-gradient-text {
          background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .rs-hero-sub {
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          color: #475569;
          line-height: 1.65;
          max-width: 640px;
          margin: 0 auto 36px;
        }
        .rs-hero-cta {
          display: flex; gap: 12px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 56px;
        }
        .rs-btn-hero-primary {
          padding: 14px 26px; font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #1d4ed8, #7c3aed);
          color: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px -8px rgba(124,58,237,0.5), 0 4px 6px -2px rgba(29,78,216,0.3);
        }
        .rs-btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px -8px rgba(124,58,237,0.6), 0 6px 12px -3px rgba(29,78,216,0.4);
        }
        .rs-btn-hero-secondary {
          padding: 14px 26px; font-size: 15px; font-weight: 600;
          background: white;
          color: #1d4ed8;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(15,23,42,0.06);
        }
        .rs-btn-hero-secondary:hover {
          border-color: #1d4ed8;
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(15,23,42,0.08);
        }
        .rs-arrow { transition: transform 180ms ease; display: inline-block; }
        .rs-btn:hover .rs-arrow { transform: translateX(3px); }

        /* ===== STATS ===== */
        .rs-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          max-width: 880px;
          margin: 0 auto;
        }
        .rs-stat-card {
          display: flex; align-items: center; gap: 14px;
          padding: 18px 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          text-align: left;
          box-shadow: 0 4px 16px -6px rgba(15,23,42,0.08);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .rs-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -8px rgba(15,23,42,0.12);
        }
        .rs-stat-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #eff6ff, #ede9fe);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .rs-stat-value {
          font-size: 22px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.02em;
          line-height: 1;
        }
        .rs-stat-label {
          font-size: 12px; color: #64748b;
          font-weight: 600; margin-top: 4px;
          text-transform: uppercase; letter-spacing: 0.06em;
        }

        /* ===== SECTIONS ===== */
        .rs-section {
          max-width: 1200px; margin: 0 auto;
          padding: clamp(56px, 8vw, 100px) 24px;
        }
        .rs-section-head {
          text-align: center;
          margin-bottom: 48px;
          max-width: 700px; margin-left: auto; margin-right: auto;
        }
        .rs-eyebrow {
          display: inline-block;
          font-size: 12px; font-weight: 700;
          color: #7c3aed;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .rs-h2 {
          font-size: clamp(1.75rem, 3.2vw, 2.5rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0 0 12px;
        }
        .rs-section-desc {
          color: #475569; font-size: 16px; line-height: 1.6;
          margin: 0;
        }

        /* ===== SERVICES ===== */
        .rs-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .rs-service-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 28px;
          display: flex; flex-direction: column;
          transition: all 220ms ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .rs-service-card:hover {
          transform: translateY(-4px);
          border-color: #c4b5fd;
          box-shadow: 0 20px 40px -12px rgba(124,58,237,0.18);
        }
        .rs-service-icon {
          width: 52px; height: 52px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 18px;
        }
        .rs-service-title {
          font-size: 18px; font-weight: 700;
          color: #0f172a; margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .rs-service-desc {
          color: #64748b; font-size: 14px; line-height: 1.65;
          margin: 0 0 22px; flex: 1;
        }
        .rs-btn-card {
          padding: 11px 18px; font-size: 13.5px;
          background: #0f172a; color: white;
          border-radius: 10px; align-self: flex-start;
        }
        .rs-btn-card:hover { background: #1e293b; transform: translateY(-1px); }

        /* ===== STEPS ===== */
        .rs-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .rs-step-card {
          position: relative;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 28px 24px;
          text-align: left;
          transition: all 220ms ease;
        }
        .rs-step-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px -12px rgba(15,23,42,0.12);
          border-color: #cbd5e1;
        }
        .rs-step-number {
          font-size: 13px; font-weight: 800;
          color: #7c3aed;
          letter-spacing: 0.1em;
          margin-bottom: 14px;
        }
        .rs-step-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #eff6ff, #ede9fe);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          margin-bottom: 16px;
        }
        .rs-step-title {
          font-size: 17px; font-weight: 700;
          color: #0f172a; margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .rs-step-desc { color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; }
        .rs-step-arrow {
          display: none;
          position: absolute; right: -14px; top: 50%;
          transform: translateY(-50%);
          color: #cbd5e1; font-size: 24px;
          z-index: 2; background: #f8fafc;
          width: 28px; height: 28px;
          align-items: center; justify-content: center;
          border-radius: 50%;
        }
        @media (min-width: 1080px) {
          .rs-step-arrow { display: flex; }
          .rs-step-card:last-child .rs-step-arrow { display: none; }
        }

        /* ===== CTA BANNER ===== */
        .rs-cta-banner {
          position: relative;
          max-width: 1200px; margin: 0 auto 80px;
          padding: 56px 32px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%);
          border-radius: 24px;
          overflow: hidden;
          text-align: center;
          color: white;
          box-shadow: 0 24px 48px -16px rgba(15,23,42,0.4);
        }
        .rs-cta-glow {
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(124,58,237,0.4), transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(236,72,153,0.3), transparent 50%);
          pointer-events: none;
        }
        .rs-cta-content { position: relative; max-width: 600px; margin: 0 auto; }
        .rs-cta-title {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800; margin: 0 0 12px;
          letter-spacing: -0.025em;
        }
        .rs-cta-sub { font-size: 16px; opacity: 0.85; margin: 0 0 28px; line-height: 1.6; }
        .rs-btn-cta {
          padding: 14px 28px; font-size: 15px; font-weight: 700;
          background: white; color: #0f172a;
          border-radius: 12px;
          box-shadow: 0 10px 28px -8px rgba(0,0,0,0.4);
        }
        .rs-btn-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 36px -8px rgba(0,0,0,0.5); }

        /* ===== FOOTER ===== */
        .rs-footer {
          border-top: 1px solid #e2e8f0;
          padding: 36px 24px 48px;
          text-align: center;
          background: white;
        }
        .rs-footer-links {
          display: flex; justify-content: center; align-items: center;
          gap: 12px; flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .rs-footer-links a {
          color: #475569; text-decoration: none; font-size: 13px; font-weight: 600;
          transition: color 150ms ease;
        }
        .rs-footer-links a:hover { color: #1d4ed8; }
        .rs-dot-sep { color: #cbd5e1; }
        .rs-footer-line {
          font-size: 13px; color: #475569; font-weight: 600;
          margin-bottom: 6px;
        }
        .rs-footer-copy { font-size: 12px; color: #94a3b8; }

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
