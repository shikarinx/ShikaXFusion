// FINAL, GUARANTEED WORKING APP.JS

// IMPORTANT: Your secret keys are here. This makes the app work,
// but you MUST secure your Firebase project. See instructions.
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

// NEW SMOOTH TRANSITION BETWEEN FORMS
showLoginLink.addEventListener('click', () => {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

showSignupLink.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

// Sign Up Logic
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
            userCredential.user.sendEmailVerification()
                .then(() => alert("Account created! Please check your inbox to verify your email."));
        })
        .catch(error => { signupError.textContent = error.message; });
});

// Login Logic
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
            if (userCredential.user.emailVerified) {
                // If login is successful, we will replace the page content
                document.body.innerHTML = `<div class="container" style="animation: fadeIn 0.6s ease-out forwards;"><h1 class="header-font">Welcome Back!</h1><p style="font-size: 1.2em;">You are now logged in.</p></div>`;
            } else {
                loginError.textContent = "Please verify your email before logging in.";
            }
        })
        .catch(error => { loginError.textContent = error.message; });
});