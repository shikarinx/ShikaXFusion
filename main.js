// main.js - FINAL CORRECTED VERSION for LAYOUT
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

// --- SECURITY GUARD ---
auth.onAuthStateChanged(user => {
    if (user) {
        renderMainApp(user);
    } else {
        window.location.href = 'index.html';
    }
});

function renderMainApp(user) {
    const appContainer = document.getElementById('app-container');
    // This HTML structure matches the new CSS layout
    appContainer.innerHTML = `
        <header class="app-header-fixed">
            <div class="app-header">
                <div class="user-info">
                    <img id="user-avatar-header" src="icon-512x512.png" alt="Avatar">
                    <div class="user-text">
                        <span>Hello, Welcome!</span>
                        <span id="user-name-header">${user.email.split('@')[0]}</span>
                    </div>
                </div>
                <div id="balance-display" class="balance-chip">₹ 0</div>
            </div>
            <div class="play-earn-card">
                <h2>PLAY AND EARN</h2>
                <p>Discover Games & Apps</p>
                <i class="fas fa-arrow-right"></i>
            </div>
        </header>
        
        <main class="app-content-scrollable">
            <div class="offers-header">
                <h3>All Offers</h3>
                <a id="history-link">History ></a>
            </div>
            <div id="offers-list"></div>
        </main>
        
        <nav class="bottom-nav">
            <button class="nav-button active"><i class="fas fa-home"></i><span>Home</span></button>
            <button class="nav-button"><i class="fas fa-list-check"></i><span>Task</span></button>
            <button class="nav-button"><i class="fas fa-wallet"></i><span>Withdraw</span></button>
            <button class="nav-button"><i class="fas fa-user"></i><span>Profile</span></button>
        </nav>
    `;
    
    // --- Render offers and add functionality ---
    const offersList = document.getElementById('offers-list');
    const tasksData = [
        { id: 1, title: "ICICI MF", description: "ICICI Prudential AMC...", reward: 8 },
        { id: 2, title: "Story TV", description: "Welcome to Story TV...", reward: 6 },
        { id: 3, title: "Unstop", description: "A platform that connects...", reward: 4 },
        { id: 4, title: "Mega Ramp", description: "Challenge your friends...", reward: 6.8 },
        { id: 5, title: "Bus Rush", description: "Bus Rush - Park & Match...", reward: 11.4 },
        { id: 6, title: "Fruit Puzzle", description: "A fun and addictive puzzle game...", reward: 5 },
        { id: 7, title: "Survey Pro", description: "Earn rewards by sharing your opinion...", reward: 10 },
        { id: 8, title: "Ad Watcher", description: "Watch short ads to earn points...", reward: 2.5 }
    ];

    tasksData.forEach(task => {
        const offerCard = document.createElement('div');
        offerCard.className = 'offer-card';
        offerCard.innerHTML = `
            <img src="icon-512x512.png" alt="${task.title}">
            <div class="offer-info"><h4>${task.title}</h4><p>${task.description}</p></div>
            <div class="offer-reward">₹${task.reward}</div>`;
        offerCard.addEventListener('click', () => { alert(`Clicked on ${task.title}`); });
        offersList.appendChild(offerCard);
    });
}