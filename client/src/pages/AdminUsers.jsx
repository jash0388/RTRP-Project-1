import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Users 👥</h1>
        <p className="page-subtitle">View and manage registered users ({total} total)</p>
      </div>

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
                            background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))',
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
                        <span className={`badge ${user.role === 'admin' ? 'badge-approved' : 'badge-pending'}`}>
                          {user.role}
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
