document.addEventListener('DOMContentLoaded', () => {
    // --- DEMO DATA (We will replace this with Firebase data later) ---
    const userData = {
        name: "Ram Mandal",
        email: "shikarin.x@gmail.com",
        balance: 3,
        avatarUrl: "https://i.ibb.co/6P8K817/shikarin-logo-black.png" // Replace with a real URL to your logo
    };

    const tasksData = [
        { id: 1, iconUrl: "https://i.ibb.co/YjV0Q5d/icici.png", title: "ICICI MF", description: "ICICI Prudential AMC is a leading asset...", reward: 8, type: 'direct' },
        { id: 2, iconUrl: "https://i.ibb.co/Qk4c94Y/storytv.png", title: "Story TV", description: "Welcome to Story TV - India's...", reward: 6, type: 'count' },
        { id: 3, iconUrl: "https://i.ibb.co/Y2B7VjM/unstop.png", title: "Unstop", description: "Unstop is a platform that connects students...", reward: 4, type: 'direct' },
        { id: 4, iconUrl: "https://i.ibb.co/zP7wY2w/megaramp.png", title: "Mega Ramp", description: "Challenge your friends in a crazy car stunt...", reward: 6.8, type: 'count' },
        { id: 5, iconUrl: "https://i.ibb.co/3k90VdG/busrush.png", title: "Bus Rush", description: "Bus Rush - Park & Match Quest is a fresh...", reward: 11.4, type: 'direct' }
    ];

    // --- ELEMENT REFERENCES ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    const backButtons = document.querySelectorAll('.back-button');

    // Page specific elements
    const balanceDisplay = document.getElementById('balance-display');
    const userNameHeader = document.getElementById('user-name-header');
    const userAvatarHeader = document.getElementById('user-avatar-header');
    const offersListContainer = document.getElementById('offers-list');
    const withdrawBalance = document.getElementById('withdraw-balance');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const logoutButton = document.getElementById('logout-button');

    // Modal elements
    const withdrawModal = document.getElementById('withdraw-modal');
    const showWithdrawModalButton = document.getElementById('show-withdraw-modal-button');
    const closeModalButton = document.getElementById('close-modal-button');

    // --- FUNCTIONS ---

    // Function to show a specific page and hide others
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    }
    
    // Function to update the active state of nav buttons
    function updateNav(activeButtonId) {
         navButtons.forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(activeButtonId).classList.add('active');
    }

    // Function to render the home page with data
    function renderHomePage() {
        balanceDisplay.textContent = `₹${userData.balance}`;
        userNameHeader.textContent = `Hello, Welcome!`;
        userAvatarHeader.src = userData.avatarUrl;
        
        offersListContainer.innerHTML = ''; // Clear existing offers
        tasksData.forEach(task => {
            const offerCard = `
                <div class="offer-card">
                    <img src="${task.iconUrl}" alt="${task.title}">
                    <div class="offer-info">
                        <h4>${task.title}</h4>
                        <p>${task.description}</p>
                    </div>
                    <div class="offer-reward">
                        ₹${task.reward}
                    </div>
                </div>`;
            offersListContainer.innerHTML += offerCard;
        });
    }

    // Function to render the withdraw page
    function renderWithdrawPage() {
        withdrawBalance.textContent = `₹${userData.balance}`;
    }

    // Function to render the profile page
    function renderProfilePage() {
        profileAvatar.src = userData.avatarUrl;
        profileName.textContent = userData.name;
        profileEmail.textContent = userData.email;
    }

    // --- EVENT LISTENERS ---

    // Navigation bar functionality
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.id.replace('nav-', '') + '-page';
            showPage(pageId);
            updateNav(button.id);

            // Render page content when switching
            if (pageId === 'home-page') renderHomePage();
            if (pageId === 'withdraw-page') renderWithdrawPage();
            if (pageId === 'profile-page') renderProfilePage();
        });
    });

    // Back button functionality (goes back to home)
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showPage('home-page');
            updateNav('nav-home');
        });
    });

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        // For now, we just reload to go back to the login screen
        window.location.reload();
    });

    // Modal functionality
    showWithdrawModalButton.addEventListener('click', () => {
        withdrawModal.classList.remove('hidden');
    });
    closeModalButton.addEventListener('click', () => {
        withdrawModal.classList.add('hidden');
    });
    withdrawModal.addEventListener('click', (event) => {
        if (event.target === withdrawModal) {
            withdrawModal.classList.add('hidden');
        }
    });

    // --- INITIAL APP LOAD ---
    renderHomePage();
});