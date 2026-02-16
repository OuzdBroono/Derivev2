/**
 * Gestion du vaisseau joueur
 */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.radius = 20;
        this.maxSpeed = 300;
        this.acceleration = 800;
        this.friction = 0.95;

        // Stats
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.alive = true;

        // Tir
        this.canShoot = true;
        this.shootCooldown = 0.2;
        this.shootTimer = 0;
        this.projectiles = [];

        // Upgrades
        this.hasShield = false;
        this.shieldActive = false;
        this.shieldDuration = 0;

        this.hasRapidFire = false;
        this.rapidFireDuration = 0;

        this.damageMultiplier = 1;
        this.speedMultiplier = 1;

        // Input
        this.targetX = x;
        this.targetY = y;
        this.mouseControl = true;
    }

    /**
     * Définit la position cible (souris/tactile)
     */
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    /**
     * Tire un projectile
     */
    shoot() {
        if (!this.canShoot || this.shootTimer > 0) return;

        const speed = 600;
        const vx = Math.cos(this.angle) * speed;
        const vy = Math.sin(this.angle) * speed;

        const offsetX = Math.cos(this.angle) * this.radius;
        const offsetY = Math.sin(this.angle) * this.radius;

        this.projectiles.push({
            x: this.x + offsetX,
            y: this.y + offsetY,
            vx: vx,
            vy: vy,
            radius: 4,
            damage: 20 * this.damageMultiplier,
            lifetime: 2,
            age: 0
        });

        const cooldown = this.hasRapidFire && this.rapidFireDuration > 0
            ? this.shootCooldown / 2
            : this.shootCooldown;

        this.shootTimer = cooldown;

        audioSystem.playShoot();
    }

    /**
     * Active un upgrade
     */
    activateUpgrade(type, duration = 10) {
        switch (type) {
            case 'shield':
                this.hasShield = true;
                this.shieldActive = true;
                this.shieldDuration = duration;
                break;

            case 'rapidFire':
                this.hasRapidFire = true;
                this.rapidFireDuration = duration;
                break;

            case 'damage':
                this.damageMultiplier = 2;
                break;

            case 'speed':
                this.speedMultiplier = 1.5;
                break;
        }
    }

    /**
     * Prend des dégâts
     */
    takeDamage(amount) {
        if (this.shieldActive) {
            this.shieldActive = false;
            this.shieldDuration = 0;
            return;
        }

        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }

        audioSystem.playHit();
    }

    /**
     * Soigne le joueur
     */
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    /**
     * Met à jour le joueur
     */
    update(deltaTime, canvasWidth, canvasHeight) {
        if (!this.alive) return;

        // Mouvement vers la cible
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            const ax = (dx / distance) * this.acceleration * this.speedMultiplier;
            const ay = (dy / distance) * this.acceleration * this.speedMultiplier;

            this.vx += ax * deltaTime;
            this.vy += ay * deltaTime;
        }

        // Limite de vitesse
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed * this.speedMultiplier) {
            this.vx = (this.vx / speed) * this.maxSpeed * this.speedMultiplier;
            this.vy = (this.vy / speed) * this.maxSpeed * this.speedMultiplier;
        }

        // Friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Mise à jour position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Limite du canvas
        this.x = Utils.clamp(this.x, this.radius, canvasWidth - this.radius);
        this.y = Utils.clamp(this.y, this.radius, canvasHeight - this.radius);

        // Angle vers la cible
        this.angle = Math.atan2(dy, dx);

        // Cooldown de tir
        if (this.shootTimer > 0) {
            this.shootTimer -= deltaTime;
        }

        // Mise à jour des projectiles
        this.projectiles = this.projectiles.filter(proj => {
            proj.x += proj.vx * deltaTime;
            proj.y += proj.vy * deltaTime;
            proj.age += deltaTime;

            return proj.age < proj.lifetime &&
                   proj.x > 0 && proj.x < canvasWidth &&
                   proj.y > 0 && proj.y < canvasHeight;
        });

        // Mise à jour des upgrades temporaires
        if (this.shieldDuration > 0) {
            this.shieldDuration -= deltaTime;
            if (this.shieldDuration <= 0) {
                this.shieldActive = false;
            }
        }

        if (this.rapidFireDuration > 0) {
            this.rapidFireDuration -= deltaTime;
            if (this.rapidFireDuration <= 0) {
                this.hasRapidFire = false;
            }
        }
    }

    /**
     * Dessine le joueur
     */
    draw(renderer) {
        if (!this.alive) return;

        // Bouclier
        if (this.shieldActive) {
            const alpha = Math.sin(Date.now() / 100) * 0.3 + 0.5;
            renderer.drawShield(this.x, this.y, this.radius * 2, alpha);
        }

        // Vaisseau
        renderer.drawShip(this.x, this.y, this.angle, this.radius, '#6366f1');

        // Projectiles
        this.projectiles.forEach(proj => {
            renderer.drawProjectile(proj.x, proj.y, proj.radius, '#818cf8');
        });
    }

    /**
     * Réinitialise le joueur
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.health = this.maxHealth;
        this.alive = true;
        this.projectiles = [];
        this.shieldActive = false;
        this.shieldDuration = 0;
        this.rapidFireDuration = 0;
        this.damageMultiplier = 1;
        this.speedMultiplier = 1;
    }
}
