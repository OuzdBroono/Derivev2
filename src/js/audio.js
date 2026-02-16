/**
 * Système audio - Synthèse Web Audio API
 */

class AudioSystem {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.initialized = false;
        this.sounds = {};
        this.musicNodes = {};
    }

    /**
     * Initialise le contexte audio
     */
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.3;
            this.initialized = true;
            return true;
        } catch (e) {
            console.error('Erreur initialisation audio:', e);
            return false;
        }
    }

    /**
     * Reprend le contexte audio (requis pour certains navigateurs)
     */
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    /**
     * Joue un son de tir laser
     */
    playShoot() {
        if (!this.initialized) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Joue un son d'explosion
     */
    playExplosion() {
        if (!this.initialized) return;

        const now = this.context.currentTime;

        // Bruit blanc
        const bufferSize = this.context.sampleRate * 0.5;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.context.createBufferSource();
        noise.buffer = buffer;

        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(50, now + 0.5);

        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 0.5);
    }

    /**
     * Joue un son de collecte
     */
    playCollect() {
        if (!this.initialized) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Joue un son de dégât
     */
    playHit() {
        if (!this.initialized) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Joue un son de niveau complété
     */
    playLevelUp() {
        if (!this.initialized) return;

        const now = this.context.currentTime;
        const notes = [400, 500, 600, 800];

        notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = now + i * 0.1;
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    }

    /**
     * Démarre la musique d'ambiance (drone ambient)
     */
    startMusic(level = 1) {
        if (!this.initialized) return;
        this.stopMusic();

        const now = this.context.currentTime;

        // Créer plusieurs oscillateurs pour un son ambiant riche
        const frequencies = [55, 110, 165, 220]; // Notes harmoniques
        const baseFreq = frequencies[level % frequencies.length];

        this.musicNodes.oscillators = [];
        this.musicNodes.gains = [];

        for (let i = 0; i < 3; i++) {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            const filter = this.context.createBiquadFilter();

            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.value = baseFreq * (i + 1);

            filter.type = 'lowpass';
            filter.frequency.value = 800 + level * 100;
            filter.Q.value = 1;

            gain.gain.value = 0;
            gain.gain.linearRampToValueAtTime(0.05 / (i + 1), now + 2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);

            this.musicNodes.oscillators.push(osc);
            this.musicNodes.gains.push(gain);
        }
    }

    /**
     * Arrête la musique
     */
    stopMusic() {
        if (this.musicNodes.oscillators) {
            const now = this.context.currentTime;

            this.musicNodes.gains.forEach(gain => {
                gain.gain.linearRampToValueAtTime(0, now + 1);
            });

            setTimeout(() => {
                this.musicNodes.oscillators.forEach(osc => {
                    try {
                        osc.stop();
                    } catch (e) {}
                });
                this.musicNodes = {};
            }, 1000);
        }
    }

    /**
     * Change le volume général
     */
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Utils.clamp(volume, 0, 1);
        }
    }
}

// Instance globale
const audioSystem = new AudioSystem();
