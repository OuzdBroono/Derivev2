/**
 * Logique principale du jeu
 */

class Game {
    constructor() {
        // Canvas et rendu
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);

        // Systèmes
        this.player = null;
        this.enemyManager = new EnemyManager();
        this.particleSystem = new ParticleSystem();
        this.levelSystem = new LevelSystem();
        this.shopSystem = new ShopSystem();
        this.leaderboardSystem = new LeaderboardSystem();
        this.starField = new StarField(this.renderer.width, this.renderer.height);

        // État du jeu
        this.state = 'menu'; // 'menu', 'playing', 'paused', 'shop', 'gameover'
        this.score = 0;
        this.dust = 0;
        this.totalDust = 0;

        // Temps
        this.lastTime = 0;
        this.deltaTime = 0;

        // Effets
        this.screenShake = 0;

        // Bind methods
        this.update = this.update.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * Initialise le jeu
     */
    init() {
        // Audio
        audioSystem.init();

        // Input handlers
        this.setupInputHandlers();

        // Resize handler
        window.addEventListener('resize', this.handleResize);

        // Charge le meilleur score
        const bestScore = this.leaderboardSystem.getLocalBest();
        console.log('Meilleur score local:', bestScore);
    }

    /**
     * Gère le redimensionnement
     */
    handleResize() {
        this.renderer.resize();
        this.starField.resize(this.renderer.width, this.renderer.height);
    }

    /**
     * Configure les contrôles
     */
    setupInputHandlers() {
        // Souris
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.state === 'playing' && this.player) {
                const rect = this.canvas.getBoundingClientRect();
                this.player.setTarget(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                );
            }
        });

        // Clic pour tirer
        this.canvas.addEventListener('mousedown', () => {
            if (this.state === 'playing' && this.player) {
                this.player.shoot();
            }
        });

        // Tactile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.state === 'playing' && this.player) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.player.setTarget(
                    touch.clientX - rect.left,
                    touch.clientY - rect.top
                );
            }
        }, { passive: false });

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.state === 'playing' && this.player) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.player.setTarget(
                    touch.clientX - rect.left,
                    touch.clientY - rect.top
                );
                this.player.shoot();
            }
        }, { passive: false });

        // Clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state === 'playing') {
                this.pauseGame();
            }
            if (e.key === ' ' && this.state === 'playing' && this.player) {
                e.preventDefault();
                this.player.shoot();
            }
        });
    }

    /**
     * Démarre une nouvelle partie
     */
    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.dust = 0;
        this.totalDust = 0;

        // Réinitialise les systèmes
        this.player = new Player(
            this.renderer.width / 2,
            this.renderer.height / 2
        );
        this.enemyManager.reset();
        this.particleSystem.clear();
        this.levelSystem.reset();
        this.shopSystem.reset();

        // Démarre la musique
        audioSystem.resume();
        audioSystem.startMusic(1);

        // Boucle de jeu
        this.lastTime = performance.now();
        requestAnimationFrame(this.update);

        // Met à jour le HUD
        this.updateHUD();
    }

    /**
     * Pause le jeu
     */
    pauseGame() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseMenu').classList.remove('hidden');
        }
    }

    /**
     * Reprend le jeu
     */
    resumeGame() {
        if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseMenu').classList.add('hidden');
            audioSystem.resume();
            this.lastTime = performance.now();
            requestAnimationFrame(this.update);
        }
    }

    /**
     * Ouvre la boutique
     */
    openShop() {
        this.state = 'shop';
        this.shopSystem.reset();

        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('shopScreen').classList.add('active');

        document.getElementById('shopDustDisplay').textContent = this.dust;

        this.shopSystem.displayShop(this.dust, (itemId) => {
            const result = this.shopSystem.purchaseItem(itemId, this.player, this.dust);

            if (result.success) {
                this.dust -= result.cost;
                document.getElementById('shopDustDisplay').textContent = this.dust;

                // Rafraîchit l'affichage
                this.shopSystem.displayShop(this.dust, (itemId) => {
                    this.openShop(); // Récursif pour refresh
                });
            }
        });
    }

    /**
     * Ferme la boutique et reprend le jeu
     */
    closeShop() {
        this.state = 'playing';

        document.getElementById('shopScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');

        // Nouvelle musique pour le niveau
        audioSystem.startMusic(this.levelSystem.currentLevel);

        this.lastTime = performance.now();
        requestAnimationFrame(this.update);
    }

    /**
     * Game Over
     */
    gameOver() {
        this.state = 'gameover';

        audioSystem.stopMusic();
        audioSystem.playExplosion();

        // Explosion finale
        this.particleSystem.createExplosion(this.player.x, this.player.y, 50);

        // Affiche l'écran game over
        document.getElementById('finalScore').textContent = Utils.formatNumber(this.score);
        document.getElementById('finalLevel').textContent = this.levelSystem.currentLevel;
        document.getElementById('finalDust').textContent = Utils.formatNumber(this.totalDust);

        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.add('active');

        // Sauvegarde locale
        this.leaderboardSystem.saveLocalBest(
            this.score,
            this.levelSystem.currentLevel,
            this.totalDust
        );
    }

    /**
     * Boucle principale du jeu
     */
    update(currentTime) {
        if (this.state !== 'playing') return;

        // Calcul du deltaTime
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.deltaTime = Math.min(this.deltaTime, 0.1); // Cap pour éviter les gros sauts
        this.lastTime = currentTime;

        // Mise à jour
        this.updateGame(this.deltaTime);

        // Rendu
        this.render();

        // Continue la boucle
        requestAnimationFrame(this.update);
    }

    /**
     * Met à jour la logique du jeu
     */
    updateGame(dt) {
        // Champ d'étoiles
        this.starField.update(dt);

        // Joueur
        this.player.update(dt, this.renderer.width, this.renderer.height);

        // Ennemis
        this.enemyManager.update(
            dt,
            this.renderer.width,
            this.renderer.height,
            this.levelSystem.currentLevel
        );

        // Particules
        this.particleSystem.update(dt);

        // Collisions
        this.checkCollisions();

        // Screen shake
        if (this.screenShake > 0) {
            this.screenShake -= dt * 10;
        }

        // Vérifie si le joueur est mort
        if (!this.player.alive) {
            this.gameOver();
        }

        // Met à jour le HUD
        this.updateHUD();
    }

    /**
     * Gère les collisions
     */
    checkCollisions() {
        // Projectiles vs Ennemis
        this.player.projectiles.forEach((proj, projIndex) => {
            this.enemyManager.enemies.forEach((enemy, enemyIndex) => {
                if (Utils.circleCollision(
                    proj.x, proj.y, proj.radius,
                    enemy.x, enemy.y, enemy.radius
                )) {
                    // Enlève le projectile
                    this.player.projectiles.splice(projIndex, 1);

                    // Inflige des dégâts
                    const killed = enemy.takeDamage(proj.damage);

                    if (killed) {
                        // Score et poussière
                        this.score += enemy.scoreValue * this.levelSystem.currentLevel;
                        this.dust += enemy.dustValue;
                        this.totalDust += enemy.dustValue;

                        // Génère des étoiles
                        for (let i = 0; i < enemy.dustValue; i++) {
                            this.enemyManager.spawnStar(
                                enemy.x + Utils.random(-20, 20),
                                enemy.y + Utils.random(-20, 20),
                                1
                            );
                        }

                        // Effets
                        this.particleSystem.createExplosion(enemy.x, enemy.y, 15, null);
                        audioSystem.playExplosion();
                        this.screenShake = 0.5;

                        // Progression du niveau
                        const leveledUp = this.levelSystem.addEnemyKill();
                        if (leveledUp) {
                            this.openShop();
                        }
                    }
                }
            });
        });

        // Joueur vs Ennemis
        this.enemyManager.enemies.forEach(enemy => {
            if (Utils.circleCollision(
                this.player.x, this.player.y, this.player.radius,
                enemy.x, enemy.y, enemy.radius
            )) {
                this.player.takeDamage(enemy.damage);
                enemy.alive = false;

                this.particleSystem.createExplosion(enemy.x, enemy.y, 10);
                this.screenShake = 1;
            }
        });

        // Joueur vs Étoiles
        this.enemyManager.stars.forEach(star => {
            if (!star.collected && Utils.circleCollision(
                this.player.x, this.player.y, this.player.radius * 2,
                star.x, star.y, star.radius
            )) {
                star.collected = true;
                this.dust += star.value;
                this.totalDust += star.value;

                this.particleSystem.createSparkles(star.x, star.y, 8, star.color);
                audioSystem.playCollect();
            }
        });
    }

    /**
     * Rendu du jeu
     */
    render() {
        this.renderer.resetTransform();

        // Background
        const biome = this.levelSystem.getCurrentBiome();
        this.levelSystem.generateBackground(
            this.renderer.ctx,
            this.renderer.width,
            this.renderer.height
        );

        // Champ d'étoiles
        this.starField.draw(this.renderer.ctx);

        // Screen shake
        if (this.screenShake > 0) {
            this.renderer.applyShake(this.screenShake * 10);
        }

        // Entités
        this.particleSystem.draw(this.renderer.ctx);
        this.enemyManager.draw(this.renderer);
        this.player.draw(this.renderer);
    }

    /**
     * Met à jour le HUD
     */
    updateHUD() {
        document.getElementById('scoreDisplay').textContent = Utils.formatNumber(this.score);
        document.getElementById('levelDisplay').textContent = this.levelSystem.currentLevel;
        document.getElementById('dustDisplay').textContent = Utils.formatNumber(this.dust);

        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('healthBar').style.width = `${healthPercent}%`;
    }
}
