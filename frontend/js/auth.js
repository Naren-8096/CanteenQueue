const saveAuth = (token, user) => {
  localStorage.setItem('cq_token', token);
  localStorage.setItem('cq_user', JSON.stringify(user));
};

// Check for OAuth token and user in URL query params on page load
const checkUrlAuth = () => {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  const urlUser = params.get('user');
  if (urlToken) {
    localStorage.setItem('cq_token', urlToken);
    if (urlUser) {
      try {
        localStorage.setItem('cq_user', decodeURIComponent(urlUser));
      } catch (e) {
        console.error('Failed to parse user from URL', e);
      }
    }
    // Clean query parameters from address bar without reloading
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
};
checkUrlAuth();

const logout = () => {
  localStorage.removeItem('cq_token');
  localStorage.removeItem('cq_user');
  window.location.href = '/login.html';
};

const requireAuth = (role) => {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) { window.location.href = '/login.html'; return null; }
  
  if (role === 'admin' && user.role !== 'admin' && user.role !== 'staff') {
    window.location.href = '/customer-dashboard.html';
    return null;
  }
  
  if (role === 'customer' && (user.role === 'admin' || user.role === 'staff')) {
    window.location.href = '/admin-dashboard.html';
    return null;
  }
  
  return user;
};

const redirectIfLoggedIn = () => {
  const token = getToken();
  const user  = getUser();
  if (token && user) {
    window.location.href = (user.role === 'admin' || user.role === 'staff')
      ? '/admin-dashboard.html'
      : '/customer-dashboard.html';
  }
};

window.saveAuth = saveAuth;
window.logout   = logout;
window.requireAuth = requireAuth;
window.redirectIfLoggedIn = redirectIfLoggedIn;
