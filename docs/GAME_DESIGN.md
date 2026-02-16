# Derive v2 - Document de Game Design

## 🎯 Vision

Derive v2 est un jeu arcade spatial infini en 2D conçu pour offrir une expérience de jeu accessible, addictive et visuellement captivante directement dans le navigateur. Le joueur incarne un vaisseau spatial naviguant dans un cosmos généré procéduralement, collectant des ressources et combattant des ennemis dans une quête sans fin pour le meilleur score.

## 🎮 Gameplay Core Loop

### Boucle Principale
1. **Explorer** - Naviguer dans l'espace
2. **Combattre** - Détruire des astres ennemis
3. **Collecter** - Ramasser la Poussière d'étoiles
4. **Progresser** - Atteindre le prochain niveau
5. **Améliorer** - Acheter des upgrades
6. **Répéter** - Recommencer avec plus de difficulté

### Objectifs
- **Court terme** : Survivre et atteindre le prochain niveau
- **Moyen terme** : Accumuler de la Poussière d'étoiles pour les upgrades
- **Long terme** : Maximiser son score et grimper dans le classement

## 🚀 Mécaniques de Jeu

### Contrôles
- **Souris/Tactile** : Le vaisseau suit le curseur/doigt
- **Clic/Tap** : Tir de projectiles
- **Espace** : Tir alternatif (clavier)
- **Échap** : Pause

### Physique
- Mouvement avec accélération et inertie
- Friction pour un contrôle fluide
- Vitesse maximale configurable
- Collisions circulaires (optimisé)

### Combat
- **Tir** : Projectiles énergétiques avec cooldown
- **Ennemis** : 3 types (small, medium, large)
- **Dégâts** : Système de points de vie
- **Mort** : Une seule vie, Game Over définitif

### Économie
- **Poussière d'étoiles** : Monnaie du jeu
- **Sources** :
  - Destruction d'ennemis
  - Collecte d'étoiles flottantes
- **Utilisation** : Boutique entre les niveaux

## 📊 Progression

### Système de Niveaux
- **Passage de niveau** : 20 ennemis vaincus + 5 par niveau
- **Difficulté croissante** :
  - +20% HP ennemis par niveau
  - +15% de difficulté générale par niveau
  - Spawn plus rapide
- **Biomes** : Changent tous les 3 niveaux

### Biomes
1. **Nébuleuse Bleue** (Niv. 1-3) - Bleu/Cyan
2. **Zone Pourpre** (Niv. 4-6) - Violet/Magenta
3. **Secteur Émeraude** (Niv. 7-9) - Vert/Turquoise
4. **Rift Ambré** (Niv. 10-12) - Orange/Jaune
5. **Abysse Cramoisi** (Niv. 13-15) - Rouge/Rose
6. **Vide Cosmique** (Niv. 16+) - Bleu foncé/Violet

## 🛒 Boutique

### Items Disponibles

| Item | Coût | Type | Effet |
|------|------|------|-------|
| Bouclier Énergétique | 10⭐ | Upgrade | Absorbe 1 attaque (15s) |
| Tir Rapide | 15⭐ | Upgrade | Cadence x2 (15s) |
| Réparation | 8⭐ | Consommable | +50 HP |
| Surcharge Offensive | 20⭐ | Upgrade | Dégâts x2 (niveau entier) |
| Propulseurs Améliorés | 12⭐ | Upgrade | Vitesse +50% |
| Aimant à Poussière | 25⭐ | Upgrade | Collecte auto (20s) |

### Règles
- Boutique accessible après chaque niveau
- Upgrades temporaires uniques par session
- Consommables achetables plusieurs fois
- Pas de progression persistante (roguelike)

## 👾 Ennemis

### Types

#### Small Aster
- **HP** : 20 × multiplicateur niveau
- **Vitesse** : 100 + 10/niv
- **Dégâts** : 10
- **Récompenses** : 10 pts, 1 poussière

#### Medium Aster
- **HP** : 50 × multiplicateur niveau
- **Vitesse** : 70 + 5/niv
- **Dégâts** : 20
- **Récompenses** : 25 pts, 3 poussière

#### Large Aster
- **HP** : 100 × multiplicateur niveau
- **Vitesse** : 50 + 3/niv
- **Dégâts** : 30
- **Récompenses** : 50 pts, 5 poussière
- **Spécial** : Barre de vie visible

### Comportement
- Spawn aléatoire sur les bords
- Mouvement linéaire avec rebond
- Pas d'IA (simplicité arcade)
- Rotation visuelle

## 🎨 Direction Artistique

### Palette
- **Fond** : Dégradés sombres (#0a0a1a)
- **Primaire** : Bleu (#6366f1)
- **Secondaire** : Violet (#a855f7)
- **Accent** : Rose (#ec4899)
- **Particules** : Couleurs vives saturées

### Style Visuel
- Esthétique néon/synthwave
- Particules abondantes
- Lueurs et halos
- Minimalisme géométrique
- Parallaxe subtile

### Effets
- **Particules** : Explosions, traînées, étincelles
- **Screen Shake** : Sur impacts
- **Flash** : Dégâts ennemis
- **Glow** : Éléments importants

## 🎵 Audio

### Système
- **Web Audio API** : Synthèse procédurale
- **Style** : Chiptune/Arcade
- **Pas de fichiers** : Tout généré en temps réel

### Sons
- **Tir** : Bip laser court
- **Explosion** : Bruit blanc filtré
- **Collecte** : Montée de tonalité
- **Hit** : Tonalité descendante grave
- **Level Up** : Arpège ascendant

### Musique
- Drone ambient généré
- Change avec les biomes
- Harmonies procédurales
- Volume maîtrisé (0.3)

## 📱 Responsive & Mobile

### Optimisations
- Canvas fullscreen adaptatif
- Touch controls natifs
- Safe area pour notches
- Performance 60 FPS minimum
- Pas de scroll parasite

### Support
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablette
- ✅ Landscape/Portrait

## 🏆 Système de Score

### Calcul
```
Score = Ennemis vaincus × Valeur × Niveau
```

### Classement
- Top 100 sauvegardés
- Affichage Top 20
- Médailles pour Top 3
- Anti-triche basique (validation serveur)

### Sauvegarde
- **Locale** : localStorage pour meilleur personnel
- **Globale** : PHP/JSON pour classement en ligne

## 🔧 Aspects Techniques

### Architecture
- **Vanilla JS** : Aucune dépendance
- **Modulaire** : Fichiers séparés par responsabilité
- **Canvas 2D** : Rendu optimisé
- **60 FPS** : DeltaTime pour fluidité

### Optimisations
- Object pooling (particules)
- Limite max entités
- Culling hors écran
- RequestAnimationFrame
- Pas de fuites mémoire

### Sauvegarde
- Progression : localStorage
- Meilleur score : localStorage + serveur
- Pas de compte utilisateur (friction minimale)

## 🎯 Principes de Design

### Accessibilité
- **Facile à apprendre** : Tutorial implicite
- **Difficile à maîtriser** : Skill ceiling élevé
- **Instant Play** : Pas de setup
- **Quick Sessions** : Parties de 5-15 min

### Retention
- **One More Run** : Restart rapide
- **Progression visible** : Niveaux, score
- **Récompenses** : Upgrades satisfaisants
- **Compétition** : Classement

### Polish
- Feedback visuel immédiat
- Juiciness (particules, shake, sons)
- Animations fluides
- UI claire et lisible

## 🚧 Évolutions Futures

### v2.1
- [ ] Nouveaux types d'ennemis
- [ ] Boss de fin de biome
- [ ] Power-ups temporaires in-game
- [ ] Achievements

### v2.2
- [ ] Modes de jeu alternatifs
- [ ] Vaisseaux déblocables
- [ ] Daily challenges
- [ ] Replay system

### v3.0
- [ ] Multijoueur coopératif
- [ ] Classements par période
- [ ] Système de guildes
- [ ] Customisation avancée

## 📝 Notes de Production

### Développement
- Solo dev friendly
- Itération rapide
- Test navigateur direct
- Pas de build step

### Déploiement
- Serveur PHP minimal
- Hébergement simple
- CDN optionnel
- Aucune dépendance externe

### Maintenance
- Code documenté
- Architecture claire
- Logs d'erreurs
- Analytics basiques

---

**Version** : 2.0
**Date** : Février 2026
**Auteur** : OuzdBroono
**Licence** : MIT
