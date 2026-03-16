import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: '📸',
      title: 'Easy Reporting',
      desc: 'Capture or upload photos/videos of traffic violations with automatic GPS location detection.'
    },
    {
      icon: '🤖',
      title: 'AI Detection',
      desc: 'Automatic violation detection, helmet recognition, number plate OCR, and vehicle identification.'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      desc: 'Comprehensive charts, heatmaps, and statistics for data-driven traffic management.'
    },
    {
      icon: '🗺️',
      title: 'Location Tracking',
      desc: 'Interactive maps showing violation hotspots and area-wise traffic violation reports.'
    },
    {
      icon: '🛡️',
      title: 'Admin Panel',
      desc: 'Secure dashboard for traffic police to review, approve, or reject violation reports.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      desc: 'JWT-based authentication, encrypted passwords, and role-based access control.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
          <div className="theme-toggle">
            <button
              className={`theme-toggle-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >☀️</button>
            <button
              className={`theme-toggle-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >🌙</button>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            🚦 AI-Powered Traffic Safety
          </div>
          <h1 className="hero-title">
            Smart Traffic <span>Violation Reporting</span> & Analytics
          </h1>
          <p className="hero-description">
            Empowering citizens and traffic police with AI-powered violation detection,
            real-time reporting, and comprehensive analytics for safer roads.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  📊 Go to Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-secondary btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                    🛡️ Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  🚀 Get Started
                </Link>
                <Link to="/login" className="btn hero-btn-outline btn-lg">
                  🔑 Sign In
                </Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">10K+</div>
              <div className="hero-stat-label">Reports Filed</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">95%</div>
              <div className="hero-stat-label">AI Accuracy</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">50+</div>
              <div className="hero-stat-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
            Powerful Features
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-lg)' }}>
            Everything you need for smart traffic violation management
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card slide-up" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-xl)',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-tertiary)',
        fontSize: 'var(--font-sm)',
        background: 'var(--bg-secondary)'
      }}>
        <p>© 2024 RoadSuraksha — Smart Traffic Violation Reporting & Analytics System</p>
        <p style={{ marginTop: 'var(--space-xs)' }}>
          Built with React, Node.js, MongoDB & AI 🤖
        </p>
      </footer>
    </div>
  );
}
