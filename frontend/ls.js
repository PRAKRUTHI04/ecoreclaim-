const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
if (loginForm) loginForm.reset();
if (signupForm) signupForm.reset();

loginBtn.addEventListener('click', () => {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  loginBtn.classList.add('active');
  signupBtn.classList.remove('active');
});

signupBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  signupBtn.classList.add('active');
  loginBtn.classList.remove('active');
});

