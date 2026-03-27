const saveAuth = (token, user) => {
  localStorage.setItem('cq_token', token);
  localStorage.setItem('cq_user', JSON.stringify(user));
};

const logout = () => {
  localStorage.removeItem('cq_token');
  localStorage.removeItem('cq_user');
  window.location.href = '/login.html';
};

const requireAuth = (role) => {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) { window.location.href = '/login.html'; return null; }
  if (role && user.role !== role) {
    window.location.href = user.role === 'staff' ? '/staff-dashboard.html' : '/student-dashboard.html';
    return null;
  }
  return user;
};

const redirectIfLoggedIn = () => {
  const token = getToken();
  const user  = getUser();
  if (token && user) {
    window.location.href = user.role === 'staff' ? '/staff-dashboard.html' : '/student-dashboard.html';
  }
};

window.saveAuth = saveAuth;
window.logout   = logout;
window.requireAuth = requireAuth;
window.redirectIfLoggedIn = redirectIfLoggedIn;
