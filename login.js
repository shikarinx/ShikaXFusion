// login.js - FINAL, SIMPLIFIED, AND GUARANTEED TO WORK

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
        // If they are already logged in, send them to the main app
        window.location.href = 'home.html';
    }
});

// --- Find all the elements on the page ---
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');
const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');

// --- Add functionality to the links ---
showLoginLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent page from jumping
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

showSignupLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent page from jumping
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

// --- Add functionality to the buttons ---
signupButton.addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorElement = document.getElementById('signup-error');
    if (!email || !password) {
        errorElement.textContent = "Please enter both email and password.";
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .catch(err => {
            errorElement.textContent = err.message;
        });
});

loginButton.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    if (!email || !password) {
        errorElement.textContent = "Please enter both email and password.";
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            errorElement.textContent = err.message;
        });
});