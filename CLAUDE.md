# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (requires PHP 7.4+ for leaderboard)
php -S localhost:8000
# OR
npm start

# Alternative (no leaderboard functionality)
npm run serve

# Reset leaderboard
echo "[]" > api/scores.json
```

## Architecture Overview

This is a self-contained browser-based arcade game with **zero external dependencies**. All JavaScript is vanilla ES6+, all audio is synthesized via Web Audio API, and all visuals are procedurally generated on Canvas 2D.

### Core Game Loop Architecture

The game follows a classic entity-component-system pattern centered around `Game` class in `game.js`:

1. **Main Game Loop** (`game.js` → `update()`)
   - Uses `requestAnimationFrame` with deltaTime for frame-independent movement
   - State machine: `'menu'` → `'playing'` → `'shop'` → `'playing'` → `'gameover'`
   - All updates flow through this single loop when `state === 'playing'`

2. **System Orchestration**
   - `Game` class aggregates and coordinates all systems:
     - `Player` - single instance created on game start
     - `EnemyManager` - spawns/manages all Enemy instances + Star collectibles
     - `ParticleSystem` - pooled particles for effects
     - `LevelSystem` - tracks progression, generates biomes
     - `ShopSystem` - manages purchases between levels
     - `Renderer` - all Canvas drawing operations
     - `StarField` - parallax background

3. **Collision Detection** (`game.js` → `checkCollisions()`)
   - Projectiles vs Enemies → awards score/dust, spawns Stars
   - Player vs Enemies → damage player, trigger shake
   - Player vs Stars → collect dust
   - All use `Utils.circleCollision()` helper

4. **Level Progression Flow**
   ```
   Kill enemy → LevelSystem.addEnemyKill() → returns true if leveled up
                 → Game.openShop() → state = 'shop'
                 → User purchases → Game.closeShop() → state = 'playing'
   ```

### Key Architecture Decisions

**No Build System**: All files are loaded directly via `<script>` tags in order. The load sequence in `index.html` matters:
```
utils.js → audio.js → particles.js → renderer.js → player.js →
enemies.js → levels.js → shop.js → leaderboard.js → game.js → main.js
```

**Global Singletons**: `audioSystem` is a global instance created in `audio.js`, accessed throughout other files.

**State Management**: The `Game.state` string drives which systems update and which DOM screens are visible. State changes trigger screen transitions and audio changes.

**Upgrade System**: Player upgrades (shield, rapid fire, damage multiplier, speed multiplier) are properties on the `Player` instance with duration counters that tick down in `Player.update()`. Shop purchases modify these directly.

**Procedural Generation**:
- Biomes: `LevelSystem.getCurrentBiome()` returns color schemes that cycle every 3 levels
- Background: `LevelSystem.generateBackground()` uses Canvas gradients and random nebula clouds
- Audio: `AudioSystem` creates oscillators/noise with Web Audio API on-demand
- Enemy spawning: Random edge positions, type based on probability thresholds

### Backend (PHP Leaderboard)

`api/leaderboard.php` uses file locking on `scores.json` to prevent race conditions:
- POST with `action: 'submit'` → validates score, adds to JSON, returns rank
- GET with `action: 'get'` → returns top N scores
- Anti-cheat: validates score is reasonable for level (max 10,000 × level)

**Critical**: `api/scores.json` must have write permissions (chmod 666) for PHP to write scores.

### Rendering Pipeline

1. `Game.render()` calls `Renderer` methods in order:
   - Background (biome-specific gradient + nebula)
   - StarField (parallax stars scrolling down)
   - ParticleSystem (explosions, trails, sparkles)
   - EnemyManager (draws all enemies + collectible stars)
   - Player (ship + projectiles)

2. Screen shake applies `ctx.translate()` offset before drawing entities

3. All drawing uses procedural shapes (circles, triangles, stars) - no image assets

### Physics & Movement

- Player uses acceleration toward mouse/touch position with friction
- Enemies use simple linear velocity with edge bouncing
- Projectiles are straight-line constant velocity
- All entities use `update(deltaTime)` for frame-independent movement

### Performance Constraints

- Max 1000 particles (older removed when limit hit)
- Max 15 enemies spawned at once
- Projectiles auto-removed when off-screen or lifetime expires
- Stars have 10s lifetime before disappearing

## Module Responsibilities

- **utils.js**: Math helpers (random, lerp, clamp, distance), localStorage wrapper, Vector2D class
- **audio.js**: Web Audio synthesis - all sound effects + ambient music generation
- **particles.js**: Particle class + ParticleSystem + StarField for background
- **renderer.js**: All Canvas drawing primitives (ship, aster, star, projectile, shield, text)
- **player.js**: Player state, movement, shooting, health, upgrades
- **enemies.js**: Enemy class (3 types with different stats), Star class, EnemyManager spawner
- **levels.js**: Level progression, biome definitions, difficulty scaling, background generation
- **shop.js**: Shop items, purchase validation, DOM rendering of shop UI
- **leaderboard.js**: Fetch/submit scores to PHP backend, display rankings, local best score
- **game.js**: Main game loop, state machine, collision detection, system coordination
- **main.js**: DOM event handlers, screen transitions, initialization

## Testing in Browser

Open browser console (F12) to see:
- `console.log` outputs for initialization and best scores
- Any errors will appear here
- Use `game` global variable to inspect state (e.g., `game.score`, `game.state`)

Performance: Open DevTools Performance tab and record while playing. Target is 60 FPS constant.

## Code Style Notes

- Classes use PascalCase: `ParticleSystem`, `EnemyManager`
- Functions/variables use camelCase: `checkCollisions`, `deltaTime`
- JSDoc comments on all public methods
- 4-space indentation
- No semicolons required but used consistently

## Game Balance Tuning

Enemy stats, spawn rates, shop prices, and level requirements are in their respective system files:
- Enemy HP/speed/rewards: `enemies.js` → `Enemy.setStats()`
- Spawn timing: `enemies.js` → `EnemyManager.spawnInterval` (starts 2s, decreases with level)
- Shop items: `shop.js` → `ShopSystem.createShopItems()`
- Level progression: `levels.js` → `LevelSystem` (20 enemies + 5 per level)
- Difficulty multiplier: `levels.js` → `getDifficultyMultiplier()` (+15% per level)

## PHP Requirements

The game works without PHP but the online leaderboard requires:
- PHP 7.4+ (uses `flock()` for file locking)
- `api/scores.json` writable by web server user
- No database needed - all scores in JSON file

If PHP is not available, the leaderboard gracefully degrades (errors shown in console, local best score still works via localStorage).
