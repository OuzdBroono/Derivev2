/**
 * Système de niveaux et biomes
 */

class LevelSystem {
    constructor() {
        this.currentLevel = 1;
        this.enemiesDefeated = 0;
        this.enemiesPerLevel = 20;
        this.biomes = this.createBiomes();
    }

    /**
     * Définit les différents biomes visuels
     */
    createBiomes() {
        return [
            {
                name: 'Nébuleuse Bleue',
                bgColor: '#0a0a1a',
                primaryHue: 220,
                secondaryHue: 260,
                starColor: 'rgba(200, 220, 255, 0.8)'
            },
            {
                name: 'Zone Pourpre',
                bgColor: '#1a0a1a',
                primaryHue: 280,
                secondaryHue: 320,
                starColor: 'rgba(255, 200, 255, 0.8)'
            },
            {
                name: 'Secteur Émeraude',
                bgColor: '#0a1a0a',
                primaryHue: 140,
                secondaryHue: 180,
                starColor: 'rgba(200, 255, 220, 0.8)'
            },
            {
                name: 'Rift Ambré',
                bgColor: '#1a140a',
                primaryHue: 30,
                secondaryHue: 60,
                starColor: 'rgba(255, 240, 200, 0.8)'
            },
            {
                name: 'Abysse Cramoisi',
                bgColor: '#1a0a0a',
                primaryHue: 0,
                secondaryHue: 20,
                starColor: 'rgba(255, 200, 200, 0.8)'
            },
            {
                name: 'Vide Cosmique',
                bgColor: '#050510',
                primaryHue: 240,
                secondaryHue: 280,
                starColor: 'rgba(220, 220, 255, 0.8)'
            }
        ];
    }

    /**
     * Obtient le biome actuel
     */
    getCurrentBiome() {
        const biomeIndex = Math.floor((this.currentLevel - 1) / 3) % this.biomes.length;
        return this.biomes[biomeIndex];
    }

    /**
     * Incrémente le compteur d'ennemis vaincus
     */
    addEnemyKill() {
        this.enemiesDefeated++;

        if (this.enemiesDefeated >= this.enemiesPerLevel) {
            return this.levelUp();
        }

        return false;
    }

    /**
     * Monte de niveau
     */
    levelUp() {
        this.currentLevel++;
        this.enemiesDefeated = 0;
        this.enemiesPerLevel = Math.floor(20 + this.currentLevel * 5);

        audioSystem.playLevelUp();

        return true;
    }

    /**
     * Obtient le multiplicateur de difficulté
     */
    getDifficultyMultiplier() {
        return 1 + (this.currentLevel - 1) * 0.15;
    }

    /**
     * Obtient les informations du niveau
     */
    getLevelInfo() {
        return {
            level: this.currentLevel,
            enemiesDefeated: this.enemiesDefeated,
            enemiesRequired: this.enemiesPerLevel,
            progress: this.enemiesDefeated / this.enemiesPerLevel,
            biome: this.getCurrentBiome()
        };
    }

    /**
     * Réinitialise le système
     */
    reset() {
        this.currentLevel = 1;
        this.enemiesDefeated = 0;
        this.enemiesPerLevel = 20;
    }

    /**
     * Génère un arrière-plan procédural pour le biome
     */
    generateBackground(ctx, width, height) {
        const biome = this.getCurrentBiome();

        // Gradient de fond
        const gradient = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.max(width, height)
        );

        gradient.addColorStop(0, this.lightenColor(biome.bgColor, 20));
        gradient.addColorStop(1, biome.bgColor);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Nébuleuse procédurale
        this.drawNebula(ctx, width, height, biome);
    }

    /**
     * Dessine une nébuleuse procédurale
     */
    drawNebula(ctx, width, height, biome) {
        ctx.save();
        ctx.globalAlpha = 0.3;

        const count = 5;
        for (let i = 0; i < count; i++) {
            const x = (width / count) * i + Utils.random(-100, 100);
            const y = height / 2 + Utils.random(-height / 4, height / 4);
            const radius = Utils.random(100, 300);

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            const hue = Utils.random(biome.primaryHue - 20, biome.secondaryHue + 20);

            gradient.addColorStop(0, Utils.hsla(hue, 70, 50, 0.3));
            gradient.addColorStop(0.5, Utils.hsla(hue, 70, 30, 0.15));
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    /**
     * Éclaircit une couleur hexadécimale
     */
    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }
}
