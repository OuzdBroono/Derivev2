# Derive v2 🚀

Un jeu arcade spatial infini en 2D jouable dans le navigateur.

## 🎮 Gameplay

- Contrôlez un vaisseau spatial (souris/tactile/clavier)
- Naviguez dans un espace généré procéduralement
- Collectez de la "Poussière d'étoiles"
- Détruisez des astres ennemis
- Progressez à travers différents biomes visuels
- Achetez des upgrades entre les niveaux
- Maximisez votre score dans ce jeu sans fin !

## 🛠️ Stack Technique

- **Vanilla JavaScript** - Aucune dépendance externe
- **HTML5 Canvas** - Rendu 2D avec particules et parallaxe
- **Web Audio API** - Audio synthétisé style chiptune
- **PHP** - Backend pour le classement en ligne
- **JSON** - Base de données légère
- **localStorage** - Sauvegarde locale

## 📁 Structure du Projet

```
Derivev2/
├── index.html              # Page principale
├── src/
│   ├── js/                 # Code JavaScript modulaire
│   └── css/                # Styles
├── api/                    # Backend PHP
├── assets/                 # Ressources
└── docs/                   # Documentation
```

## 🚀 Lancement Rapide

### Option 1 : Double-clic (Standalone) ⚡
**Le plus simple !**
1. Télécharger/cloner le projet
2. Double-cliquer sur `index.html`
3. Jouer immédiatement !

✅ Tout fonctionne sauf le classement en ligne (score local uniquement)

### Option 2 : Avec Serveur (Classement en ligne) 🏆
```bash
git clone https://github.com/OuzdBroono/Derivev2.git
cd Derivev2
php -S localhost:8000
# Ouvrir http://localhost:8000
```

📖 **Plus de détails** : Voir [LAUNCH.md](LAUNCH.md)

## 🎯 Fonctionnalités

- ✨ Génération procédurale (textures, niveaux, audio)
- 🎨 Système de particules avancé
- 🎵 Musique et effets sonores synthétisés
- 🏆 Classement en ligne
- 💾 Sauvegarde automatique
- 📱 Responsive et compatible mobile
- 🌈 Biomes visuels variés

## 🎮 Contrôles

- **Souris** : Déplacer le vaisseau
- **Tactile** : Support mobile complet
- **Clavier** : Touches fléchées ou WASD

## 🏗️ Développement

Le jeu est conçu pour être auto-contenu et facilement déployable sur n'importe quel serveur PHP.

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails
