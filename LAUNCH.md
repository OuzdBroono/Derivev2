# 🚀 Comment Lancer le Jeu

## Option 1 : Double-clic sur index.html (Standalone)

**Le plus simple - Fonctionne immédiatement !**

1. Ouvrir le dossier `Derivev2`
2. Double-cliquer sur `index.html`
3. Le jeu s'ouvre dans votre navigateur par défaut

### Fonctionnalités en mode standalone :
- ✅ Jeu complet fonctionnel
- ✅ Tous les sons et effets
- ✅ Système de progression
- ✅ Boutique d'upgrades
- ✅ Sauvegarde du meilleur score local
- ⚠️ **Pas de classement en ligne** (localStorage uniquement)

### Note importante :
Le classement affichera uniquement votre meilleur score personnel. Pour le classement en ligne partagé, utilisez l'Option 2.

---

## Option 2 : Avec Serveur PHP (Classement en ligne)

**Pour activer le classement en ligne entre joueurs**

### Méthode A : PHP Built-in Server
```bash
php -S localhost:8000
```
Puis ouvrir : http://localhost:8000

### Méthode B : npm
```bash
npm start
```
Puis ouvrir : http://localhost:8000

### Méthode C : Python (pas de classement)
```bash
python -m http.server 8000
```
⚠️ Le classement ne fonctionnera pas avec Python (PHP requis)

---

## 🎮 Contrôles

- **Souris** : Déplacer le vaisseau
- **Clic** : Tirer
- **Espace** : Tirer (alternatif)
- **Échap** : Pause

---

## 📱 Sur Mobile/Tablette

1. Transférer le dossier sur votre appareil
2. Ouvrir `index.html` avec votre navigateur mobile
3. Contrôles tactiles automatiques

---

## 🔧 Dépannage

### Le jeu ne se charge pas
- Vérifier la console (F12) pour les erreurs
- S'assurer que tous les fichiers sont présents
- Essayer un autre navigateur (Chrome recommandé)

### Pas de son
- Cliquer sur la page pour activer l'audio
- Vérifier que le son n'est pas coupé
- Certains navigateurs bloquent l'autoplay audio

### Le classement ne fonctionne pas
- **En mode standalone** : C'est normal, seul le score local est sauvegardé
- **Avec serveur** : Vérifier que PHP 7.4+ est installé
- Vérifier les permissions de `api/scores.json` (chmod 666)

---

## ✨ Astuce

Pour une expérience optimale avec classement en ligne :
```bash
cd Derivev2
php -S localhost:8000
```

Sinon, double-cliquez simplement sur `index.html` pour jouer hors ligne ! 🎮
