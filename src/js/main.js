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

    // Détecte si le jeu tourne en mode standalone (file://)
    const isStandalone = window.location.protocol === 'file:';
    if (isStandalone) {
        console.log('⚠️ Mode standalone détecté - Le classement en ligne ne sera pas disponible');
    }

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

        // Vérifie si en mode standalone
        const isStandalone = window.location.protocol === 'file:';

        if (isStandalone) {
            // Affiche le meilleur score local uniquement
            const bestScore = game.leaderboardSystem.getLocalBest();
            document.getElementById('leaderboardList').innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3 style="color: var(--primary); margin-bottom: 1rem;">Meilleur Score Local</h3>
                    <div class="leaderboard-entry" style="justify-content: center; gap: 2rem;">
                        <span class="leaderboard-name">Vous</span>
                        <span class="leaderboard-level" style="color: var(--text-dim);">
                            Niv. ${bestScore.level}
                        </span>
                        <span class="leaderboard-score">${Utils.formatNumber(bestScore.score)}</span>
                    </div>
                    <p style="color: var(--text-dim); margin-top: 2rem; font-size: 0.9rem;">
                        ℹ️ Le classement en ligne nécessite un serveur PHP.<br>
                        Lancez avec : <code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 0.25rem;">php -S localhost:8000</code>
                    </p>
                </div>
            `;
            return;
        }

        // Charge le classement en ligne
        document.getElementById('leaderboardList').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-dim);">
                Chargement...
            </div>
        `;

        const result = await game.leaderboardSystem.fetchLeaderboard(20);

        if (result.success) {
            game.leaderboardSystem.displayLeaderboard(result.scores);
        } else {
            // Affiche le meilleur score local en cas d'erreur
            const bestScore = game.leaderboardSystem.getLocalBest();
            document.getElementById('leaderboardList').innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: var(--accent); margin-bottom: 2rem;">
                        ⚠️ Impossible de charger le classement en ligne
                    </p>
                    <h3 style="color: var(--primary); margin-bottom: 1rem;">Meilleur Score Local</h3>
                    <div class="leaderboard-entry" style="justify-content: center; gap: 2rem;">
                        <span class="leaderboard-name">Vous</span>
                        <span class="leaderboard-level" style="color: var(--text-dim);">
                            Niv. ${bestScore.level}
                        </span>
                        <span class="leaderboard-score">${Utils.formatNumber(bestScore.score)}</span>
                    </div>
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

        // Vérifie si en mode standalone
        const isStandalone = window.location.protocol === 'file:';

        if (isStandalone) {
            alert('ℹ️ Mode standalone : Score sauvegardé localement uniquement.\n\nPour le classement en ligne, lancez avec un serveur :\nphp -S localhost:8000');
            playerNameInput.value = '';
            document.getElementById('nameInput').style.display = 'none';
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
            alert('Erreur lors de l\'enregistrement du score.\nScore sauvegardé localement.');
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
