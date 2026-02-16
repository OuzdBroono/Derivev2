# 📊 Système de Score - Guide Complet

## 🎯 Comment Fonctionne le Score

### Formule Générale
```
Score Total = Somme de (Valeur Ennemi × Niveau Actuel)
```

**Exemple** :
- Vous détruisez un Small Aster au niveau 1 → **10 points**
- Vous détruisez un Small Aster au niveau 5 → **50 points** (10 × 5)
- Vous détruisez un Large Aster au niveau 10 → **500 points** (50 × 10)

> 💡 **Astuce** : Plus vous survivez longtemps et montez en niveau, plus chaque ennemi rapporte de points !

---

## 👾 Tableau des Ennemis

### Small Aster (Petit Astre) 🔵

| Propriété | Valeur de Base | Calcul par Niveau |
|-----------|----------------|-------------------|
| **Points de Vie** | 20 HP | 20 × (1 + (niveau - 1) × 0.2) |
| **Vitesse** | 100 px/s | 100 + (niveau × 10) |
| **Dégâts au contact** | 10 HP | 10 (fixe) |
| **Score gagné** | 10 pts | 10 × niveau actuel |
| **Poussière gagnée** | 1 ⭐ | 1 (fixe) |
| **Taille** | 15 px | 15 (fixe) |
| **Couleur** | Cyan | HSL(180, 70%, 50%) |

**Exemple niveau 5** :
- HP: 36 (20 × 1.8)
- Vitesse: 150 px/s
- Score: 50 points
- Poussière: 1 ⭐

---

### Medium Aster (Astre Moyen) 🟣

| Propriété | Valeur de Base | Calcul par Niveau |
|-----------|----------------|-------------------|
| **Points de Vie** | 50 HP | 50 × (1 + (niveau - 1) × 0.2) |
| **Vitesse** | 70 px/s | 70 + (niveau × 5) |
| **Dégâts au contact** | 20 HP | 20 (fixe) |
| **Score gagné** | 25 pts | 25 × niveau actuel |
| **Poussière gagnée** | 3 ⭐ | 3 (fixe) |
| **Taille** | 25 px | 25 (fixe) |
| **Couleur** | Violet | HSL(280, 70%, 50%) |

**Exemple niveau 5** :
- HP: 90 (50 × 1.8)
- Vitesse: 95 px/s
- Score: 125 points
- Poussière: 3 ⭐

---

### Large Aster (Grand Astre) 🔴

| Propriété | Valeur de Base | Calcul par Niveau |
|-----------|----------------|-------------------|
| **Points de Vie** | 100 HP | 100 × (1 + (niveau - 1) × 0.2) |
| **Vitesse** | 50 px/s | 50 + (niveau × 3) |
| **Dégâts au contact** | 30 HP | 30 (fixe) |
| **Score gagné** | 50 pts | 50 × niveau actuel |
| **Poussière gagnée** | 5 ⭐ | 5 (fixe) |
| **Taille** | 40 px | 40 (fixe) |
| **Couleur** | Rouge | HSL(0, 70%, 50%) |
| **Spécial** | ❤️ Barre de vie visible | - |

**Exemple niveau 5** :
- HP: 180 (100 × 1.8)
- Vitesse: 65 px/s
- Score: 250 points
- Poussière: 5 ⭐

---

## ⭐ Poussière d'Étoiles (Monnaie du Jeu)

### Sources de Poussière

| Source | Quantité | Comment |
|--------|----------|---------|
| **Small Aster détruit** | 1 ⭐ | Détruire un petit astre |
| **Medium Aster détruit** | 3 ⭐ | Détruire un astre moyen |
| **Large Aster détruit** | 5 ⭐ | Détruire un grand astre |
| **Étoiles flottantes** | 1 ⭐ | Collecter l'étoile dorée |

### Étoiles Collectibles ✨

Quand vous détruisez un ennemi, des étoiles dorées apparaissent :
- **Durée de vie** : 10 secondes
- **Rayon de collecte** : 2× votre vaisseau
- **Animation** : Pulse et rotation
- **Quantité** : Égale à la poussière de l'ennemi

**Exemple** : Détruire un Large Aster crée 5 étoiles à collecter

---

## 📈 Progression de Niveau

### Conditions pour Monter de Niveau

| Niveau | Ennemis à Tuer | Cumul Total |
|--------|----------------|-------------|
| 1 → 2 | 20 ennemis | 20 |
| 2 → 3 | 25 ennemis | 45 |
| 3 → 4 | 30 ennemis | 75 |
| 4 → 5 | 35 ennemis | 110 |
| 5 → 6 | 40 ennemis | 150 |

**Formule** : 20 + (niveau - 1) × 5 ennemis

### Difficulté par Niveau

Chaque niveau augmente la difficulté :

| Niveau | Multiplicateur HP | Difficulté Globale | Intervalle Spawn |
|--------|-------------------|-------------------|------------------|
| 1 | ×1.0 | 100% | 2.0s |
| 2 | ×1.2 | 115% | 1.9s |
| 3 | ×1.4 | 130% | 1.8s |
| 5 | ×1.8 | 160% | 1.6s |
| 10 | ×2.8 | 235% | 1.1s |
| 20 | ×4.8 | 385% | 0.5s |

**Formules** :
- HP Multiplicateur : `1 + (niveau - 1) × 0.2`
- Difficulté : `1 + (niveau - 1) × 0.15`
- Spawn : `max(0.5s, 2.0s - niveau × 0.1s)`

---

## 🛒 Utilisation de la Poussière (Boutique)

### Prix des Items

| Item | Coût | Type | Effet |
|------|------|------|-------|
| 🛡️ **Bouclier Énergétique** | 10 ⭐ | Upgrade | Absorbe 1 attaque pendant 15s |
| ⚡ **Tir Rapide** | 15 ⭐ | Upgrade | Cadence de tir ×2 pendant 15s |
| ❤️ **Réparation** | 8 ⭐ | Consommable | Restaure 50 HP immédiatement |
| 💥 **Surcharge Offensive** | 20 ⭐ | Upgrade | Dégâts ×2 pour tout le niveau |
| 🚀 **Propulseurs Améliorés** | 12 ⭐ | Upgrade | Vitesse +50% pour le niveau |
| 🧲 **Aimant à Poussière** | 25 ⭐ | Upgrade | Collecte auto pendant 20s |

### Rentabilité des Achats

**Pour acheter un Bouclier (10 ⭐)** :
- Détruire 10 Small Asters
- OU 4 Medium Asters (12 ⭐)
- OU 2 Large Asters (10 ⭐)

**Pour acheter un Aimant (25 ⭐)** :
- Détruire 25 Small Asters
- OU 9 Medium Asters (27 ⭐)
- OU 5 Large Asters (25 ⭐)

---

## 🎮 Statistiques du Joueur

### Vaisseau (Vous)

| Propriété | Valeur |
|-----------|--------|
| **HP Maximum** | 100 |
| **Vitesse Max** | 300 px/s |
| **Accélération** | 800 px/s² |
| **Friction** | 95% par frame |
| **Taille (rayon)** | 20 px |
| **Cadence de tir** | 1 tir / 0.2s (5 tirs/s) |
| **Dégâts par tir** | 20 HP |

### Projectiles

| Propriété | Valeur |
|-----------|--------|
| **Vitesse** | 600 px/s |
| **Taille** | 4 px |
| **Dégâts** | 20 HP (×2 avec Surcharge) |
| **Durée de vie** | 2 secondes |
| **Couleur** | Bleu clair (#818cf8) |

---

## 📊 Exemples de Parties

### Partie Débutant (Niveau 1-3)

**Niveau 1 :**
- 15 Small Asters tués → 150 points, 15 ⭐
- 5 Medium Asters tués → 125 points, 15 ⭐
- **Total Niveau 1** : 275 points, 30 ⭐

**Niveau 2 :**
- 20 Small Asters → 400 points, 20 ⭐
- 5 Medium Asters → 250 points, 15 ⭐
- **Total Niveau 2** : 650 points, 35 ⭐

**Achat boutique** : Bouclier (10 ⭐) + Tir Rapide (15 ⭐) = 25 ⭐
**Poussière restante** : 40 ⭐

**Niveau 3 :**
- 25 Small Asters → 750 points, 25 ⭐
- 5 Large Asters → 750 points, 25 ⭐
- **Total Niveau 3** : 1500 points, 50 ⭐

**Score Total** : 2425 points

---

### Partie Avancée (Niveau 10)

Au niveau 10, les ennemis valent beaucoup plus :

| Ennemi | Score | Poussière |
|--------|-------|-----------|
| Small Aster | 100 pts | 1 ⭐ |
| Medium Aster | 250 pts | 3 ⭐ |
| Large Aster | 500 pts | 5 ⭐ |

**Pour passer le niveau 10** (65 ennemis requis) :
- Mix optimal : 40 Small + 20 Medium + 5 Large
- **Score** : 4000 + 5000 + 2500 = **11,500 points**
- **Poussière** : 40 + 60 + 25 = **125 ⭐**

Assez pour acheter tous les upgrades ! 🎉

---

## 🏆 Records et Objectifs

### Objectifs de Score

| Rang | Score | Description |
|------|-------|-------------|
| 🥉 **Débutant** | 1,000 | Atteindre niveau 3 |
| 🥈 **Intermédiaire** | 5,000 | Atteindre niveau 6 |
| 🥇 **Avancé** | 20,000 | Atteindre niveau 10 |
| 💎 **Expert** | 50,000 | Atteindre niveau 15 |
| 👑 **Maître** | 100,000+ | Atteindre niveau 20+ |

### Stratégies pour Maximiser le Score

1. **Survivre longtemps** : Plus le niveau est élevé, plus les points s'accumulent vite
2. **Prioriser les Large Asters** : 50 points × niveau (vs 10 pour Small)
3. **Collecter toute la poussière** : Pour acheter des upgrades de survie
4. **Achats stratégiques** :
   - Niveau 1-3 : Bouclier (survie)
   - Niveau 4-6 : Tir Rapide (efficacité)
   - Niveau 7+ : Surcharge Offensive (maximum de dégâts)

---

## 💡 Astuces pour Débutants

### Maximiser la Poussière
- ✅ Collectez **toutes** les étoiles qui apparaissent
- ✅ Elles disparaissent après 10s, restez proche !
- ✅ Avec l'Aimant, elles viennent à vous automatiquement

### Optimiser le Score
- ✅ Ne pas mourir tôt ! Survivre = niveaux élevés = plus de points
- ✅ Les 5 premiers niveaux sont les plus faciles pour accumuler de la poussière
- ✅ Au niveau 10+, chaque ennemi vaut 10× plus qu'au niveau 1

### Gestion de la Boutique
- ✅ **Niveau 1** : Économiser pour Bouclier + Tir Rapide
- ✅ **Niveau 2-3** : Acheter la Surcharge si assez de poussière
- ✅ **Niveau 4+** : Réparation si < 50 HP, sinon Aimant
- ✅ **Consommables** : Achetables plusieurs fois, très utiles !

---

## 📈 Calculs Avancés

### Temps de Jeu Moyen par Niveau

| Niveau | Ennemis | Temps Estimé | Score Moyen |
|--------|---------|--------------|-------------|
| 1 | 20 | 40s | 300 |
| 2 | 25 | 48s | 650 |
| 3 | 30 | 54s | 1,200 |
| 5 | 40 | 64s | 3,000 |
| 10 | 65 | 90s | 15,000 |

### Score Maximum Théorique

Si vous tuez **uniquement** des Large Asters :

**Niveau 1-10** (total ~450 ennemis) :
```
Score = 50 × (1 + 2 + 3 + ... + 10) × 450/10
Score ≈ 123,750 points
```

**Mais** : Impossible car spawn aléatoire ! 😄

---

## 🎯 Résumé Rapide

| Concept | Valeur |
|---------|--------|
| **Small Aster** | 10 pts/niveau, 1 ⭐ |
| **Medium Aster** | 25 pts/niveau, 3 ⭐ |
| **Large Aster** | 50 pts/niveau, 5 ⭐ |
| **Monter de niveau** | +5 ennemis requis par niveau |
| **HP ennemis** | +20% par niveau |
| **Item le moins cher** | 8 ⭐ (Réparation) |
| **Item le plus cher** | 25 ⭐ (Aimant) |

---

**Bonne chance et bon voyage dans le cosmos ! 🚀✨**
