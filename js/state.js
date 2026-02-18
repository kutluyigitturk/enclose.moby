// =============================================================================
// state.js — Oyun durumu, ses yönetimi, varlık yükleme ve seviye yönetimi
// =============================================================================


// -----------------------------------------------------------------------------
// SES YÖNETİMİ
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

async function unlockAudio() {
    if (audioUnlocked) return;
    if (isMuted) return;
    if (MOBY_SOUNDS.length === 0) return;

    try {
        const a = MOBY_SOUNDS[0];
        a.volume = 0;              // sessiz “unlock” denemesi
        await a.play();
        a.pause();
        a.currentTime = 0;
        a.volume = 0.15;           // geri normale
        audioUnlocked = true;
    } catch (e) {
        // Bazı tarayıcılarda yine gesture bekler; sorun değil.
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
// OYUN DURUMU (gameState)
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

    // Grid opaklığı (varsayılan 0.15, localStorage'dan okunur)
    gridOpacity: localStorage.getItem('enclose_grid_opacity')
                     ? parseFloat(localStorage.getItem('enclose_grid_opacity'))
                     : 0.15,

    // Konuşma balonu animasyonu
    bubbleAnim: { active: false, side: 'right', msgIndex: 0, startTime: 0, sideSet: false },

    // "See Optimal" sistemi
    showingOptimal:      false,
    savedPlayerWalls:    [],
    savedPlayerScore:    0,
    savedPlayerPath:     null,
    optimalMessage:      null,   // "You found the optimal solution!" bildirimi
    optimalMessageTime:  0,

    // Dahili fare konumu ve buton durumu
    _mouseX:    0,
    _mouseY:    0,
    _optBtn:    false,
    optBtnAlpha: 0.6,            // Optimal butonunun anlık opaklık değeri
};


// -----------------------------------------------------------------------------
// CANVAS & SPRITE REFERANSLARI
// -----------------------------------------------------------------------------

const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d', { alpha: false });
const sprites = {};


// -----------------------------------------------------------------------------
// VARLIK YÜKLEME
// -----------------------------------------------------------------------------

async function loadAssets() {
    const loadImg = (src) => new Promise((resolve) => {
        const img = new Image();
        img.onload  = () => resolve(img);
        img.onerror = () => { console.error('Resim yüklenemedi'); resolve(null); };
        img.src = src;
    });

    const keys   = Object.keys(ASSETS);
    const images = await Promise.all(keys.map(k => loadImg(ASSETS[k])));

    keys.forEach((key, i) => { sprites[key] = images[i]; });

    // Buoy dizisini kısayol olarak hazırla
    sprites.buoys = [sprites.buoy0, sprites.buoy1, sprites.buoy2, sprites.buoy3];
}


// -----------------------------------------------------------------------------
// SEVİYE YÜKLEME
// -----------------------------------------------------------------------------

function loadLevel(index) {
    gameState.currentLevelIndex = index;
    const levelData = LEVELS[index];

    // Grid'i derin kopyala
    gameState.grid = levelData.map.map(row => [...row]);
    gameState.rows = gameState.grid.length;
    gameState.cols = gameState.grid[0].length;
    gameState.maxWalls = levelData.maxWalls;

    // Moby'nin başlangıç konumunu bul
    for (let y = 0; y < gameState.rows; y++) {
        for (let x = 0; x < gameState.cols; x++) {
            if (gameState.grid[y][x] === TILE_TYPE.MOBY) {
                gameState.mobyPos = { x, y };
            }
        }
    }

    // Durum sıfırlama
    gameState.playerWalls       = [];
    gameState.isWon             = false;
    gameState.winningPath       = null;
    gameState.winAlpha          = 0;
    gameState.winTime           = 0;
    gameState.showingOptimal    = false;
    gameState.savedPlayerWalls  = [];
    gameState.savedPlayerScore  = 0;
    gameState.savedPlayerPath   = null;
    gameState.optimalMessage    = null;
    gameState.optimalMessageTime = 0;

    document.getElementById('level-name-display').textContent =
        `Level ${index + 1} - ${levelData.name}`;

    resize();
}


// -----------------------------------------------------------------------------
// OPTIMAL GÖRÜNÜM TOGGLE
// -----------------------------------------------------------------------------

function toggleOptimalView() {
    const level = LEVELS[gameState.currentLevelIndex];
    if (!level.optimalWalls || level.optimalWalls.length === 0) return;

    // Oyuncu zaten optimali bulduysa bildirim göster
    if (gameState.lastScore >= level.optimalArea && !gameState.showingOptimal) {
        gameState.optimalMessage     = 'You found the optimal solution!';
        gameState.optimalMessageTime = Date.now();
        return;
    }

    if (!gameState.showingOptimal) {
        // === OPTIMAL GÖRÜNÜME GEÇ ===

        // Oyuncunun mevcut çözümünü kaydet
        gameState.savedPlayerWalls  = [...gameState.playerWalls];
        gameState.savedPlayerScore  = gameState.lastScore;
        gameState.savedPlayerPath   = gameState.winningPath;

        // Oyuncunun şamandıralarını grid'den kaldır
        for (const w of gameState.playerWalls) {
            gameState.grid[w.y][w.x] = TILE_TYPE.WATER;
        }

        // Optimal şamandıraları yerleştir
        gameState.playerWalls = level.optimalWalls.map(w => ({
            x: w.x, y: w.y, spawnTime: Date.now()
        }));
        for (const w of gameState.playerWalls) {
            gameState.grid[w.y][w.x] = TILE_TYPE.BUOY;
        }

        checkWinCondition();
        gameState.lastScore     = level.optimalArea;
        gameState.showingOptimal = true;

    } else {
        // === OYUNCU GÖRÜNÜMÜNE GERİ DÖN ===

        // Optimal şamandıraları kaldır
        for (const w of gameState.playerWalls) {
            gameState.grid[w.y][w.x] = TILE_TYPE.WATER;
        }

        // Oyuncunun şamandıralarını geri koy
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