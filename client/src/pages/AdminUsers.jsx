import React from 'react';
const { useState, useEffect } = React;
import { adminAPI } from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Registration modal state
  const [showRegModal, setShowRegModal] = useState(false);
  const [regType, setRegType] = useState('police'); // 'police', 'admin', or 'user'
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers(page);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (id) => {
    if (!window.confirm('Are you sure you want to change this user\'s access status?')) return;
    try {
      await adminAPI.toggleBanUser(id);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('PERMANENT ACTION: Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const openRegModal = (type) => {
    setRegType(type);
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegError('');
    setRegSuccess('');
    setShowRegModal(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);

    try {
      let fn;
      if (regType === 'admin') fn = adminAPI.registerAdmin;
      else if (regType === 'police') fn = adminAPI.registerPolice;
      else fn = adminAPI.registerUser;
      const data = await fn(regName, regEmail, regPassword);
      const roleLabel = regType === 'admin' ? 'Admin' : regType === 'police' ? 'Police officer' : 'Citizen user';
      setRegSuccess(data.message || `${roleLabel} registered successfully!`);
      loadUsers(); // Refresh user list
      // Clear form but keep modal open to show success
      setRegName('');
      setRegEmail('');
      setRegPassword('');
    } catch (err) {
      setRegError(err.message || 'Registration failed.');
    } finally {
      setRegLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'badge-rejected'; // red for admin
      case 'police': return 'badge-pending'; // yellow for police
      default: return 'badge-approved'; // green for user
    }
  };

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Users 👥</h1>
        <p className="page-subtitle">View and manage registered users ({total} total)</p>
      </div>

      {/* Registration Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          onClick={() => openRegModal('police')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          🛡️ Register Police Officer
        </button>
        <button
          className="btn"
          onClick={() => openRegModal('admin')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#b91c1c', color: 'white', border: 'none'
          }}
        >
          ⚙️ Register New Admin
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => openRegModal('user')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          👤 Register Citizen User
        </button>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{
            maxWidth: '460px', width: '100%', padding: 'var(--space-2xl)',
            borderRadius: 'var(--radius-lg)', position: 'relative',
            borderTop: regType === 'admin' ? '4px solid #b91c1c' : regType === 'police' ? '4px solid var(--primary-700)' : '4px solid #16a34a'
          }}>
            <button
              onClick={() => setShowRegModal(false)}
              style={{
                position: 'absolute', top: '12px', right: '16px',
                background: 'none', border: 'none', fontSize: '1.5rem',
                cursor: 'pointer', color: 'var(--text-tertiary)'
              }}
            >×</button>

            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '4px', color: 'var(--primary-800)' }}>
              {regType === 'admin' ? '⚙️ Register New Admin' : regType === 'police' ? '🛡️ Register Police Officer' : '👤 Register Citizen User'}
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)' }}>
              {regType === 'admin'
                ? 'Create a new system administrator account.'
                : regType === 'police'
                  ? 'Create credentials for an enforcement officer.'
                  : 'Create a new citizen user account.'}
            </p>

            {regError && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fee2e2',
                borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)',
                color: '#b91c1c', fontSize: 'var(--font-xs)',
                marginBottom: 'var(--space-md)', textAlign: 'center'
              }}>{regError}</div>
            )}

            {regSuccess && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)',
                color: '#166534', fontSize: 'var(--font-xs)',
                marginBottom: 'var(--space-md)', textAlign: 'center'
              }}>✅ {regSuccess}</div>
            )}

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={regType === 'admin' ? 'Administrator Name' : 'Officer Full Name'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder={regType === 'admin' ? 'admin@example.com' : 'officer@example.com'}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  The user can change this password after their first login.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={regLoading}
                >
                  {regLoading ? 'Creating Account...' : `Register ${regType === 'admin' ? 'Admin' : 'Officer'}`}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRegModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <h3 className="empty-state-title">No users found</h3>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Reports</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          <div style={{
                            width: 36, height: 36,
                            borderRadius: 'var(--radius-full)',
                            background: user.role === 'admin'
                              ? 'linear-gradient(135deg, #b91c1c, #ef4444)'
                              : user.role === 'police'
                                ? 'linear-gradient(135deg, #1e40af, #3b82f6)'
                                : 'linear-gradient(135deg, var(--primary-400), var(--accent-400))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 600, fontSize: 'var(--font-sm)',
                            flexShrink: 0
                          }}>
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span style={{ fontWeight: 500 }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(user.role)}`} style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700 }}>
                          {user.role === 'admin' ? '🔴 ADMIN' : user.role === 'police' ? '🔵 POLICE' : '🟢 CITIZEN'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: user.reportCount > 0 ? 'var(--primary-500)' : 'var(--text-tertiary)'
                        }}>
                          {user.reportCount}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isBanned ? 'badge-rejected' : 'badge-approved'}`} style={{ fontSize: '10px' }}>
                          {user.isBanned ? '🚫 BANNED' : '✅ ACTIVE'}
                        </span>
                      </td>
                      <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => handleToggleBan(user._id)}
                            className="btn btn-sm" 
                            style={{ 
                              padding: '4px 8px', 
                              fontSize: '11px',
                              background: user.isBanned ? 'var(--primary-500)' : 'rgba(239, 68, 68, 0.1)',
                              color: user.isBanned ? 'white' : '#ef4444',
                              border: user.isBanned ? 'none' : '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                          >
                            {user.isBanned ? '🔓 Unban' : '🚫 Ban'}
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="btn btn-sm" 
                            style={{ 
                              padding: '4px 8px', 
                              fontSize: '11px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} className={`pagination-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
