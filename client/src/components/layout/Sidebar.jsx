import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const isPolice = user?.role === 'police';

  // Citizen links — only their own reporting flow
  const userLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/submit-report', icon: '📸', label: 'Submit Report' },
    { to: '/report-history', icon: '📋', label: 'Report History' },
    { to: '/profile', icon: '👤', label: 'My Profile' },
  ];

  // Police links — review reports, map, basic stats
  const policeLinks = [
    { to: '/police', icon: '🏠', label: 'Police Dashboard' },
    { to: '/police/reports', icon: '📑', label: 'Review Reports' },
  ];

  // Admin links — full system management
  const adminLinks = [
    { to: '/admin', icon: '🏠', label: 'Admin Dashboard' },
    { to: '/admin/reports', icon: '📑', label: 'Manage Reports' },
    { to: '/admin/users', icon: '👥', label: 'Manage Users' },
    { to: '/analytics', icon: '📈', label: 'Analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin': return { text: 'System Admin', color: '#ef4444' };
      case 'police': return { text: 'Traffic Police', color: '#0ea5e9' };
      default: return { text: 'Citizen', color: '#22c55e' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">R</div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">RoadSuraksha</div>
          <div className="sidebar-brand-sub">Traffic Violation System</div>
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
                <span className="sidebar-link-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Police-specific links */}
        {isPolice && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Police Portal</div>
            {policeLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
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
                <span className="sidebar-link-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div style={{
              fontSize: 'var(--font-xs)',
              color: roleBadge.color,
              fontWeight: 600
            }}>
              {roleBadge.text}
            </div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleLogout}
          title="Logout"
          style={{
            width: '100%',
            marginTop: 'var(--space-sm)',
            justifyContent: 'center',
            color: 'var(--danger-500)'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
