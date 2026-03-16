const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('sphn_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const getAuthHeader = () => {
  const token = localStorage.getItem('sphn_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---- Auth ----
export const authAPI = {
  login: (email, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),

  register: (name, email, password) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(r => r.json()),

  googleLogin: (token) =>
    fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }).then(r => r.json()),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(r => r.json())
};

// ---- Reports ----
export const reportsAPI = {
  create: (formData) =>
    fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    }).then(r => r.json()),

  getMyReports: (page = 1, limit = 10) =>
    fetch(`${API_BASE}/reports/my?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    }).then(r => r.json()),

  getReport: (id) =>
    fetch(`${API_BASE}/reports/${id}`, {
      headers: getHeaders()
    }).then(r => r.json())
};

// ---- Admin ----
export const adminAPI = {
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/admin/reports?${query}`, {
      headers: getHeaders()
    }).then(r => r.json());
  },

  updateReport: (id, data) =>
    fetch(`${API_BASE}/admin/reports/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteReport: (id) =>
    fetch(`${API_BASE}/admin/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(r => r.json()),

  getUsers: (page = 1) =>
    fetch(`${API_BASE}/admin/users?page=${page}`, {
      headers: getHeaders()
    }).then(r => r.json())
};

// ---- Analytics ----
export const analyticsAPI = {
  getSummary: () =>
    fetch(`${API_BASE}/analytics/summary`, {
      headers: getHeaders()
    }).then(r => r.json()),

  getHeatmap: () =>
    fetch(`${API_BASE}/analytics/heatmap`, {
      headers: getHeaders()
    }).then(r => r.json()),

  getAreas: () =>
    fetch(`${API_BASE}/analytics/areas`, {
      headers: getHeaders()
    }).then(r => r.json())
};
