// FINAL WORKING APP.JS (with Task button)
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
const db = firebase.firestore();

// --- We will listen for the user's login status ---
auth.onAuthStateChanged(user => {
    if (user) {
        // If the user is logged in, show the main app
        showMainApp(user);
    } else {
        // If the user is logged out, show the login page
        showLoginPage();
    }
});

function showLoginPage() {
    document.body.className = 'login-background';
    document.body.innerHTML = `
        <div class="login-container">
            <div class="logo-header"><h1 class="header-font">ShikaXFusion</h1></div>
            <div id="signup-container" class="form-container">
                <h2>Create Your Account</h2>
                <input type="email" id="signup-email" placeholder="Enter your email" class="input-field">
                <input type="password" id="signup-password" placeholder="Create a password" class="input-field">
                <button id="signup-button" class="action-button">Sign Up</button>
                <p id="signup-error" class="error-message"></p>
                <p class="switch-form-text">Already have an account? <a href="#" id="show-login">Log In</a></p>
            </div>
            <div id="login-container" class="form-container" style="display: none;">
                <h2>Welcome Back!</h2>
                <input type="email" id="login-email" placeholder="Enter your email" class="input-field">
                <input type="password" id="login-password" placeholder="Enter your password" class="input-field">
                <button id="login-button" class="action-button">Log In</button>
                <p id="login-error" class="error-message"></p>
                <p class="switch-form-text">Don't have an account? <a href="#" id="show-signup">Sign Up</a></p>
            </div>
        </div>
    `;
    attachLoginListeners();
}

function showMainApp(user) {
    document.body.className = 'app-background';
    document.body.innerHTML = `
        <div id="app-container">
            <div id="home-page" class="page">
                <header class="app-header">
                    <div class="user-info">
                        <img id="user-avatar-header" src="icon-512x512.png" alt="Avatar">
                        <div class="user-text">
                            <span>Hello, Welcome!</span>
                            <span id="user-name-header"></span>
                        </div>
                    </div>
                    <div id="balance-display" class="balance-chip">₹ 0</div>
                </header>
                <main class="page-content">
                    <div class="play-earn-card">
                        <h2>PLAY AND EARN</h2>
                        <p>Discover Games & Apps</p>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="offers-header">
                        <h3>All Offers</h3>
                        <a href="#">History ></a>
                    </div>
                    <div id="offers-list" class="offers-list-container"></div>
                </main>
            </div>
            <nav class="bottom-nav">
                <button class="nav-button active"><i class="fas fa-home"></i><span>Home</span></button>
                <!-- CHANGE: "Share" is now "Task" with a new icon -->
                <button class="nav-button"><i class="fas fa-list-check"></i><span>Task</span></button>
                <button class="nav-button"><i class="fas fa-wallet"></i><span>Withdraw</span></button>
                <button class="nav-button"><i class="fas fa-user"></i><span>Profile</span></button>
            </nav>
        </div>
    `;
    renderMainAppData(user);
}

function renderMainAppData(user) {
    const userNameHeader = document.getElementById('user-name-header');
    const offersListContainer = document.getElementById('offers-list');
    
    userNameHeader.textContent = user.email.split('@')[0];
    
    const tasksData = [
        { title: "ICICI MF", description: "ICICI Prudential AMC...", reward: 8 },
        { title: "Story TV", description: "Welcome to Story TV...", reward: 6 },
        { title: "Unstop", description: "A platform that connects...", reward: 4 },
        { title: "Mega Ramp", description: "Challenge your friends...", reward: 6.8 },
        { title: "Bus Rush", description: "Bus Rush - Park & Match...", reward: 11.4 }
    ];

    offersListContainer.innerHTML = '';
    tasksData.forEach(task => {
        const offerCard = `
            <div class="offer-card">
                <img src="icon-512x512.png" alt="${task.title}">
                <div class="offer-info">
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                </div>
                <div class="offer-reward">₹${task.reward}</div>
            </div>`;
        offersListContainer.innerHTML += offerCard;
    });
}

function attachLoginListeners() {
    const showLoginLink = document.getElementById('show-login');
    const showSignupLink = document.getElementById('show-signup');
    showLoginLink.addEventListener('click', () => {
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    });
    showSignupLink.addEventListener('click', () => {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'block';
    });

    const signupButton = document.getElementById('signup-button');
    signupButton.addEventListener('click', () => {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        auth.createUserWithEmailAndPassword(email, password).catch(err => {
            document.getElementById('signup-error').textContent = err.message;
        });
    });

    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        auth.signInWithEmailAndPassword(email, password).catch(err => {
            document.getElementById('login-error').textContent = err.message;
        });
    });
}