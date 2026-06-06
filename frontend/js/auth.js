const authTokenKey = 'internlink_token';
const authUserKey = 'internlink_user';

function getToken() {
  return localStorage.getItem(authTokenKey);
}

function getUser() {
  const raw = localStorage.getItem(authUserKey);
  return raw ? JSON.parse(raw) : null;
}

function setAuth(token, user) {
  localStorage.setItem(authTokenKey, token);
  localStorage.setItem(authUserKey, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(authTokenKey);
  localStorage.removeItem(authUserKey);
}

function redirectToLogin() {
  const redirect = encodeURIComponent(window.location.pathname);
  window.location.href = `/pages/login.html?redirect=${redirect}`;
}

function initNavbar() {
  const navActions = document.querySelectorAll('#nav-actions');
  const loggedIn = Boolean(getToken());
  navActions.forEach((container) => {
    if (!container) return;
    container.innerHTML = '';
    if (loggedIn) {
      const logout = document.createElement('button');
      logout.textContent = 'Logout';
      logout.className = 'rounded-full bg-slate-800 px-5 py-2 text-sm text-slate-100 hover:bg-slate-700';
      logout.addEventListener('click', () => {
        clearAuth();
        window.location.href = '/';
      });
      container.appendChild(logout);
    } else {
      const login = document.createElement('a');
      login.href = '/pages/login.html';
      login.textContent = 'Login';
      login.className = 'rounded-full border border-slate-700 bg-slate-900 px-5 py-2 text-sm text-slate-100 hover:border-slate-500';
      const register = document.createElement('a');
      register.href = '/pages/register.html';
      register.textContent = 'Register';
      register.className = 'rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400';
      container.appendChild(login);
      container.appendChild(register);
    }
  });

  document.querySelectorAll('#about-link').forEach((button) => {
    button?.addEventListener('click', (event) => {
      event.preventDefault();
      alert('Coming Soon');
    });
  });
}

function requireAuth() {
  if (!getToken()) {
    redirectToLogin();
  }
}

function handleLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        return errorEl.textContent = data.error || 'Login failed.';
      }
      setAuth(data.token, data.user);
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || '/pages/opportunities.html';
      window.location.href = redirect;
    } catch (error) {
      errorEl.textContent = 'Unable to reach server.';
    }
  });
  const adminLink = document.getElementById('admin-login');
  adminLink?.addEventListener('click', () => window.location.href = '/pages/admin-login.html');
}

function handleRegisterForm() {
  const continueButton = document.getElementById('continue-step');
  const backButton = document.getElementById('back-step');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const form = document.getElementById('register-form');
  const errorEl = document.getElementById('register-error');
  if (!form) return;

  continueButton?.addEventListener('click', () => {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    errorEl.textContent = '';
    if (!name || !email || !password || !confirmPassword) {
      return errorEl.textContent = 'Please complete every field.';
    }
    if (password !== confirmPassword) {
      return errorEl.textContent = 'Passwords do not match.';
    }
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  });

  backButton?.addEventListener('click', () => {
    errorEl.textContent = '';
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const university = document.getElementById('register-university').value.trim();
    const programOfStudy = document.getElementById('register-program').value;
    const terms = document.getElementById('register-terms').checked;
    errorEl.textContent = '';

    if (!programOfStudy) {
      return errorEl.textContent = 'Please choose your program of study.';
    }
    if (!terms) {
      return errorEl.textContent = 'You must agree to the terms to continue.';
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, university, programOfStudy, terms })
      });
      const data = await response.json();
      if (!response.ok) {
        return errorEl.textContent = data.error || 'Registration failed.';
      }
      setAuth(data.token, data.user);
      window.location.href = '/pages/opportunities.html';
    } catch (error) {
      errorEl.textContent = 'Unable to reach server.';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  handleLoginForm();
  handleRegisterForm();
});
