const containerLo = document.getElementById('containerLogin');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Show registration form
registerBtn.addEventListener('click', () => {
    containerLo.classList.add("active");
});

// Show login form
loginBtn.addEventListener('click', () => {
    containerLo.classList.remove("active");
});
