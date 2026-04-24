import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const getTitle = () => {
    switch (user?.role) {
      case 'admin': return 'System Administration Portal';
      case 'police': return 'Enforcement Officer Dashboard';
      default: return 'Citizen Services Portal';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <Link
          to="/"
          className="navbar-home-btn"
          title="Back to Home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 13px',
            background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 3px 10px -2px rgba(124,58,237,0.4)',
            transition: 'all 180ms ease',
            marginRight: 'var(--space-md)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px -3px rgba(124,58,237,0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 3px 10px -2px rgba(124,58,237,0.4)';
          }}
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>←</span>
          <span>Home</span>
        </Link>
        <span className="navbar-title">
          {getTitle()}
        </span>
      </div>

      <div className="navbar-right">
        <div className="theme-toggle" style={{ marginRight: 'var(--space-md)' }}>
          <button
            className={`theme-toggle-option ${theme === 'light' ? 'active' : ''}`}
            onClick={() => theme !== 'light' && toggleTheme()}
            aria-label="Light mode"
          >
            ☀️
          </button>
          <button
            className={`theme-toggle-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => theme !== 'dark' && toggleTheme()}
            aria-label="Dark mode"
          >
            🌙
          </button>
        </div>
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
          RoadSuraksha v1.0
        </div>
      </div>
    </nav>
  );
}
