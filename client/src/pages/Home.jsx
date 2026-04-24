import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  const services = [
    {
      icon: '📸',
      title: 'Violation Reporting',
      desc: 'Submit photographic or video evidence of traffic violations encountered on public roads with one tap.',
      link: '/submit-report',
      label: 'File a Report'
    },
    {
      icon: '📊',
      title: 'Status Tracking',
      desc: 'Track the real-time status of your submitted reports and view verification outcomes from enforcement.',
      link: '/report-history',
      label: 'Track Submissions'
    },
    {
      icon: '🛡️',
      title: 'Safety Guidelines',
      desc: 'Review official road safety protocols and the latest enforcement guidelines from the ministry.',
      link: 'https://morth.nic.in/road-safety',
      external: true,
      label: 'View Guidelines'
    }
  ];

  const stats = [
    { value: '12.4K+', label: 'Reports Filed' },
    { value: '8.7K+', label: 'Violations Verified' },
    { value: '320+', label: 'Active Officers' },
    { value: '24/7', label: 'Citizen Support' }
  ];

  const steps = [
    { n: '01', t: 'Capture', d: 'Snap a photo or short video of the violation in progress.' },
    { n: '02', t: 'Submit', d: 'Tag the location, choose the violation type, and upload securely.' },
    { n: '03', t: 'Verify', d: 'Trained officers review the evidence and verify vehicle details.' },
    { n: '04', t: 'Action', d: 'Authorities take enforcement action and update you on the outcome.' }
  ];

  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      {isAuthenticated && (
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100 }}>
          <button onClick={logout} className="btn" style={{
            background: '#ef4444', color: 'white', border: 'none', fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>Log Out</button>
        </div>
      )}

      {/* Hero */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
        color: 'white',
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 4rem)',
        textAlign: 'center',
        borderRadius: 'var(--radius-2xl)',
        marginBottom: 'var(--space-2xl)',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(30, 58, 138, 0.4)'
      }}>
        {/* Decorative grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', maxWidth: '880px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: '6px 14px', borderRadius: '999px',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 'var(--space-lg)',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }} />
            Official Government Initiative
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800,
            marginBottom: 'var(--space-md)', letterSpacing: '-0.03em', lineHeight: 1.1
          }}>
            RoadSuraksha
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #fbbf24, #f472b6, #60a5fa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Citizen Traffic Reporting
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            opacity: 0.92, marginBottom: 'var(--space-xl)', lineHeight: 1.6,
            maxWidth: '680px', margin: '0 auto var(--space-xl)'
          }}>
            Empowering citizens to report violations, track enforcement, and contribute to safer roads —
            backed by a verified review process from trained traffic officers.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-lg" style={{
                background: '#ffffff', color: '#1e3a8a', fontWeight: 700,
                border: 'none', padding: '0.85rem 1.75rem',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)'
              }}>Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-lg" style={{
                  background: '#ffffff', color: '#1e3a8a', fontWeight: 700,
                  border: 'none', padding: '0.85rem 1.75rem',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
                  borderRadius: 'var(--radius-lg)', fontSize: '1rem'
                }}>Citizen Registration</Link>
                <Link to="/login" className="btn btn-lg" style={{
                  background: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 600,
                  border: '2px solid rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(8px)', padding: '0.85rem 1.75rem',
                  borderRadius: 'var(--radius-lg)', fontSize: '1rem'
                }}>Portal Login</Link>
              </>
            )}
          </div>

          {/* Hero stats */}
          <div style={{
            marginTop: 'var(--space-2xl)',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--space-md)', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto'
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: '11px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', marginBottom: 'var(--space-3xl)', padding: '0 var(--space-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 700, color: 'var(--primary-700)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 'var(--space-sm)'
          }}>What you can do</div>
          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--primary-900)', marginBottom: 'var(--space-sm)', letterSpacing: '-0.02em' }}>
            Online Citizen Services
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'var(--font-md)' }}>
            Everything you need to report, track, and stay informed — all in one secure portal.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
          {services.map((service, i) => (
            <div key={i} className="service-card" style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              border: '1px solid var(--border-color)',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
            }}>
              <div style={{
                width: '54px', height: '54px',
                background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                color: 'var(--primary-700)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', marginBottom: 'var(--space-md)'
              }}>{service.icon}</div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 'var(--space-sm)' }}>
                {service.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.6, fontSize: 'var(--font-sm)', flex: 1 }}>
                {service.desc}
              </p>
              {service.external ? (
                <a href={service.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  {service.label} →
                </a>
              ) : (
                <Link to={service.link} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  {service.label} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{
        maxWidth: '1120px', margin: '0 auto var(--space-3xl)', padding: '0 var(--space-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 700, color: 'var(--primary-700)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 'var(--space-sm)'
          }}>The Process</div>
          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--primary-900)', marginBottom: 'var(--space-sm)', letterSpacing: '-0.02em' }}>
            How RoadSuraksha Works
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)' }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              position: 'relative',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl) var(--space-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: '-20px', right: '-10px',
                fontSize: '5rem', fontWeight: 900, color: 'var(--primary-50)',
                lineHeight: 1, letterSpacing: '-0.05em'
              }}>{s.n}</div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  display: 'inline-block', padding: '4px 10px',
                  background: 'var(--primary-700)', color: 'white',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
                  borderRadius: '999px', marginBottom: 'var(--space-md)'
                }}>STEP {s.n}</div>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 'var(--space-sm)' }}>{s.t}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', lineHeight: 1.6 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      {!isAuthenticated && (
        <section style={{
          maxWidth: '1120px', margin: '0 auto var(--space-3xl)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          padding: 'var(--space-2xl)',
          borderRadius: 'var(--radius-2xl)',
          textAlign: 'center',
          border: '1px solid #1e293b',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
            Be part of safer roads.
          </h2>
          <p style={{ opacity: 0.85, marginBottom: 'var(--space-lg)', fontSize: 'var(--font-md)' }}>
            Register as a citizen reporter in under a minute. No app install required.
          </p>
          <Link to="/register" className="btn btn-lg" style={{
            background: 'linear-gradient(90deg, #fbbf24, #f472b6)', color: '#0f172a', fontWeight: 700,
            border: 'none', padding: '0.85rem 2rem',
            borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px -5px rgba(244, 114, 182, 0.5)'
          }}>Create Free Account →</Link>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: 'var(--space-2xl)', paddingTop: 'var(--space-xl)',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center', paddingBottom: 'var(--space-xl)'
      }}>
        <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', fontSize: '11px', fontWeight: 600 }}>
          <Link to="/admin/login" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>System Administration</Link>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <Link to="/police/login" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Enforcement Gateway</Link>
        </div>
        <div style={{ fontWeight: 700, color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ministry of Road Transport & Safety | Official Citizen Portal
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginTop: '4px' }}>
          © 2024 RoadSuraksha System. All Rights Reserved.
        </p>
      </footer>

      <style>{`
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(30, 58, 138, 0.15), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
          border-color: var(--primary-300) !important;
        }
      `}</style>
    </div>
  );
}
