/**
 * ============================================================================
 * UTILITAIRES GLOBAUX
 * ============================================================================
 * Ce fichier contient des fonctions helper utilisées partout dans le jeu.
 * Ce sont des outils mathématiques et de gestion de données.
 *
 * Pour débutants : Ces fonctions sont comme une "boîte à outils" que tous
 * les autres fichiers peuvent utiliser pour faire des calculs courants.
 * ============================================================================
 */

const Utils = {
    /**
     * Génère un nombre décimal aléatoire entre min et max
     *
     * @param {number} minimum - La valeur minimale (incluse)
     * @param {number} maximum - La valeur maximale (incluse)
     * @returns {number} Un nombre aléatoire entre min et max
     *
     * Exemple : random(1, 10) peut donner 3.7, 8.2, 1.0, etc.
     * Utilité : Créer de la variation (vitesse ennemie, position spawn, etc.)
     */
    random(minimum, maximum) {
        // Math.random() donne un nombre entre 0 et 1
        // On le multiplie par la différence et on ajoute le minimum
        return Math.random() * (maximum - minimum) + minimum;
    },

    /**
     * Génère un nombre ENTIER aléatoire entre min et max
     *
     * @param {number} minimum - La valeur minimale (incluse)
     * @param {number} maximum - La valeur maximale (incluse)
     * @returns {number} Un entier aléatoire
     *
     * Exemple : randomInt(1, 6) simule un dé (1, 2, 3, 4, 5 ou 6)
     * Utilité : Choisir un type d'ennemi, un biome, etc.
     */
    randomInt(minimum, maximum) {
        // Math.floor() arrondit vers le bas (3.9 devient 3)
        // On ajoute 1 à max pour que celui-ci soit inclus
        return Math.floor(this.random(minimum, maximum + 1));
    },

    /**
     * Choisit un élément au hasard dans un tableau
     *
     * @param {Array} array - Le tableau d'éléments
     * @returns {*} Un élément aléatoire du tableau
     *
     * Exemple : randomChoice(['rouge', 'bleu', 'vert']) → 'bleu'
     * Utilité : Choisir une couleur, un son, un message aléatoire
     */
    randomChoice(array) {
        // Prend un index aléatoire entre 0 et la longueur du tableau
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Interpolation linéaire - Trouve une valeur entre deux nombres
     *
     * @param {number} start - Valeur de départ
     * @param {number} end - Valeur d'arrivée
     * @param {number} t - Progression (0 = start, 1 = end, 0.5 = milieu)
     * @returns {number} La valeur interpolée
     *
     * Exemple : lerp(0, 100, 0.5) = 50 (milieu entre 0 et 100)
     *           lerp(0, 100, 0.25) = 25 (25% du chemin)
     *
     * Utilité : Animations fluides, transitions de couleur, etc.
     */
    lerp(start, end, t) {
        // Formule : start + (différence × progression)
        return start + (end - start) * t;
    },

    /**
     * Restreint (clamp) une valeur entre un minimum et un maximum
     *
     * @param {number} value - La valeur à restreindre
     * @param {number} minimum - Le minimum autorisé
     * @param {number} maximum - Le maximum autorisé
     * @returns {number} La valeur restreinte
     *
     * Exemple : clamp(150, 0, 100) = 100 (trop haut, ramené à 100)
     *           clamp(-10, 0, 100) = 0 (trop bas, ramené à 0)
     *           clamp(50, 0, 100) = 50 (dans les limites, inchangé)
     *
     * Utilité : Garder le joueur dans l'écran, limiter la vitesse, etc.
     */
    clamp(value, minimum, maximum) {
        // Math.max() choisit le plus grand (garantit >= min)
        // Math.min() choisit le plus petit (garantit <= max)
        return Math.min(Math.max(value, minimum), maximum);
    },

    /**
     * Calcule la distance entre deux points en 2D
     *
     * @param {number} point1X - Position X du premier point
     * @param {number} point1Y - Position Y du premier point
     * @param {number} point2X - Position X du deuxième point
     * @param {number} point2Y - Position Y du deuxième point
     * @returns {number} La distance en pixels
     *
     * Utilise le théorème de Pythagore : distance = √(dx² + dy²)
     *
     * Exemple : distance(0, 0, 3, 4) = 5 (triangle 3-4-5)
     * Utilité : Détection de collision, calcul de portée, etc.
     */
    distance(point1X, point1Y, point2X, point2Y) {
        // Calcule les différences sur chaque axe
        const deltaX = point2X - point1X;  // Différence horizontale
        const deltaY = point2Y - point1Y;  // Différence verticale

        // Théorème de Pythagore
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },

    /**
     * Calcule l'angle entre deux points (en radians)
     *
     * @param {number} point1X - Position X du point de départ
     * @param {number} point1Y - Position Y du point de départ
     * @param {number} point2X - Position X du point cible
     * @param {number} point2Y - Position Y du point cible
     * @returns {number} L'angle en radians (-π à π)
     *
     * Note : 0 radians = droite, π/2 = bas, π = gauche, -π/2 = haut
     *
     * Utilité : Orienter le vaisseau vers la souris, tirer dans une direction
     */
    angle(point1X, point1Y, point2X, point2Y) {
        // Math.atan2() calcule l'angle depuis les différences X et Y
        // C'est mieux que atan() car ça gère tous les quadrants
        return Math.atan2(point2Y - point1Y, point2X - point1X);
    },

    /**
     * Vérifie si deux cercles se touchent (collision)
     *
     * @param {number} circle1X - Position X du premier cercle
     * @param {number} circle1Y - Position Y du premier cercle
     * @param {number} radius1 - Rayon du premier cercle
     * @param {number} circle2X - Position X du deuxième cercle
     * @param {number} circle2Y - Position Y du deuxième cercle
     * @param {number} radius2 - Rayon du deuxième cercle
     * @returns {boolean} true si collision, false sinon
     *
     * Principe : Deux cercles se touchent si leur distance est inférieure
     * à la somme de leurs rayons.
     *
     * Utilité : Détecter si un projectile touche un ennemi, si le joueur
     *           touche une étoile, etc.
     */
    circleCollision(circle1X, circle1Y, radius1, circle2X, circle2Y, radius2) {
        // Calcule la distance entre les centres
        const distanceBetweenCenters = this.distance(circle1X, circle1Y, circle2X, circle2Y);

        // Compare avec la somme des rayons
        return distanceBetweenCenters < radius1 + radius2;
    },

    /**
     * Génère une couleur au format HSL
     *
     * @param {number} hue - Teinte (0-360) : 0=rouge, 120=vert, 240=bleu
     * @param {number} saturation - Saturation (0-100) : 0=gris, 100=vif
     * @param {number} lightness - Luminosité (0-100) : 0=noir, 50=normal, 100=blanc
     * @returns {string} La couleur au format "hsl(h, s%, l%)"
     *
     * HSL est plus intuitif que RGB pour les jeux :
     * - Changer hue change la couleur
     * - Changer saturation rend plus/moins vif
     * - Changer lightness rend plus/moins clair
     *
     * Exemple : hsl(0, 100, 50) = rouge vif
     */
    hsl(hue, saturation, lightness) {
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },

    /**
     * Génère une couleur HSL avec transparence (alpha)
     *
     * @param {number} hue - Teinte (0-360)
     * @param {number} saturation - Saturation (0-100)
     * @param {number} lightness - Luminosité (0-100)
     * @param {number} alpha - Opacité (0-1) : 0=invisible, 1=opaque
     * @returns {string} La couleur au format "hsla(h, s%, l%, a)"
     *
     * Utilité : Effets de transparence, particules qui s'effacent, halos
     */
    hsla(hue, saturation, lightness, alpha) {
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    },

    /**
     * Convertit des degrés en radians
     *
     * @param {number} degrees - L'angle en degrés (0-360)
     * @returns {number} L'angle en radians (0-2π)
     *
     * Note : JavaScript utilise les radians pour les calculs trigonométriques
     * π radians = 180 degrés
     *
     * Exemple : toRadians(90) = π/2 ≈ 1.57
     */
    toRadians(degrees) {
        // Formule : radians = degrés × (π / 180)
        return degrees * Math.PI / 180;
    },

    /**
     * Convertit des radians en degrés
     *
     * @param {number} radians - L'angle en radians
     * @returns {number} L'angle en degrés
     *
     * Exemple : toDegrees(Math.PI) = 180
     */
    toDegrees(radians) {
        // Formule : degrés = radians × (180 / π)
        return radians * 180 / Math.PI;
    },

    /**
     * Génère un identifiant unique
     *
     * @returns {string} Un ID unique (ex: "1234567890-abc123xyz")
     *
     * Combine timestamp (millisec depuis 1970) + chaîne aléatoire
     * Utilité : Créer des IDs pour des entités, sessions, etc.
     */
    generateId() {
        // Date.now() = millisecondes depuis le 1er janvier 1970
        // .toString(36) convertit en base 36 (0-9 et a-z)
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Formate un nombre avec des espaces comme séparateurs de milliers
     *
     * @param {number} number - Le nombre à formater
     * @returns {string} Le nombre formaté (ex: "1 234 567")
     *
     * Exemple : formatNumber(1234567) = "1 234 567"
     * Utilité : Afficher les scores de façon lisible
     */
    formatNumber(number) {
        // Regex : \B = pas en début/fin, (?=(\d{3})+(?!\d)) = tous les 3 chiffres
        // Replace : remplace par un espace tous les 3 chiffres
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    /**
     * Sauvegarde des données dans le navigateur (localStorage)
     *
     * @param {string} key - La clé pour identifier les données
     * @param {*} data - Les données à sauvegarder (objet, nombre, etc.)
     * @returns {boolean} true si succès, false si erreur
     *
     * localStorage permet de sauvegarder des données même après avoir
     * fermé le navigateur. Les données persistent jusqu'à suppression manuelle.
     *
     * Utilité : Sauvegarder le meilleur score, les préférences, etc.
     */
    save(key, data) {
        try {
            // JSON.stringify convertit l'objet en texte
            // localStorage ne peut sauvegarder que du texte
            localStorage.setItem(key, JSON.stringify(data));
            return true;  // Succès
        } catch (error) {
            // Erreur possible : quota dépassé, mode privé, etc.
            console.error('Erreur de sauvegarde:', error);
            return false;  // Échec
        }
    },

    /**
     * Charge des données depuis le localStorage
     *
     * @param {string} key - La clé des données à charger
     * @param {*} defaultValue - Valeur par défaut si rien n'existe
     * @returns {*} Les données chargées ou la valeur par défaut
     *
     * Utilité : Récupérer le meilleur score sauvegardé, etc.
     */
    load(key, defaultValue = null) {
        try {
            // Récupère le texte sauvegardé
            const data = localStorage.getItem(key);

            // Si quelque chose existe, le convertit en objet JavaScript
            // Sinon retourne la valeur par défaut
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Erreur de chargement:', error);
            return defaultValue;
        }
    },

    /**
     * Supprime des données du localStorage
     *
     * @param {string} key - La clé des données à supprimer
     * @returns {boolean} true si succès, false si erreur
     *
     * Utilité : Réinitialiser le meilleur score, effacer des préférences
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erreur de suppression:', error);
            return false;
        }
    }
};

/**
 * ============================================================================
 * CLASSE VECTOR2D - Vecteurs en 2 Dimensions
 * ============================================================================
 * Un vecteur représente une direction et une magnitude (force).
 * Très utile pour gérer les déplacements, vitesses, accélérations.
 *
 * Pour débutants : Imaginez une flèche avec :
 * - x = déplacement horizontal (droite/gauche)
 * - y = déplacement vertical (haut/bas)
 *
 * Exemple : Vector2D(3, 4) = flèche allant 3 vers la droite et 4 vers le bas
 * ============================================================================
 */
class Vector2D {
    /**
     * Crée un nouveau vecteur 2D
     *
     * @param {number} positionX - Composante horizontale
     * @param {number} positionY - Composante verticale
     */
    constructor(positionX = 0, positionY = 0) {
        this.x = positionX;  // Position ou direction horizontale
        this.y = positionY;  // Position ou direction verticale
    }

    /**
     * Ajoute un autre vecteur à celui-ci
     *
     * @param {Vector2D} vector - Le vecteur à ajouter
     * @returns {Vector2D} Ce vecteur (modifié)
     *
     * Exemple : (3, 4) + (1, 2) = (4, 6)
     * Utilité : Ajouter une vitesse à une position
     */
    add(vector) {
        this.x += vector.x;  // Additionne les composantes X
        this.y += vector.y;  // Additionne les composantes Y
        return this;  // Retourne lui-même pour pouvoir chaîner les méthodes
    }

    /**
     * Soustrait un autre vecteur de celui-ci
     *
     * @param {Vector2D} vector - Le vecteur à soustraire
     * @returns {Vector2D} Ce vecteur (modifié)
     *
     * Exemple : (5, 6) - (2, 3) = (3, 3)
     * Utilité : Calculer une direction entre deux points
     */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * Multiplie le vecteur par un nombre (scalaire)
     *
     * @param {number} scalar - Le nombre multiplicateur
     * @returns {Vector2D} Ce vecteur (modifié)
     *
     * Exemple : (3, 4) × 2 = (6, 8)
     * Utilité : Augmenter/diminuer une vitesse
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Divise le vecteur par un nombre
     *
     * @param {number} scalar - Le nombre diviseur
     * @returns {Vector2D} Ce vecteur (modifié)
     *
     * Note : Évite la division par zéro
     */
    divide(scalar) {
        // Vérifie qu'on ne divise pas par zéro (erreur mathématique)
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }

    /**
     * Calcule la magnitude (longueur) du vecteur
     *
     * @returns {number} La longueur du vecteur
     *
     * Utilise Pythagore : longueur = √(x² + y²)
     *
     * Exemple : magnitude de (3, 4) = 5
     * Utilité : Calculer la vitesse réelle, la distance
     */
    magnitude() {
        // √(x² + y²)
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalise le vecteur (le rend de longueur 1)
     *
     * @returns {Vector2D} Ce vecteur (modifié)
     *
     * Un vecteur normalisé garde sa direction mais a une longueur de 1.
     * Utilité : Créer une direction pure (sans vitesse)
     */
    normalize() {
        const mag = this.magnitude();  // Calcule la longueur actuelle

        // Si longueur > 0, divise par la longueur pour obtenir 1
        if (mag > 0) {
            this.divide(mag);
        }
        return this;
    }

    /**
     * Limite la magnitude du vecteur à un maximum
     *
     * @param {number} maximum - La longueur maximale
     * @returns {Vector2D} Ce vecteur (modifié)
     *
     * Si le vecteur est trop long, le réduit au maximum.
     * Utilité : Limiter la vitesse maximale du joueur
     */
    limit(maximum) {
        const mag = this.magnitude();

        // Si trop long, normalise puis multiplie par le max
        if (mag > maximum) {
            this.normalize().multiply(maximum);
        }
        return this;
    }

    /**
     * Crée une copie de ce vecteur
     *
     * @returns {Vector2D} Un nouveau vecteur avec les mêmes valeurs
     *
     * Important : Sans copy(), deux variables pointent vers le même objet !
     */
    copy() {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Calcule la distance entre deux vecteurs (méthode statique)
     *
     * @param {Vector2D} vector1 - Premier vecteur
     * @param {Vector2D} vector2 - Deuxième vecteur
     * @returns {number} La distance entre les deux
     *
     * Statique = s'appelle sur la classe, pas sur une instance
     * Exemple : Vector2D.distance(v1, v2)
     */
    static distance(vector1, vector2) {
        const deltaX = vector2.x - vector1.x;
        const deltaY = vector2.y - vector1.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
}
