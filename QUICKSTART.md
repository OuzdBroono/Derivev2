# 🚀 Démarrage Rapide - Derive v2

## Installation Express (5 minutes)

### Option 1 : Serveur PHP (Recommandé)

```bash
# Cloner le projet
git clone https://github.com/OuzdBroono/Derivev2.git
cd Derivev2

# Lancer le serveur
php -S localhost:8000

# Ouvrir dans le navigateur
# → http://localhost:8000
```

### Option 2 : Python

```bash
# Python 3
python -m http.server 8000

# Ouvrir dans le navigateur
# → http://localhost:8000
```

⚠️ **Note** : Le classement en ligne ne fonctionnera qu'avec PHP !

### Option 3 : VS Code Live Server

1. Installer l'extension "Live Server"
2. Clic droit sur `index.html`
3. Sélectionner "Open with Live Server"

### Option 4 : Node.js

```bash
# Installer http-server globalement
npm install -g http-server

# Lancer
http-server -p 8000

# Ouvrir dans le navigateur
# → http://localhost:8000
```

## 🎮 Premiers Pas

1. **Cliquer sur "Commencer"** pour lancer une partie
2. **Déplacer la souris** pour contrôler le vaisseau
3. **Cliquer** pour tirer
4. **Détruire les astres** pour gagner des points
5. **Collecter les étoiles** pour obtenir de la Poussière
6. **Acheter des upgrades** dans la boutique entre les niveaux

## 🎯 Objectif

Survivre le plus longtemps possible et obtenir le meilleur score !

## ⌨️ Contrôles

| Action | Commande |
|--------|----------|
| Déplacer | Souris / Tactile |
| Tirer | Clic / Espace |
| Pause | Échap |

## 🏗️ Structure du Projet

```
Derivev2/
├── index.html              # 🏠 Page principale
├── src/
│   ├── js/                 # 📜 Code JavaScript
│   │   ├── main.js         # Point d'entrée
│   │   ├── game.js         # Logique du jeu
│   │   ├── player.js       # Vaisseau
│   │   ├── enemies.js      # Ennemis
│   │   ├── renderer.js     # Rendu
│   │   ├── particles.js    # Effets visuels
│   │   ├── audio.js        # Sons
│   │   ├── levels.js       # Niveaux
│   │   ├── shop.js         # Boutique
│   │   ├── leaderboard.js  # Classement
│   │   └── utils.js        # Utilitaires
│   └── css/
│       └── style.css       # 🎨 Styles
├── api/
│   ├── leaderboard.php     # 🔧 Backend
│   └── scores.json         # 💾 Base de données
├── assets/                 # 🖼️ Ressources
├── docs/
│   └── GAME_DESIGN.md      # 📖 Documentation
└── README.md               # 📝 Readme
```

## 🐛 Résolution de Problèmes

### Le jeu ne se charge pas
- Vérifier la console (F12)
- S'assurer qu'un serveur est lancé
- Tester avec un autre navigateur

### Pas de son
- Cliquer sur la page pour activer l'audio
- Vérifier que le son n'est pas coupé
- Certains navigateurs bloquent l'autoplay

### Le classement ne fonctionne pas
- Vérifier que PHP est installé et lancé
- Vérifier les permissions de `api/scores.json`
```bash
chmod 666 api/scores.json
chmod 755 api/
```

### Performance faible
- Fermer les autres onglets
- Désactiver les extensions de navigateur
- Tester sur un autre navigateur (Chrome recommandé)

## 🔧 Configuration Serveur de Production

### Apache

```apache
# .htaccess dans le dossier api/
<Files "scores.json">
    Order Allow,Deny
    Deny from all
</Files>

# Activer CORS si nécessaire
Header set Access-Control-Allow-Origin "*"
```

### Nginx

```nginx
location /api/ {
    location ~ \.json$ {
        deny all;
        return 404;
    }
}
```

### Permissions Recommandées

```bash
# Fichiers
find . -type f -exec chmod 644 {} \;

# Dossiers
find . -type d -exec chmod 755 {} \;

# API (lecture/écriture pour PHP)
chmod 666 api/scores.json
chmod 755 api/
```

## 📊 Base de Données

Le jeu utilise un simple fichier JSON pour le classement :

```json
[
    {
        "name": "Player1",
        "score": 1000,
        "level": 5,
        "dust": 50,
        "timestamp": 1234567890
    }
]
```

### Réinitialiser le Classement

```bash
echo "[]" > api/scores.json
```

## 🚀 Déploiement

### Hébergement Gratuit

**Netlify / Vercel** (Frontend uniquement)
```bash
# Le classement ne fonctionnera pas sans backend PHP
netlify deploy --prod
```

**Heroku** (avec PHP)
```bash
# Créer Procfile
echo "web: php -S 0.0.0.0:\$PORT" > Procfile

# Déployer
git push heroku main
```

**Hébergement PHP classique**
- Upload via FTP
- S'assurer que PHP 7.4+ est disponible
- Configurer les permissions

## 📚 Ressources

- [README.md](README.md) - Vue d'ensemble du projet
- [GAME_DESIGN.md](docs/GAME_DESIGN.md) - Documentation complète
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution
- [GitHub Issues](https://github.com/OuzdBroono/Derivev2/issues) - Support & Bugs

## 🎮 Conseils de Jeu

### Débutant
- Restez au centre de l'écran
- Concentrez-vous sur les petits ennemis
- Achetez le bouclier en priorité

### Intermédiaire
- Anticipez les mouvements ennemis
- Gérez votre poussière pour les bons upgrades
- Utilisez les bords pour esquiver

### Avancé
- Combinez les upgrades stratégiquement
- Maîtrisez le timing de tir
- Maximisez la collecte de poussière

## 🏆 Atteindre le Top

1. **Survivre longtemps** - Plus de niveaux = plus de points
2. **Tuer efficacement** - Chaque ennemi compte
3. **Collecter tout** - La poussière = des upgrades
4. **Upgrades intelligents** - Priorisez survie puis dégâts
5. **Pratiquer** - La maîtrise vient avec le temps

---

**Bon voyage dans le cosmos ! 🌌**

Des questions ? → [GitHub Issues](https://github.com/OuzdBroono/Derivev2/issues)
