// login.js - CONTROLS THE INDEX.HTML PAGE
const firebaseConfig = {
  apiKey: "AIzaSyCzFHkD5bAIjZkP1W7jj4P-FoBldmeTCpk",
  authDomain: "shikaxfusion.firebaseapp.com",
  projectId: "shikaxfusion",
  storageBucket: "shikaxfusion.firebasestorage.app",
  messagingSenderId: "353890157797",
  appId: "1:353890157797:web:54607ce7378b97fc4d000c",
  measurementId: "G-6QYYNVG9NB"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Redirect if user is already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        window.location.href = 'home.html';
    }
});

// --- Login/Signup Form Logic ---
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');

showLoginLink.addEventListener('click', () => {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});
showSignupLink.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

// Signup Button
const signupButton = document.getElementById('signup-button');
signupButton.addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .catch(err => {
            document.getElementById('signup-error').textContent = err.message;
        });
});

// Login Button
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            document.getElementById('login-error').textContent = err.message;
        });
});