/**
 * Système de classement en ligne
 */

class LeaderboardSystem {
    constructor() {
        this.apiUrl = 'api/leaderboard.php';
        this.scores = [];
        this.maxScores = 50;
    }

    /**
     * Soumet un score au serveur
     */
    async submitScore(playerName, score, level, dust) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'submit',
                    name: playerName.trim(),
                    score: score,
                    level: level,
                    dust: dust,
                    timestamp: Date.now()
                })
            });

            const data = await response.json();

            if (data.success) {
                return { success: true, rank: data.rank };
            } else {
                console.error('Erreur soumission score:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            return { success: false, error: 'Erreur de connexion' };
        }
    }

    /**
     * Récupère les meilleurs scores
     */
    async fetchLeaderboard(limit = 20) {
        try {
            const response = await fetch(`${this.apiUrl}?action=get&limit=${limit}`);
            const data = await response.json();

            if (data.success) {
                this.scores = data.scores;
                return { success: true, scores: data.scores };
            } else {
                console.error('Erreur récupération classement:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            return { success: false, error: 'Erreur de connexion' };
        }
    }

    /**
     * Affiche le classement dans le DOM
     */
    displayLeaderboard(scores) {
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        if (!scores || scores.length === 0) {
            leaderboardList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-dim);">
                    Aucun score enregistré pour le moment.<br>
                    Soyez le premier !
                </div>
            `;
            return;
        }

        scores.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'leaderboard-entry';

            // Médailles pour le top 3
            let rankDisplay = `#${index + 1}`;
            if (index === 0) rankDisplay = '🥇';
            else if (index === 1) rankDisplay = '🥈';
            else if (index === 2) rankDisplay = '🥉';

            entryDiv.innerHTML = `
                <span class="leaderboard-rank">${rankDisplay}</span>
                <span class="leaderboard-name">${this.escapeHtml(entry.name)}</span>
                <span class="leaderboard-level" style="color: var(--text-dim); font-size: 0.9rem;">
                    Niv. ${entry.level}
                </span>
                <span class="leaderboard-score">${Utils.formatNumber(entry.score)}</span>
            `;

            leaderboardList.appendChild(entryDiv);
        });
    }

    /**
     * Échappe le HTML pour éviter les injections
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sauvegarde locale du meilleur score
     */
    saveLocalBest(score, level, dust) {
        const currentBest = Utils.load('bestScore', { score: 0, level: 0, dust: 0 });

        if (score > currentBest.score) {
            Utils.save('bestScore', { score, level, dust });
            return true;
        }

        return false;
    }

    /**
     * Récupère le meilleur score local
     */
    getLocalBest() {
        return Utils.load('bestScore', { score: 0, level: 0, dust: 0 });
    }
}
