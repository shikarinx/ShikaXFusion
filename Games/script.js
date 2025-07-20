"use strict";

window.initCrashGame = (user, db) => {
    // --- DOM ELEMENT REFERENCES ---
    const balanceAmountEl = document.getElementById('balance-amount');
    const historyBarEl = document.getElementById('history-bar');
    const gameStateMessageEl = document.getElementById('game-state-message');
    const multiplierDisplayEl = document.getElementById('multiplier-display');
    const betPanels = [document.getElementById('bet-panel-1')]; // Supports multiple bet panels if needed
    const rocketEl = document.getElementById('rocket');
    const explosionEl = document.getElementById('explosion');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    // --- GAME STATE & CONFIGURATION ---
    let balance = 0;
    const userRef = db.collection('users').doc(user.uid);
    let currentMultiplier = 1.00;
    let gameStatus = 'betting'; // States: betting, running, crashed
    let countdown = 5;
    let crashPoint = 1.00;
    let gameLoopInterval;
    const bets = [{ placed: false, amount: 0, cashedOut: false }];

    // --- PARTICLE & ANIMATION LOGIC ---
    let particles = [];
    const resizeCanvas = () => {
        if (!canvas.parentElement) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };
    const createParticles = () => {
        particles = [];
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: `hsl(${220 + Math.random() * 60}, 70%, 60%)`
            });
        }
    };
    const animateParticles = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    };
    const updateRocketPosition = () => {
        if (gameStatus !== 'running') return;
        const progress = Math.min(Math.log(currentMultiplier) / Math.log(crashPoint || 10), 1);
        const x = progress * (canvas.width - rocketEl.width * 0.8);
        const y = canvas.height - (rocketEl.height / 2) - (progress * canvas.height * 0.9);
        rocketEl.style.left = `${x}px`;
        rocketEl.style.top = `${y}px`;
        rocketEl.style.transform = `rotate(${progress * -20}deg)`;
    };

    // --- FIRESTORE & BALANCE LOGIC ---
    const updateBalanceInFirestore = async (amount, description) => {
        try {
            await db.runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists) throw new Error("User document not found.");
                
                const currentBalance = userDoc.data().balance || 0;
                const newBalance = currentBalance + amount;
                if (newBalance < 0) throw new Error("Insufficient funds.");

                const newHistoryEntry = {
                    amount: Math.abs(amount),
                    date: new Date(),
                    description: description,
                    type: amount > 0 ? "credit" : "debit"
                };
                transaction.update(userRef, {
                    balance: newBalance,
                    history: firebase.firestore.FieldValue.arrayUnion(newHistoryEntry)
                });
            });
            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
            return false;
        }
    };

    // --- UI & EVENT HANDLERS ---
    const updateBalanceUI = (newBalance) => {
        balance = newBalance;
        balanceAmountEl.textContent = balance.toFixed(2);
    };
    const updateBetButtonState = (index, state) => {
        const button = betPanels[index].querySelector('.bet-button');
        button.disabled = false;
        button.className = 'bet-button'; // Reset classes
        switch(state) {
            case 'bet':
                button.classList.add('state-bet');
                button.textContent = 'Bet';
                break;
            case 'cancel':
                button.classList.add('state-cancel');
                button.textContent = 'Cancel';
                break;
            case 'cashout':
                button.classList.add('state-cashout');
                button.textContent = `Cashout (₹${(bets[index].amount * currentMultiplier).toFixed(2)})`;
                break;
            case 'cashed_out':
                button.disabled = true;
                button.textContent = `Cashed Out @ ${currentMultiplier.toFixed(2)}x`;
                break;
            case 'disabled':
                button.disabled = true;
                button.textContent = 'Bet';
                break;
        }
    };
    const updateAllBetButtons = (status) => {
        bets.forEach((bet, index) => {
            if (status === 'running') {
                if (bet.placed) updateBetButtonState(index, 'cashout');
                else updateBetButtonState(index, 'disabled');
            } else if (status === 'betting') {
                if(bet.placed) updateBetButtonState(index, 'cancel');
                else updateBetButtonState(index, 'bet');
            }
        });
    };
    const addToHistory = (value) => {
        const newItem = document.createElement('span');
        newItem.textContent = `${value.toFixed(2)}x`;
        newItem.classList.add('history-item');
        if (value < 1.5) newItem.classList.add('low');
        else if (value >= 10) newItem.classList.add('high');
        historyBarEl.prepend(newItem);
        if (historyBarEl.children.length > 20) {
            historyBarEl.removeChild(historyBarEl.lastChild);
        }
    };
    const cashoutBet = (index) => {
        if(bets[index].placed && !bets[index].cashedOut){
            const winnings = bets[index].amount * currentMultiplier;
            updateBalanceInFirestore(winnings, `Crash Game win @ ${currentMultiplier.toFixed(2)}x`).then(success => {
                if (success) {
                    bets[index].cashedOut = true;
                    updateBetButtonState(index, 'cashed_out');
                }
            });
        }
    };
    const checkAutoCashouts = () => {
        betPanels.forEach((panel, index) => {
            if (bets[index].placed && !bets[index].cashedOut) {
                const autoCashoutInput = panel.querySelector('.auto-cashout-input');
                const autoCashoutValue = parseFloat(autoCashoutInput.value);
                if (!isNaN(autoCashoutValue) && currentMultiplier >= autoCashoutValue) {
                    cashoutBet(index);
                }
            }
        });
    };
    const handleBetButtonClick = (index, amount) => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) return;

        if (gameStatus === 'betting') {
            if (!bets[index].placed) {
                if (balance >= parsedAmount) {
                    updateBalanceInFirestore(-parsedAmount, `Bet placed in Crash Game`).then(success => {
                        if (success) {
                            bets[index].placed = true;
                            bets[index].amount = parsedAmount;
                            updateBetButtonState(index, 'cancel');
                        }
                    });
                } else {
                    alert("Insufficient balance!");
                }
            } else { // Cancel bet
                updateBalanceInFirestore(bets[index].amount, `Bet cancelled in Crash Game`).then(success => {
                    if (success) {
                        bets[index].placed = false;
                        bets[index].amount = 0;
                        updateBetButtonState(index, 'bet');
                    }
                });
            }
        } else if (gameStatus === 'running' && bets[index].placed && !bets[index].cashedOut) {
            cashoutBet(index);
        }
    };
    const setupBetPanel = (panel, index) => {
        const betInput = panel.querySelector('.bet-input');
        const betButton = panel.querySelector('.bet-button');
        const quickBetButtons = panel.querySelectorAll('.quick-bet');
        
        quickBetButtons.forEach(button => {
            button.addEventListener('click', () => {
                betInput.value = parseFloat(button.dataset.amount).toFixed(0);
            });
        });
        betButton.addEventListener('click', () => handleBetButtonClick(index, betInput.value));
    };

    // --- CORE GAME LOOP ---
    const calculateCrashPoint = () => {
        const r = Math.random() * 100;
        if (r < 10) return 1.00; // 10% chance of instant crash
        if (r < 60) return 1.01 + Math.random() * 0.49; // ~1-1.5x
        if (r < 95) return 1.51 + Math.random() * 8.48; // ~1.5-10x
        return 10.00 + Math.random() * 40; // High multiplier
    };
    const startGame = () => {
        gameStatus = 'running';
        crashPoint = calculateCrashPoint();
        currentMultiplier = 1.00;
        gameStateMessageEl.style.display = 'none';
        multiplierDisplayEl.style.display = 'block';
        rocketEl.style.display = 'block';
        explosionEl.style.display = 'none';
        updateRocketPosition();
        updateAllBetButtons('running');
    };
    const endGame = () => {
        gameStatus = 'crashed';
        clearInterval(gameLoopInterval);
        rocketEl.style.display = 'none';
        explosionEl.style.left = rocketEl.style.left;
        explosionEl.style.top = rocketEl.style.top;
        explosionEl.style.display = 'block';
        explosionEl.src = `https://assets.codepen.io/1506195/explosion.gif?t=${new Date().getTime()}`;
        multiplierDisplayEl.style.color = 'var(--neon-pink)';
        gameStateMessageEl.innerHTML = `<div>Crashed @</div><div class="crashed-at">${crashPoint.toFixed(2)}x</div>`;
        gameStateMessageEl.style.display = 'block';
        addToHistory(crashPoint);
        setTimeout(resetForNextRound, 3000);
    };
    const resetForNextRound = () => {
        if(gameLoopInterval) clearInterval(gameLoopInterval);
        gameStatus = 'betting';
        countdown = 5;
        bets.forEach(bet => { bet.placed = false; bet.cashedOut = false; });
        multiplierDisplayEl.style.color = 'var(--text-primary)';
        multiplierDisplayEl.style.display = 'none';
        gameStateMessageEl.style.display = 'block';
        explosionEl.style.display = 'none';
        rocketEl.style.transform = `rotate(0deg)`;
        updateRocketPosition();
        updateAllBetButtons('betting');
        gameLoopInterval = setInterval(gameTick, 100);
    };
    const gameTick = () => {
        if (gameStatus === 'betting') {
            countdown -= 0.1;
            gameStateMessageEl.innerHTML = `<div>Next Round In</div><div class="countdown">${countdown.toFixed(1)}s</div>`;
            if (countdown <= 0) {
                startGame();
            }
        } else if (gameStatus === 'running') {
            currentMultiplier += 0.01 * (1 + currentMultiplier / 20);
            multiplierDisplayEl.textContent = `${currentMultiplier.toFixed(2)}x`;
            updateRocketPosition();
            updateAllBetButtons('running');
            checkAutoCashouts();
            if (currentMultiplier >= crashPoint) {
                endGame();
            }
        }
    };
    
    // --- INITIALIZATION ---
    const init = () => {
        resizeCanvas();
        createParticles();
        animateParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
        
        userRef.onSnapshot(doc => {
            if (doc.exists) {
                updateBalanceUI(doc.data().balance);
            }
        });
        
        betPanels.forEach((panel, index) => setupBetPanel(panel, index));
        resetForNextRound();
    };
    
    // Start the game logic
    init();
};