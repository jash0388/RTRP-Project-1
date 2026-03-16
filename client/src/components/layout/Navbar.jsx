import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <span className="navbar-title">
          {user?.role === 'admin' ? '🛡️ Admin Panel' : '🚦 Traffic Reporter'}
        </span>
      </div>

      <div className="navbar-right">
        <div className="theme-toggle">
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
      </div>
    </nav>
  );
}
