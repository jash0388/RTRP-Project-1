import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  const getTitle = () => {
    switch (user?.role) {
      case 'admin': return 'System Administration';
      case 'police': return 'Traffic Police Dashboard';
      default: return 'Citizen Portal';
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
        {/* Theme toggle removed for a more professional consistent dark theme */}
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>
          RoadSuraksha v1.0
        </div>
      </div>
    </nav>
  );
}
