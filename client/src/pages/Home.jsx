import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();

  const features = [
    {
      title: 'AI Violation Detection',
      desc: 'Automatic recognition of helmet violations, triple riding, and number plates using state-of-the-art computer vision.'
    },
    {
      title: 'Professional Analytics',
      desc: 'Beautiful, data-driven insights with heatmaps and violation trends for traffic management authorities.'
    },
    {
      title: 'Citizen Empowerment',
      desc: 'A simple, secure platform for citizens to contribute to road safety by reporting violations in real-time.'
    }
  ];

  return (
    <div className="home-container" style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'white' }}>
      {/* Hero Section */}
      <section className="hero" style={{ 
        paddingTop: 'var(--space-3xl)', 
        paddingBottom: 'var(--space-3xl)',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div className="fade-in" style={{ animation: 'fadeIn 1s ease-out' }}>
          <div style={{ 
            fontSize: 'var(--font-sm)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            color: 'var(--text-tertiary)',
            marginBottom: 'var(--space-md)',
            fontWeight: 600
          }}>
            AI-Powered Traffic Safety
          </div>
          
          <h1 className="serif" style={{ 
            fontSize: 'var(--font-5xl)', 
            lineHeight: 1, 
            marginBottom: 'var(--space-lg)',
            letterSpacing: '-0.03em'
          }}>
            Transforming Road Safety <br />
            with <span style={{ opacity: 0.7 }}>Intelligent Monitoring</span>
          </h1>

          <p style={{ 
            fontSize: 'var(--font-xl)', 
            color: 'var(--text-secondary)', 
            maxWidth: '650px', 
            margin: '0 auto var(--space-2xl) auto',
            lineHeight: 1.5
          }}>
            RoadSuraksha combines computer vision and real-time analytics to create a safer, 
            smarter environment for both citizens and authorities.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Enter Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Hero Stats (Minimalist) */}
      <section style={{ 
        paddingBottom: 'var(--space-3xl)',
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-3xl)',
        borderBottom: '1px solid var(--border-color)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 700 }}>10K+</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reports</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 700 }}>95%</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Accuracy</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 700 }}>50+</div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cities</div>
        </div>
      </section>

      {/* Features Grid (Datanauts style - purely text & whitespace) */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-md)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'var(--space-3xl)' 
        }}>
          {features.map((f, i) => (
            <div key={i} className="slide-up" style={{ animationDelay: `${i * 0.2}s` }}>
              <h3 className="serif" style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-md)' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-md)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Footer */}
      <footer style={{
        padding: 'var(--space-3xl) var(--space-md)',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        background: 'var(--bg-secondary)'
      }}>
        <div className="serif" style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--space-sm)' }}>
          RoadSuraksha
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
          © 2024 RoadSuraksha. A Professional Traffic Violation Management System.
        </p>
      </footer>
    </div>
  );
}
