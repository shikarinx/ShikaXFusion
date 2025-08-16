const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const showLoginLink = document.getElementById('show-login');
const showSignupLink = document.getElementById('show-signup');
showLoginLink.addEventListener('click', () => { signupContainer.style.display = 'none'; loginContainer.style.display = 'block'; });
showSignupLink.addEventListener('click', () => { loginContainer.style.display = 'none'; signupContainer.style.display = 'block'; });
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
                document.body.innerHTML = `<div style="text-align: center; padding-top: 50px; color: white;"><h1>Login Successful!</h1><p>Welcome to ShikaXFusion!</p></div>`;
            } else {
                loginError.textContent = "Please verify your email before logging in.";
            }
        })
        .catch(error => { loginError.textContent = error.message; });
});