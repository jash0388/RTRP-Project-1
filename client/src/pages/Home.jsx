import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      title: 'Violation Reporting',
      desc: 'Submit photographic or video evidence of traffic violations encountered on public roads.',
      link: '/submit-report',
      label: 'File a Report'
    },
    {
      title: 'Status Tracking',
      desc: 'Track the real-time status of your submitted reports and view verification outcomes.',
      link: '/report-history',
      label: 'Track Submissions'
    },
    {
      title: 'Safety Guidelines',
      desc: 'Review official road safety protocols and guidelines for traffic compliance.',
      link: '#',
      label: 'View Guidelines'
    }
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={{ 
        background: 'var(--primary-800)', 
        color: 'white',
        padding: 'var(--space-3xl) var(--space-xl)',
        textAlign: 'center',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 'var(--space-2xl)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'var(--font-4xl)', 
            fontWeight: 800, 
            marginBottom: 'var(--space-md)',
            letterSpacing: '-0.02em'
          }}>
            RoadSuraksha: Citizen Traffic Reporting Portal
          </h1>
          <p style={{ 
            fontSize: 'var(--font-lg)', 
            opacity: 0.9, 
            marginBottom: 'var(--space-xl)',
            lineHeight: 1.6
          }}>
            An official initiative to enhance road safety through community participation and AI-driven monitoring. 
            Report violations securely and contribute to safer roads for everyone.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-secondary btn-lg" style={{ color: 'var(--primary-800)', fontWeight: 700 }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary btn-lg" style={{ color: 'var(--primary-800)', fontWeight: 700 }}>
                  Citizen Registration
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                  Portal Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--primary-800)', marginBottom: 'var(--space-sm)' }}>
          Online Citizen Services
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          Access official traffic violation management services directly through the portal.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'var(--space-xl)' 
        }}>
          {services.map((service, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <h3 className="card-title" style={{ color: 'var(--primary-800)' }}>{service.title}</h3>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
                  {service.desc}
                </p>
                <Link to={service.link} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  {service.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Footnote */}
      <footer style={{ 
        marginTop: 'var(--space-3xl)', 
        paddingTop: 'var(--space-xl)',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        paddingBottom: 'var(--space-xl)'
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
    </div>
  );
}
