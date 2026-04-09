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
