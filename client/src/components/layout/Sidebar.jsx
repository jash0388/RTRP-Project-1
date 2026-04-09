import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const isPolice = user?.role === 'police';

  // Citizen links
  const userLinks = [
    { to: '/dashboard', label: 'Overview' },
    { to: '/submit-report', label: 'New Report' },
    { to: '/report-history', label: 'My Reports' },
    { to: '/profile', label: 'Profile' },
  ];

  // Police links
  const policeLinks = [
    { to: '/police', label: 'Live Feed' },
    { to: '/police/reports', label: 'Review Violations' },
  ];

  // Admin links
  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/reports', label: 'All Reports' },
    { to: '/admin/users', label: 'User Directory' },
    { to: '/analytics', label: 'System Analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'police': return 'Traffic Officer';
      default: return 'Authorized Citizen';
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">R</div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">RoadSuraksha</div>
          <div className="sidebar-brand-sub">Management System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Only show citizen links for 'user' role */}
        {user?.role === 'user' && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Citizen Portal</div>
            {userLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Police-specific links */}
        {isPolice && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Operations</div>
            {policeLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Admin-specific links */}
        {isAdmin && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Administration</div>
            {adminLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" style={{ marginBottom: 'var(--space-md)' }}>
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-tertiary)',
              marginTop: '2px'
            }}>
              {getRoleLabel()}
            </div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleLogout}
          title="Logout"
          style={{
            width: '100%',
            justifyContent: 'center',
            color: '#ef4444'
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
