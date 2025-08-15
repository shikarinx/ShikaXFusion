// This is the correct way to initialize Firebase for our project.
// It uses the "compat" version that matches the scripts in index.html.

const firebaseConfig = {
  apiKey: "AIzaSyCzFHkD5bAIjZkP1W7jj4P-FoBldmeTCpk",
  authDomain: "shikaxfusion.firebaseapp.com",
  projectId: "shikaxfusion",
  storageBucket: "shikaxfusion.firebasestorage.app", // Corrected this for you
  messagingSenderId: "353890157797",
  appId: "1:353890157797:web:54607ce7378b97fc4d000c",
  measurementId: "G-6QYYNVG9NB"
};

// Initialize Firebase using the compat libraries
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Get elements from the HTML ---
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');

// --- Switch between Login and Sign Up forms ---
showLoginLink.addEventListener('click', () => {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

showSignupLink.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

// --- Sign Up Logic ---
const signupButton = document.getElementById('signup-button');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupError = document.getElementById('signup-error');

signupButton.addEventListener('click', () => {
    const email = signupEmail.value;
    const password = signupPassword.value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Send verification email
            userCredential.user.sendEmailVerification()
                .then(() => {
                    alert("Account created! Please check your inbox to verify your email.");
                });
        })
        .catch((error) => {
            signupError.textContent = error.message;
        });
});

// --- Login Logic ---
const loginButton = document.getElementById('login-button');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                // User is verified!
                // For now, we'll just show an alert. Later this will redirect to the home screen.
                alert("Login Successful! Welcome!");
                // window.location.href = 'home.html'; 
            } else {
                loginError.textContent = "Please verify your email before logging in.";
            }
        })
        .catch((error) => {
            loginError.textContent = error.message;
        });
});