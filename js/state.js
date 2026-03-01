// =============================================================================
// state.js — Game state, sound management, asset loading and level management
// =============================================================================

// -----------------------------------------------------------------------------
// SOUND MANAGEMENT
// -----------------------------------------------------------------------------

let isMuted = localStorage.getItem('enclose_muted') === 'true';
let audioUnlocked = false;

function toggleSound() {
    isMuted = !isMuted;
    localStorage.setItem('enclose_muted', isMuted);
    document.getElementById('sound-toggle-btn').classList.toggle('muted', isMuted);

    if (!isMuted) unlockAudio();
}

function initSoundButton() {
    document.getElementById('sound-toggle-btn').classList.toggle('muted', isMuted);
}

const MOBY_SOUNDS = [];

function initMobySounds() {
    const keys = Object.keys(ASSETS).filter(k => k.startsWith('mobySound'));
    for (const key of keys) {
        const audio = new Audio(ASSETS[key]);
        audio.volume = 0.15;
        MOBY_SOUNDS.push(audio);
    }
}

// --- SFX (one-off effects) ---
const SFX = {};

function initSFX() {
    const sfxKeys = ['buoyPlaceSound', 'buoyRemoveSound', 'resetSound', 'lighthouseSound'];
    for (const key of sfxKeys) {
        if (ASSETS[key]) {
            SFX[key] = new Audio(ASSETS[key]);
            SFX[key].volume = 0.2;
        }
    }
}

function playSFX(key) {
    if (isMuted || !SFX[key]) return;
    SFX[key].currentTime = 0;
    SFX[key].play().catch(() => {});
}

async function unlockAudio() {
    if (audioUnlocked) return;
    if (isMuted) return;
    if (MOBY_SOUNDS.length === 0) return;

    try {
        const a = MOBY_SOUNDS[0];
        a.volume = 0;              // silent "unlock" attempt
        await a.play();
        a.pause();
        a.currentTime = 0;
        a.volume = 0.15;           // restore volume
        audioUnlocked = true;
    } catch (e) {
        // Some browsers still require a gesture; that's fine.
    }
}

function playMobySound() {
    if (isMuted || MOBY_SOUNDS.length === 0) return;
    const idx = Math.floor(Math.random() * MOBY_SOUNDS.length);
    const sound = MOBY_SOUNDS[idx];
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

// -----------------------------------------------------------------------------
// GAME STATE
// -----------------------------------------------------------------------------

let gameState = {
    dashOffset:          0,
    currentLevelIndex:   0,
    grid:                [],
    playerWalls:         [],
    mobyPos:             { x: 0, y: 0 },
    waves:               [],
    isWon:               false,
    winningPath:         null,
    winAlpha:            0,
    winTime:             0,
    hoverPos:            { x: -1, y: -1 },
    tileSize:            50,
    offsetX:             0,
    offsetY:             0,
    rows:                0,
    cols:                0,
    maxWalls:            10,
    lastScore:           0,
    escapeAnim:          { pathKey: null, progress: 0, complete: false, arrowAge: 0 },

    // Grid opacity (default 0.15, read from localStorage)
    gridOpacity: localStorage.getItem('enclose_grid_opacity')
                     ? parseFloat(localStorage.getItem('enclose_grid_opacity'))
                     : 0.15,

    // Speech bubble animation
    bubbleAnim: { active: false, side: 'right', msgIndex: 0, startTime: 0, sideSet: false },

    // "See Optimal" system
    showingOptimal:      false,
    savedPlayerWalls:    [],
    savedPlayerScore:    0,
    savedPlayerPath:     null,
    optimalMessage:      null,   // "You found the optimal solution!" notification
    optimalMessageTime:  0,

    // Internal mouse position and button state
    _mouseX:    0,
    _mouseY:    0,
    _optBtn:    false,
    optBtnAlpha: 0.6,            // Current opacity of the optimal button

    // Buoy limit feedback (shake + red flash)
    buoyLimitFeedback: 0,        // Timestamp of last trigger (Date.now())

    // Lighthouse
    lighthousePos:       null,   // { x, y } — spawn point
    lighthouseSpawnTime: 0,      // Date.now()
    outsideDarkAlpha:    0,      // Darken the outside opacity (0 → 0.85)

    submitted:           false,
};

// --- SCORE PERSISTENCE ---

function saveScore(levelIndex, area) {
    const key = `enclose_best_${levelIndex}`;
    const prev = parseInt(localStorage.getItem(key)) || 0;
    if (area > prev) {
        localStorage.setItem(key, area);
        return true;  // new record
    }
    return false;
}

function getBestScore(levelIndex) {
    return parseInt(localStorage.getItem(`enclose_best_${levelIndex}`)) || 0;
}

function shouldShowTip() {
    return localStorage.getItem('enclose_hide_tip') !== 'true';
}

function hideTipForever() {
    localStorage.setItem('enclose_hide_tip', 'true');
}

function getMedalForScore(levelIndex, score) {
    const optimal = LEVELS[levelIndex].optimalArea;
    if (!optimal || optimal === 0) return { emoji: '', label: '' };

    const ratio = score / optimal;

    if (ratio >= 1.0) return { emoji: '🥇', label: t('medalGold') };
    if (ratio >= 0.8) return { emoji: '🥈', label: t('medalSilver') };
    if (ratio >= 0.5) return { emoji: '🥉', label: t('medalBronze') };
    return { emoji: '', label: t('medalNone') };
}

// -----------------------------------------------------------------------------
// CANVAS & SPRITE REFERENCES
// -----------------------------------------------------------------------------

const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d', { alpha: false });
const sprites = {};

// -----------------------------------------------------------------------------
// ASSET LOADING
// -----------------------------------------------------------------------------

async function loadAssets() {
    const loadImg = (src) => new Promise((resolve) => {
        const img = new Image();
        img.onload  = () => resolve(img);
        img.onerror = () => { console.error('Failed to load image:', src); resolve(null); };
        img.src = src;
    });

    const imageKeys = Object.keys(ASSETS).filter(k => !k.startsWith('mobySound'));
    const images    = await Promise.all(imageKeys.map(k => loadImg(ASSETS[k])));

    imageKeys.forEach((key, i) => { sprites[key] = images[i]; });

    // Shortcut array for buoy animation frames
    sprites.buoys = [sprites.buoy0, sprites.buoy1, sprites.buoy2, sprites.buoy3];

    // Shortcut array for lighthouse animation frames
    sprites.lighthouse = [
    sprites.lighthouse00, sprites.lighthouse01, sprites.lighthouse02,
    sprites.lighthouse03, sprites.lighthouse04, sprites.lighthouse05,
    sprites.lighthouse06, sprites.lighthouse07, sprites.lighthouse08,
    sprites.lighthouse09, sprites.lighthouse10, sprites.lighthouse11,
    sprites.lighthouse12, sprites.lighthouse13, sprites.lighthouse14,
];
}

// -----------------------------------------------------------------------------
// LEVEL LOADING
// -----------------------------------------------------------------------------

function loadLevel(index) {
    gameState.currentLevelIndex = index;
    const levelData = LEVELS[index];

    // Deep copy the grid
    gameState.grid = levelData.map.map(row => [...row]);
    gameState.rows = gameState.grid.length;
    gameState.cols = gameState.grid[0].length;
    gameState.maxWalls = levelData.maxWalls;

    // Find Moby's starting position
    for (let y = 0; y < gameState.rows; y++) {
        for (let x = 0; x < gameState.cols; x++) {
            if (gameState.grid[y][x] === TILE_TYPE.MOBY) {
                gameState.mobyPos = { x, y };
            }
        }
    }

    // Reset state
    gameState.playerWalls         = [];
    gameState.isWon               = false;
    gameState.winningPath         = null;
    gameState.winAlpha            = 0;
    gameState.winTime             = 0;
    gameState.showingOptimal      = false;
    gameState.savedPlayerWalls    = [];
    gameState.savedPlayerScore    = 0;
    gameState.savedPlayerPath     = null;
    gameState.optimalMessage      = null;
    gameState._starMap            = null;
    gameState.optimalMessageTime  = 0;
    gameState.buoyLimitFeedback   = 0;
    gameState.lighthousePos       = null;
    gameState.lighthouseSpawnTime = 0;
    gameState.outsideDarkAlpha    = 0;
    gameState.submitted           = false;

    document.getElementById('level-name-display').textContent =
        `${t('day')} ${index + 1} - ${levelData.name}`;

    resize();
}

// -----------------------------------------------------------------------------
// OPTIMAL VIEW TOGGLE
// -----------------------------------------------------------------------------

function toggleOptimalView() {
    const level = LEVELS[gameState.currentLevelIndex];
    if (!level.optimalWalls || level.optimalWalls.length === 0) return;

    // If the player already found the optimal solution, show a notification
    if (gameState.lastScore >= level.optimalArea && !gameState.showingOptimal) {
        gameState.optimalMessage = t('optimalFound');
        gameState.optimalMessageTime = Date.now();
        return;
    }

    if (!gameState.showingOptimal) {
        // === SWITCH TO OPTIMAL VIEW ===

        // Save the player's current solution
        gameState.savedPlayerWalls  = [...gameState.playerWalls];
        gameState.savedPlayerScore  = gameState.lastScore;
        gameState.savedPlayerPath   = gameState.winningPath;

        // Remove player buoys from grid
        for (const w of gameState.playerWalls) {
            gameState.grid[w.y][w.x] = TILE_TYPE.WATER;
        }

        // Place optimal buoys
        gameState.playerWalls = level.optimalWalls.map(w => ({
            x: w.x, y: w.y, spawnTime: Date.now()
        }));
        for (const w of gameState.playerWalls) {
            gameState.grid[w.y][w.x] = TILE_TYPE.BUOY;
        }

        checkWinCondition();
        gameState.lastScore      = level.optimalArea;
        gameState.showingOptimal = true;

    } else {
        // === RETURN TO PLAYER VIEW ===

        // Remove optimal buoys
        for (const w of gameState.playerWalls) {
            gameState.grid[w.y][w.x] = TILE_TYPE.WATER;
        }

        // Restore player's buoys
        gameState.playerWalls = [...gameState.savedPlayerWalls];
        for (const w of gameState.playerWalls) {
            gameState.grid[w.y][w.x] = TILE_TYPE.BUOY;
        }

        gameState.lastScore      = gameState.savedPlayerScore;
        gameState.winningPath    = gameState.savedPlayerPath;
        gameState.isWon          = true;
        gameState.showingOptimal = false;
    }
}