# Guide de Contribution

Merci de votre intérêt pour Derive v2 ! 🚀

## 🛠️ Développement Local

### Prérequis
- PHP 7.4+ (pour le backend du classement)
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Un éditeur de code (VS Code recommandé)

### Installation

1. Cloner le repository
```bash
git clone https://github.com/OuzdBroono/Derivev2.git
cd Derivev2
```

2. Lancer un serveur local
```bash
php -S localhost:8000
```

3. Ouvrir dans le navigateur
```
http://localhost:8000
```

### Structure du Projet

```
Derivev2/
├── index.html              # Page principale
├── src/
│   ├── js/                 # Code JavaScript modulaire
│   │   ├── main.js        # Point d'entrée
│   │   ├── game.js        # Logique principale
│   │   ├── player.js      # Vaisseau joueur
│   │   ├── enemies.js     # Gestion ennemis
│   │   ├── renderer.js    # Moteur de rendu
│   │   ├── particles.js   # Système de particules
│   │   ├── audio.js       # Synthèse audio
│   │   ├── levels.js      # Système de niveaux
│   │   ├── shop.js        # Boutique
│   │   ├── leaderboard.js # Client classement
│   │   └── utils.js       # Utilitaires
│   └── css/
│       └── style.css      # Styles
├── api/
│   ├── leaderboard.php    # Backend PHP
│   └── scores.json        # Base de données
├── assets/
│   ├── audio/             # Sons (si nécessaire)
│   └── images/            # Images (si nécessaire)
└── docs/
    └── GAME_DESIGN.md     # Documentation game design
```

## 🎯 Directives de Contribution

### Code Style
- **JavaScript** : Standard ES6+
- **Indentation** : 4 espaces
- **Nommage** : camelCase pour variables/fonctions, PascalCase pour classes
- **Commentaires** : JSDoc pour les fonctions publiques

### Commits
Format : `type: description`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, pas de changement de code
- `refactor`: Refactorisation
- `test`: Ajout de tests
- `chore`: Maintenance

Exemple :
```
feat: add gravity cannon powerup
fix: collision detection with large enemies
docs: update game design document
```

### Pull Requests

1. Fork le projet
2. Créer une branche (`git checkout -b feat/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feat/amazing-feature`)
5. Ouvrir une Pull Request

## 🐛 Rapport de Bugs

Utiliser les GitHub Issues avec le template :

```markdown
**Description**
Description claire du bug

**Reproduction**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement Attendu**
Ce qui devrait se passer

**Screenshots**
Si applicable

**Environnement**
- OS: [ex: Windows 10]
- Navigateur: [ex: Chrome 120]
- Version: [ex: 2.0]
```

## 💡 Suggestions de Fonctionnalités

Les suggestions sont les bienvenues ! Ouvrir une Issue avec :
- Description détaillée
- Cas d'usage
- Mockups si possible

## 🧪 Tests

### Tests Manuels
1. Jouer une partie complète
2. Tester tous les upgrades
3. Vérifier le responsive
4. Tester sur mobile
5. Vérifier le classement

### Checklist Avant PR
- [ ] Code testé localement
- [ ] Pas d'erreurs console
- [ ] Performance maintenue (60 FPS)
- [ ] Responsive OK
- [ ] Documentation mise à jour

## 📝 Documentation

- Documenter les nouvelles fonctionnalités
- Mettre à jour GAME_DESIGN.md si nécessaire
- Ajouter des commentaires pour code complexe

## 🎨 Assets

### Audio
- Utiliser Web Audio API (synthèse)
- Pas de fichiers audio externes

### Visuels
- Rendu Canvas 2D
- Génération procédurale privilégiée
- Assets externes : SVG ou PNG optimisés

## ⚡ Performance

### Guidelines
- Maintenir 60 FPS minimum
- Limiter les allocations dans la game loop
- Utiliser object pooling si nécessaire
- Profiler avec Chrome DevTools

### Optimisations
- Pas de calculs lourds dans `update()`
- Réutiliser les objets
- Limiter le nombre d'entités
- Culling hors écran

## 🔐 Sécurité

### API Backend
- Valider toutes les entrées
- Échapper les sorties
- Rate limiting
- Anti-triche basique

### Client
- Pas de données sensibles
- Validation côté serveur
- XSS protection

## 📞 Contact

- GitHub Issues : Questions & Support
- Discussions : Idées & Feedback

## 📜 Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

---

Merci de rendre Derive v2 meilleur ! 🌟
