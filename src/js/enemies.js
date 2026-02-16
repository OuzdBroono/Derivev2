/**
 * Gestion des ennemis (astres)
 */

class Enemy {
    constructor(x, y, type, level = 1) {
        this.x = x;
        this.y = y;
        this.type = type; // 'small', 'medium', 'large'
        this.level = level;

        // Stats basées sur le type
        this.setStats(type, level);

        // Mouvement
        this.angle = Utils.random(0, Math.PI * 2);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.rotationSpeed = Utils.random(-2, 2);
        this.rotation = 0;

        // État
        this.alive = true;
        this.flashTimer = 0;
    }

    /**
     * Définit les stats selon le type
     */
    setStats(type, level) {
        const levelMultiplier = 1 + (level - 1) * 0.2;

        switch (type) {
            case 'small':
                this.radius = 15;
                this.health = 20 * levelMultiplier;
                this.maxHealth = this.health;
                this.speed = 100 + level * 10;
                this.damage = 10;
                this.scoreValue = 10;
                this.dustValue = 1;
                this.color = Utils.hsl(180, 70, 50);
                break;

            case 'medium':
                this.radius = 25;
                this.health = 50 * levelMultiplier;
                this.maxHealth = this.health;
                this.speed = 70 + level * 5;
                this.damage = 20;
                this.scoreValue = 25;
                this.dustValue = 3;
                this.color = Utils.hsl(280, 70, 50);
                break;

            case 'large':
                this.radius = 40;
                this.health = 100 * levelMultiplier;
                this.maxHealth = this.health;
                this.speed = 50 + level * 3;
                this.damage = 30;
                this.scoreValue = 50;
                this.dustValue = 5;
                this.color = Utils.hsl(0, 70, 50);
                break;
        }
    }

    /**
     * Prend des dégâts
     */
    takeDamage(amount) {
        this.health -= amount;
        this.flashTimer = 0.1;

        if (this.health <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }

    /**
     * Met à jour l'ennemi
     */
    update(deltaTime, canvasWidth, canvasHeight) {
        // Mouvement
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;

        // Rebond sur les bords
        if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
            this.vx *= -1;
            this.x = Utils.clamp(this.x, this.radius, canvasWidth - this.radius);
        }

        if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
            this.vy *= -1;
            this.y = Utils.clamp(this.y, this.radius, canvasHeight - this.radius);
        }

        // Flash de dégât
        if (this.flashTimer > 0) {
            this.flashTimer -= deltaTime;
        }
    }

    /**
     * Dessine l'ennemi
     */
    draw(renderer) {
        const color = this.flashTimer > 0 ? 'white' : this.color;
        renderer.drawAster(this.x, this.y, this.radius, color, this.level);

        // Barre de vie pour les gros ennemis
        if (this.type === 'large' && this.health < this.maxHealth) {
            const barWidth = this.radius * 2;
            const barHeight = 4;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.radius - 10;

            renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            renderer.ctx.fillRect(barX, barY, barWidth, barHeight);

            const healthPercent = this.health / this.maxHealth;
            renderer.ctx.fillStyle = healthPercent > 0.3 ? '#4ade80' : '#ef4444';
            renderer.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
    }
}

/**
 * Étoile collectible (Poussière d'étoiles)
 */
class Star {
    constructor(x, y, value = 1) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.radius = 8 + value * 2;
        this.color = Utils.hsl(45, 100, 70);
        this.rotation = 0;
        this.rotationSpeed = 3;
        this.collected = false;
        this.lifetime = 10;
        this.age = 0;
    }

    update(deltaTime) {
        this.rotation += this.rotationSpeed * deltaTime;
        this.age += deltaTime;

        // Pulse effect
        const pulse = Math.sin(this.age * 5) * 0.2 + 1;
        this.currentRadius = this.radius * pulse;

        return this.age < this.lifetime;
    }

    draw(renderer) {
        renderer.drawStar(
            this.x,
            this.y,
            this.currentRadius || this.radius,
            this.color,
            this.rotation
        );
    }
}

/**
 * Gestionnaire d'ennemis
 */
class EnemyManager {
    constructor() {
        this.enemies = [];
        this.stars = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2;
        this.maxEnemies = 15;
    }

    /**
     * Génère un ennemi
     */
    spawnEnemy(canvasWidth, canvasHeight, level = 1) {
        if (this.enemies.length >= this.maxEnemies) return;

        // Position aléatoire sur les bords
        const side = Utils.randomInt(0, 3);
        let x, y;

        switch (side) {
            case 0: // Haut
                x = Utils.random(0, canvasWidth);
                y = -50;
                break;
            case 1: // Droite
                x = canvasWidth + 50;
                y = Utils.random(0, canvasHeight);
                break;
            case 2: // Bas
                x = Utils.random(0, canvasWidth);
                y = canvasHeight + 50;
                break;
            case 3: // Gauche
                x = -50;
                y = Utils.random(0, canvasHeight);
                break;
        }

        // Type d'ennemi basé sur le niveau
        const rand = Math.random();
        let type;

        if (rand < 0.6) {
            type = 'small';
        } else if (rand < 0.9) {
            type = 'medium';
        } else {
            type = 'large';
        }

        this.enemies.push(new Enemy(x, y, type, level));
    }

    /**
     * Génère une étoile collectible
     */
    spawnStar(x, y, value = 1) {
        this.stars.push(new Star(x, y, value));
    }

    /**
     * Met à jour tous les ennemis et étoiles
     */
    update(deltaTime, canvasWidth, canvasHeight, level) {
        // Spawn d'ennemis
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnEnemy(canvasWidth, canvasHeight, level);
            this.spawnTimer = 0;

            // Diminue l'intervalle avec le niveau
            this.spawnInterval = Math.max(0.5, 2 - level * 0.1);
        }

        // Mise à jour des ennemis
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime, canvasWidth, canvasHeight);
        });

        // Supprime les ennemis morts
        this.enemies = this.enemies.filter(enemy => enemy.alive);

        // Mise à jour des étoiles
        this.stars = this.stars.filter(star => {
            return !star.collected && star.update(deltaTime);
        });
    }

    /**
     * Dessine tous les ennemis et étoiles
     */
    draw(renderer) {
        this.stars.forEach(star => star.draw(renderer));
        this.enemies.forEach(enemy => enemy.draw(renderer));
    }

    /**
     * Réinitialise le gestionnaire
     */
    reset() {
        this.enemies = [];
        this.stars = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2;
    }
}
