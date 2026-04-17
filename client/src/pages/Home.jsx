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
      link: 'https://morth.nic.in/road-safety',
      external: true,
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
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-lg" style={{
                background: '#ffffff',
                color: '#1e3a8a',
                fontWeight: 700,
                border: '2px solid #ffffff',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                letterSpacing: '0.02em'
              }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-lg" style={{
                  background: '#ffffff',
                  color: '#1e3a8a',
                  fontWeight: 700,
                  border: '2px solid #ffffff',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  letterSpacing: '0.02em',
                  fontSize: '1rem'
                }}>
                  Citizen Registration
                </Link>
                <Link to="/login" className="btn btn-lg" style={{
                  background: 'transparent',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: '2px solid rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(4px)',
                  letterSpacing: '0.02em',
                  fontSize: '1rem'
                }}>
                  Portal Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        marginBottom: 'var(--space-2xl)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'var(--font-2xl)',
          fontWeight: 800,
          color: 'var(--primary-800)',
          marginBottom: 'var(--space-sm)'
        }}>
          Online Citizen Services
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-xl)',
          maxWidth: '600px',
          margin: '0 auto',
          marginBottom: 'var(--space-xl)'
        }}>
          Access official traffic violation management services directly through the portal.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-lg)'
        }}>
          {services.map((service, i) => (
            <div key={i} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <h3 className="card-title" style={{ color: 'var(--primary-800)', fontSize: 'var(--font-md)' }}>
                  {service.title}
                </h3>
              </div>
              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-lg)',
                  lineHeight: 1.6,
                  fontSize: 'var(--font-sm)',
                  flex: 1
                }}>
                  {service.desc}
                </p>
                {service.external ? (
                  <a href={service.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    {service.label}
                  </a>
                ) : (
                  <Link to={service.link} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    {service.label}
                  </Link>
                )}
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
