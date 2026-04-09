import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const isPolice = user?.role === 'police';

  // Citizen links
  const userLinks = [
    { to: '/dashboard', label: 'Dashboard Home' },
    { to: '/submit-report', label: 'File New Report' },
    { to: '/report-history', label: 'My Submissions' },
    { to: '/profile', label: 'User Profile' },
  ];

  // Police links
  const policeLinks = [
    { to: '/police', label: 'Violation Feed' },
    { to: '/police/reports', label: 'Review Pending' },
  ];

  // Admin links
  const adminLinks = [
    { to: '/admin', label: 'Admin Overview' },
    { to: '/admin/reports', label: 'System Reports' },
    { to: '/admin/users', label: 'Manage Users' },
    { to: '/analytics', label: 'Analytics Hub' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin': return 'System Administrator';
      case 'police': return 'Traffic Enforcement';
      default: return 'Citizen User';
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">RS</div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">RoadSuraksha</div>
          <div className="sidebar-brand-sub">Traffic Monitoring</div>
        </div>
      </div>

      <nav className="sidebar-nav">
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
              color: 'var(--text-tertiary)',
              marginTop: '2px',
              fontWeight: 700
            }}>
              {getRoleLabel()}
            </div>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleLogout}
          style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
