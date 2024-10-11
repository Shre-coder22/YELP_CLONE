const containerLo = document.getElementById('containerLogin');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    containerLo.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    containerLo.classList.remove("active");
});