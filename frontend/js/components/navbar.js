import api from '../api.js';

const renderNavbar = async () => {
  const container = document.getElementById('global-navbar');
  if (!container) return;

  const token = localStorage.getItem('token');
  let user = null;
  let isLoggedIn = false;

  if (token) {
    try {
      user = await api.get('/auth/me');
      if (user && user._id) {
        isLoggedIn = true;
      } else {
        // Token invalid, clear it
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Navbar auth check failed:', err);
      localStorage.removeItem('token');
    }
  }

  const currentPath = window.location.pathname;

  let navLinksHTML = '';

  if (isLoggedIn && user) {
    if (user.role === 'admin') {
      navLinksHTML = `
        <li class="nav-item">
          <a class="nav-link nav-link-custom ${currentPath.includes('/admin/dashboard.html') ? 'active' : ''}" href="/pages/admin/dashboard.html">
            <i class="bi bi-speedometer2"></i> Admin Panel
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-custom ${currentPath.includes('/admin/review-apps.html') ? 'active' : ''}" href="/pages/admin/review-apps.html">
            <i class="bi bi-file-earmark-person"></i> Review Applications
          </a>
        </li>
      `;
    } else {
      // Student Links
      navLinksHTML = `
        <li class="nav-item">
          <a class="nav-link nav-link-custom ${currentPath.includes('/dashboard.html') ? 'active' : ''}" href="/pages/dashboard.html">
            <i class="bi bi-grid-1x2"></i> Dashboard
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-custom ${currentPath.includes('/browse.html') ? 'active' : ''}" href="/pages/browse.html">
            <i class="bi bi-search"></i> Browse Opportunities
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-custom ${currentPath.includes('/profile.html') ? 'active' : ''}" href="/pages/profile.html">
            <i class="bi bi-person-badge"></i> My Profile
          </a>
        </li>
      `;
    }
  } else {
    // Guest Links
    navLinksHTML = `
      <li class="nav-item">
        <a class="nav-link nav-link-custom ${currentPath.includes('/browse.html') ? 'active' : ''}" href="/pages/browse.html">
          <i class="bi bi-search"></i> Browse
        </a>
      </li>
    `;
  }

  const authSectionHTML = isLoggedIn && user
    ? `
      <div class="d-flex align-items-center gap-3">
        <span class="text-light d-none d-md-inline-block">
          <i class="bi bi-person-circle text-primary"></i> ${user.name} 
          <span class="badge bg-secondary text-capitalize fs-10" style="font-size: 10px;">${user.role}</span>
        </span>
        <button id="nav-logout-btn" class="btn-custom btn-custom-outline py-2 px-3">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    `
    : `
      <div class="d-flex align-items-center gap-2">
        <a href="/pages/login.html" class="btn-custom btn-custom-outline py-2 px-3">Log In</a>
        <a href="/pages/register.html" class="btn-custom btn-custom-primary py-2 px-3">Sign Up</a>
      </div>
    `;

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom py-3">
      <div class="container">
        <a class="navbar-brand navbar-brand-custom d-flex align-items-center gap-2" href="/index.html">
          <i class="bi bi-mortarboard-fill text-primary glow-text-primary"></i> InternLink
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1 mt-3 mt-lg-0">
            <li class="nav-item">
              <a class="nav-link nav-link-custom ${currentPath === '/' || currentPath === '/index.html' ? 'active' : ''}" href="/index.html">
                <i class="bi bi-house"></i> Home
              </a>
            </li>
            ${navLinksHTML}
          </ul>
          <hr class="d-lg-none text-muted my-3">
          ${authSectionHTML}
        </div>
      </div>
    </nav>
  `;

  // Bind logout button action
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location = '/pages/login.html';
    });
  }
};

// Execute automatically when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderNavbar);
} else {
  renderNavbar();
}

export default renderNavbar;
