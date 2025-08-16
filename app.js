// FINAL VERSION - NO EMAIL VERIFICATION

// IMPORTANT: Your secret keys are here.
const firebaseConfig = {
  apiKey: "AIzaSyCzFHkD5bAIjZkP1W7jj4P-FoBldmeTCpk",
  authDomain: "shikaxfusion.firebaseapp.com",
  projectId: "shikaxfusion",
  storageBucket: "shikaxfusion.firebasestorage.app",
  messagingSenderId: "353890157797",
  appId: "1:353890157797:web:54607ce7378b97fc4d000c",
  measurementId: "G-6QYYNVG9NB"
};

// --- This part of the code makes the app function ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Get elements from the HTML
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');

// Smooth transition between forms
showLoginLink.addEventListener('click', () => {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

showSignupLink.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

// Sign Up Logic --- MODIFIED ---
const signupButton = document.getElementById('signup-button');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupError = document.getElementById('signup-error');

signupButton.addEventListener('click', () => {
    const email = signupEmail.value;
    const password = signupPassword.value;
    if (!email || !password) { signupError.textContent = "Please enter both email and password."; return; }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // CHANGE: No more verification email. Log them in directly.
            document.body.innerHTML = `<div class="container" style="animation: fadeIn 0.6s ease-out forwards;"><h1 class="header-font">Welcome!</h1><p style="font-size: 1.2em;">Your account has been created.</p></div>`;
        })
        .catch(error => { 
            // This handles the "email already in use" error you saw
            signupError.textContent = error.message; 
        });
});

// Login Logic --- MODIFIED ---
const loginButton = document.getElementById('login-button');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    if (!email || !password) { loginError.textContent = "Please enter both email and password."; return; }

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // CHANGE: The verification check is REMOVED. It will always log in.
            document.body.innerHTML = `<div class="container" style="animation: fadeIn 0.6s ease-out forwards;"><h1 class="header-font">Welcome Back!</h1><p style="font-size: 1.2em;">You are now logged in.</p></div>`;
        })
        .catch(error => { 
            loginError.textContent = error.message; 
        });
});