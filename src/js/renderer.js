/**
 * Moteur de rendu Canvas
 */

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.resize();
    }

    /**
     * Redimensionne le canvas
     */
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    /**
     * Efface le canvas
     */
    clear(color = '#0a0a1a') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Dessine un cercle
     */
    drawCircle(x, y, radius, color, stroke = false) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (stroke) {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
    }

    /**
     * Dessine un vaisseau triangulaire
     */
    drawShip(x, y, angle, size, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        // Vaisseau triangulaire
        this.ctx.beginPath();
        this.ctx.moveTo(size, 0);
        this.ctx.lineTo(-size, size / 2);
        this.ctx.lineTo(-size / 2, 0);
        this.ctx.lineTo(-size, -size / 2);
        this.ctx.closePath();

        // Remplissage avec gradient
        const gradient = this.ctx.createLinearGradient(-size, 0, size, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#ffffff');

        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Contour lumineux
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Moteur (lueur)
        this.ctx.fillStyle = Utils.hsla(200, 100, 70, 0.8);
        this.ctx.beginPath();
        this.ctx.arc(-size * 0.7, 0, size / 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    /**
     * Dessine un astre/ennemi
     */
    drawAster(x, y, radius, color, level = 1) {
        this.ctx.save();

        // Halo externe
        const gradient = this.ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 1.5);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Corps principal
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Effet de texture
        this.ctx.globalAlpha = 0.3;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5;
            const px = x + Math.cos(angle) * radius * 0.5;
            const py = y + Math.sin(angle) * radius * 0.5;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(px, py, radius * 0.2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    /**
     * Dessine une étoile collectible
     */
    drawStar(x, y, size, color, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size / 2;

        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / spikes;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();

        // Gradient
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, color);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Lueur
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Dessine un projectile
     */
    drawProjectile(x, y, radius, color) {
        this.ctx.save();

        // Halo
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Corps
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    /**
     * Dessine du texte avec effet lumineux
     */
    drawText(text, x, y, size = 20, color = 'white', align = 'center') {
        this.ctx.save();
        this.ctx.font = `bold ${size}px sans-serif`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';

        // Ombre/lueur
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;

        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
    }

    /**
     * Dessine un bouclier autour d'un objet
     */
    drawShield(x, y, radius, alpha = 0.5) {
        this.ctx.save();
        this.ctx.globalAlpha = alpha;

        const gradient = this.ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.8)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(99, 102, 241, 1)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Applique un effet de shake à l'écran
     */
    applyShake(intensity) {
        const offsetX = (Math.random() - 0.5) * intensity;
        const offsetY = (Math.random() - 0.5) * intensity;
        this.ctx.translate(offsetX, offsetY);
    }

    /**
     * Réinitialise la transformation
     */
    resetTransform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
