const API_BASE = '/api';

const getToken = () => localStorage.getItem('cq_token');
const getUser  = () => JSON.parse(localStorage.getItem('cq_user') || 'null');

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
};

const api = {
  get:    (path)        => apiFetch(path, { method: 'GET' }),
  post:   (path, body)  => apiFetch(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)  => apiFetch(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)        => apiFetch(path, { method: 'DELETE' }),
};

// Toast notifications
const toast = (message, type = 'info') => {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 300); }, 3500);
};

// Loading overlay
const showLoading = () => { const l = document.getElementById('loading-overlay'); if (l) l.classList.remove('hidden'); };
const hideLoading = () => { const l = document.getElementById('loading-overlay'); if (l) l.classList.add('hidden'); };

window.api = api;
window.getToken = getToken;
window.getUser = getUser;
window.toast = toast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
