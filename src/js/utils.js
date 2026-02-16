/**
 * Utilitaires globaux
 */

const Utils = {
    /**
     * Génère un nombre aléatoire entre min et max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Génère un entier aléatoire entre min et max
     */
    randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    },

    /**
     * Choisit un élément aléatoire dans un tableau
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Interpole linéairement entre deux valeurs
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Restreint une valeur entre min et max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Calcule la distance entre deux points
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Calcule l'angle entre deux points
     */
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    /**
     * Vérifie la collision entre deux cercles
     */
    circleCollision(x1, y1, r1, x2, y2, r2) {
        return this.distance(x1, y1, x2, y2) < r1 + r2;
    },

    /**
     * Génère une couleur HSL
     */
    hsl(h, s, l) {
        return `hsl(${h}, ${s}%, ${l}%)`;
    },

    /**
     * Génère une couleur HSL avec alpha
     */
    hsla(h, s, l, a) {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    },

    /**
     * Convertit des degrés en radians
     */
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    },

    /**
     * Convertit des radians en degrés
     */
    toDegrees(radians) {
        return radians * 180 / Math.PI;
    },

    /**
     * Génère un ID unique
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Formate un nombre avec des séparateurs
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    /**
     * Sauvegarde dans localStorage
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erreur de sauvegarde:', e);
            return false;
        }
    },

    /**
     * Charge depuis localStorage
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Erreur de chargement:', e);
            return defaultValue;
        }
    },

    /**
     * Supprime du localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Erreur de suppression:', e);
            return false;
        }
    }
};

/**
 * Classe Vector2D pour les calculs vectoriels
 */
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag > 0) {
            this.divide(mag);
        }
        return this;
    }

    limit(max) {
        const mag = this.magnitude();
        if (mag > max) {
            this.normalize().multiply(max);
        }
        return this;
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }

    static distance(v1, v2) {
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
