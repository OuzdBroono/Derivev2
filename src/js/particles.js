/**
 * Système de particules
 */

class Particle {
    constructor(x, y, vx, vy, color, size, lifetime) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.age = 0;
        this.alpha = 1;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.age += deltaTime;

        // Fade out
        this.alpha = 1 - (this.age / this.lifetime);

        // Gravité légère
        this.vy += 50 * deltaTime;

        return this.age < this.lifetime;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 1000;
    }

    /**
     * Crée une explosion de particules
     */
    createExplosion(x, y, count = 20, color = null) {
        const hue = color || Utils.randomInt(0, 360);

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Utils.random(100, 300);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const size = Utils.random(2, 6);
            const lifetime = Utils.random(0.5, 1.5);
            const particleColor = Utils.hsl(hue + Utils.random(-30, 30), 100, 60);

            this.addParticle(x, y, vx, vy, particleColor, size, lifetime);
        }
    }

    /**
     * Crée une traînée de particules
     */
    createTrail(x, y, vx, vy, color) {
        const count = 3;
        for (let i = 0; i < count; i++) {
            const offsetX = Utils.random(-5, 5);
            const offsetY = Utils.random(-5, 5);
            const size = Utils.random(1, 3);
            const lifetime = Utils.random(0.2, 0.5);
            const particleVx = vx * 0.5 + Utils.random(-50, 50);
            const particleVy = vy * 0.5 + Utils.random(-50, 50);

            this.addParticle(
                x + offsetX,
                y + offsetY,
                particleVx,
                particleVy,
                color,
                size,
                lifetime
            );
        }
    }

    /**
     * Crée des particules scintillantes
     */
    createSparkles(x, y, count = 10, color = 'white') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.random(50, 150);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const size = Utils.random(1, 3);
            const lifetime = Utils.random(0.3, 0.8);

            this.addParticle(x, y, vx, vy, color, size, lifetime);
        }
    }

    /**
     * Ajoute une particule au système
     */
    addParticle(x, y, vx, vy, color, size, lifetime) {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // Supprime la plus ancienne
        }

        this.particles.push(new Particle(x, y, vx, vy, color, size, lifetime));
    }

    /**
     * Met à jour toutes les particules
     */
    update(deltaTime) {
        this.particles = this.particles.filter(particle => particle.update(deltaTime));
    }

    /**
     * Dessine toutes les particules
     */
    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    /**
     * Vide toutes les particules
     */
    clear() {
        this.particles = [];
    }

    /**
     * Retourne le nombre de particules actives
     */
    getCount() {
        return this.particles.length;
    }
}

/**
 * Classe pour les étoiles en arrière-plan (parallaxe)
 */
class StarField {
    constructor(width, height, count = 200) {
        this.width = width;
        this.height = height;
        this.stars = [];

        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 50 + 20,
                brightness: Math.random() * 0.5 + 0.5
            });
        }
    }

    update(deltaTime) {
        this.stars.forEach(star => {
            star.y += star.speed * deltaTime;

            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });
    }

    draw(ctx) {
        ctx.save();
        this.stars.forEach(star => {
            ctx.globalAlpha = star.brightness;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}
