// Helpers to show/hide by ID
function show(id){ document.getElementById(id).style.display = 'block'; }
function hide(id){ document.getElementById(id).style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegBtn   = document.getElementById('showRegister');
  const showLoginBtn = document.getElementById('showLogin');
  const forgotLink   = document.getElementById('forgotLink');
  const goHomeBtn    = document.getElementById('goHomeBtn');
  const logoutBtn    = document.getElementById('logoutBtn');

  // Switch to Register
  showRegBtn.addEventListener('click', e => {
    e.preventDefault();
    hide('loginSection');
    show('registerSection');
  });

  // Switch to Login
  showLoginBtn.addEventListener('click', e => {
    e.preventDefault();
    hide('registerSection');
    show('loginSection');
  });

  // REGISTER
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const u  = document.getElementById('regUsername').value.trim();
    const em = document.getElementById('regEmail').value.trim();
    const p  = document.getElementById('regPassword').value;
    const c  = document.getElementById('regConfirm').value;

    if (!u || !em || !p || !c) {
      alert('All fields are required.'); return;
    }
    if (p !== c) {
      alert('Passwords do not match.'); return;
    }

    let users = JSON.parse(localStorage.getItem('users')|| '{}');
    if (users[u]) {
      alert('Username already taken.'); return;
    }
    users[u] = { password: p, email: em };
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registered! Please login.');
    registerForm.reset();
    hide('registerSection');
    show('loginSection');
  });

  // LOGIN
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value;
    let users = JSON.parse(localStorage.getItem('users')|| '{}');

    if (!users[u] || users[u].password !== p) {
      alert('Invalid username or password.');
      return;
    }

    // Remember me?
    if (document.getElementById('rememberMe').checked) {
      localStorage.setItem('loggedInUser', u);
      sessionStorage.removeItem('loggedInUser');
    } else {
      sessionStorage.setItem('loggedInUser', u);
      localStorage.removeItem('loggedInUser');
    }

    showWelcome(u);
  });

  // FORGOT PASSWORD
  forgotLink.addEventListener('click', e => {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value.trim();
    let users = JSON.parse(localStorage.getItem('users')|| '{}');
    if (!users[u]) {
      alert('User not found.');
      return;
    }
    alert('Password hint: ' + users[u].password.slice(0, 2) + '****');
  });

  // LOGOUT
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
    hide('welcomeSection');
    show('loginSection');
  });

  // GO HOME
  goHomeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Display welcome
  function showWelcome(u) {
    document.getElementById('userDisplay').textContent = u;
    hide('loginSection');
    hide('registerSection');
    show('welcomeSection');
  }

  // Auto-login if remembered
  const stored = sessionStorage.getItem('loggedInUser') || localStorage.getItem('loggedInUser');
  if (stored) {
    showWelcome(stored);
  }
});