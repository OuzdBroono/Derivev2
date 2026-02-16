/**
 * Point d'entrée principal
 */

// Instance globale du jeu
let game;

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Derive v2 - Initialisation...');

    // Crée l'instance du jeu
    game = new Game();
    game.init();

    // Configure les boutons du menu principal
    setupMainMenu();

    // Configure les autres écrans
    setupGameOverScreen();
    setupLeaderboardScreen();
    setupShopScreen();
    setupPauseMenu();

    console.log('✅ Jeu initialisé avec succès!');
});

/**
 * Configure le menu principal
 */
function setupMainMenu() {
    const startButton = document.getElementById('startButton');
    const leaderboardButton = document.getElementById('leaderboardButton');
    const controlsButton = document.getElementById('controlsButton');

    startButton.addEventListener('click', () => {
        audioSystem.resume();
        hideScreen('startScreen');
        showScreen('gameScreen');
        game.startGame();
    });

    leaderboardButton.addEventListener('click', async () => {
        hideScreen('startScreen');
        showScreen('leaderboardScreen');

        // Charge le classement
        document.getElementById('leaderboardList').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-dim);">
                Chargement...
            </div>
        `;

        const result = await game.leaderboardSystem.fetchLeaderboard(20);

        if (result.success) {
            game.leaderboardSystem.displayLeaderboard(result.scores);
        } else {
            document.getElementById('leaderboardList').innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--accent);">
                    Erreur de chargement du classement.
                </div>
            `;
        }
    });

    controlsButton.addEventListener('click', () => {
        alert(`🎮 CONTRÔLES\n\n🖱️ Souris : Déplacer le vaisseau\n🖱️ Clic : Tirer\n⌨️ Espace : Tirer\n⌨️ Échap : Pause\n\n📱 Tactile supporté !`);
    });
}

/**
 * Configure l'écran Game Over
 */
function setupGameOverScreen() {
    const submitScore = document.getElementById('submitScore');
    const restartButton = document.getElementById('restartButton');
    const backToMenu = document.getElementById('backToMenu');
    const playerNameInput = document.getElementById('playerName');

    submitScore.addEventListener('click', async () => {
        const name = playerNameInput.value.trim();

        if (!name) {
            alert('Veuillez entrer votre nom');
            return;
        }

        if (name.length < 2 || name.length > 20) {
            alert('Le nom doit faire entre 2 et 20 caractères');
            return;
        }

        submitScore.disabled = true;
        submitScore.textContent = 'Envoi...';

        const result = await game.leaderboardSystem.submitScore(
            name,
            game.score,
            game.levelSystem.currentLevel,
            game.totalDust
        );

        if (result.success) {
            alert(`Score enregistré ! Vous êtes #${result.rank} 🎉`);
            playerNameInput.value = '';
            document.getElementById('nameInput').style.display = 'none';
        } else {
            alert('Erreur lors de l\'enregistrement du score');
            submitScore.disabled = false;
            submitScore.textContent = 'Enregistrer';
        }
    });

    restartButton.addEventListener('click', () => {
        hideScreen('gameOverScreen');
        showScreen('gameScreen');
        document.getElementById('nameInput').style.display = 'flex';
        game.startGame();
    });

    backToMenu.addEventListener('click', () => {
        hideScreen('gameOverScreen');
        showScreen('startScreen');
        document.getElementById('nameInput').style.display = 'flex';
        audioSystem.stopMusic();
    });
}

/**
 * Configure l'écran du classement
 */
function setupLeaderboardScreen() {
    const closeLeaderboard = document.getElementById('closeLeaderboard');

    closeLeaderboard.addEventListener('click', () => {
        hideScreen('leaderboardScreen');
        showScreen('startScreen');
    });
}

/**
 * Configure l'écran de la boutique
 */
function setupShopScreen() {
    const continueButton = document.getElementById('continueButton');

    continueButton.addEventListener('click', () => {
        game.closeShop();
    });
}

/**
 * Configure le menu pause
 */
function setupPauseMenu() {
    const resumeButton = document.getElementById('resumeButton');
    const mainMenuButton = document.getElementById('mainMenuButton');

    resumeButton.addEventListener('click', () => {
        game.resumeGame();
    });

    mainMenuButton.addEventListener('click', () => {
        document.getElementById('pauseMenu').classList.add('hidden');
        hideScreen('gameScreen');
        showScreen('startScreen');
        game.state = 'menu';
        audioSystem.stopMusic();
    });
}

/**
 * Utilitaires d'affichage des écrans
 */
function showScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

function hideScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.remove('active');
    }
}

/**
 * Gestion des erreurs globales
 */
window.addEventListener('error', (e) => {
    console.error('Erreur:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejetée:', e.reason);
});

/**
 * Message de bienvenue dans la console
 */
console.log('%c🎮 Derive v2', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cUn jeu par OuzdBroono', 'font-size: 12px; color: #94a3b8;');
console.log('%cBon voyage dans le cosmos ! 🚀', 'font-size: 14px; color: #a855f7;');
