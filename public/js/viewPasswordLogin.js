const eyeIcon = document.querySelector('.password-icon')
const passwordInput = document.querySelector('.password-field');
// const confirmPasswordInput = document.querySelector('.confirm-password-field');

function changeInputType() {
    if(passwordInput.type == "password") {
        passwordInput.type = "text";
        eyeIcon.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/44/44326.png')";
    } else {
        passwordInput.type = "password";
        eyeIcon.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/7794/7794218.png')";
    }
}