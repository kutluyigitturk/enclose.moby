// =============================================================================
// ui.js — Menü, modal, ayarlar, giriş (input) ve ekran yeniden boyutlandırma
// =============================================================================


// -----------------------------------------------------------------------------
// MENÜ YÖNETİMİ
// -----------------------------------------------------------------------------

function toggleDropdown() {
    const dropdown    = document.getElementById('dropdown-menu');
    const menuBtn     = document.querySelector('.menu-container .menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    dropdown.classList.toggle('show');

    if (dropdown.classList.contains('show')) {
        menuBtn.classList.add('menu-open');
        menuOverlay.style.display = 'block';
    } else {
        menuBtn.classList.remove('menu-open');
        menuOverlay.style.display = 'none';
    }
}

/** Menüyü ve blur katmanını anında kapatır. */
function forceCloseMenu() {
    document.getElementById('dropdown-menu').classList.remove('show');
    document.querySelector('.menu-container .menu-btn').classList.remove('menu-open');
    document.getElementById('menu-overlay').style.display = 'none';
}

// Menü dışına tıklanınca kapat
window.onclick = function (event) {
    // Canvas tıklamalarını yoksay (oyun giriş olayları ayrıca yönetilir)
    if (event.target.id === 'gameCanvas') return;

    const dropdown    = document.getElementById('dropdown-menu');
    const menuBtn     = document.querySelector('.menu-container .menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!event.target.closest('.menu-container') && !event.target.closest('#dropdown-menu')) {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            menuBtn.classList.remove('menu-open');
            menuOverlay.style.display = 'none';
        }
    }
};


// -----------------------------------------------------------------------------
// SEVİYE SEÇİCİ MODALİ
// -----------------------------------------------------------------------------

function openLevelSelector() {
    forceCloseMenu();

    const container = document.getElementById('level-list-container');
    container.innerHTML = '';

    LEVELS.forEach((lvl, idx) => {
        const btn = document.createElement('button');
        btn.className   = 'level-item';
        btn.textContent = `${idx + 1}. ${lvl.name}`;
        btn.onclick     = () => { loadLevel(idx); closeLevelSelector(); };
        container.appendChild(btn);
    });

    document.getElementById('level-modal').style.display = 'flex';
}

function closeLevelSelector() {
    document.getElementById('level-modal').style.display = 'none';
}


// -----------------------------------------------------------------------------
// AYARLAR PANELİ
// -----------------------------------------------------------------------------

function openSettings() {
    forceCloseMenu();
    document.getElementById('dropdown-menu').classList.remove('show');
    document.getElementById('settings-overlay').style.display = 'flex';

    const slider = document.getElementById('grid-opacity-slider');
    const label  = document.getElementById('grid-val-display');
    const currentVal = Math.round(gameState.gridOpacity * 100);

    slider.value    = currentVal;
    label.textContent = currentVal + '%';

    slider.oninput = function (e) {
        const val = e.target.value;
        label.textContent     = val + '%';
        gameState.gridOpacity = val / 100;
        localStorage.setItem('enclose_grid_opacity', gameState.gridOpacity);
        draw(); // Anlık önizleme
    };
}

function closeSettings() {
    document.getElementById('settings-overlay').style.display = 'none';
}


// -----------------------------------------------------------------------------
// BİLGİ MODALİ (Info / Nasıl Oynanır)
// -----------------------------------------------------------------------------

function openInfo() {
    forceCloseMenu();
    document.getElementById('dropdown-menu')?.classList.remove('show');
    document.getElementById('info-modal').style.display = 'flex';

    document.querySelector('button[onclick="openInfo()"]').classList.add('info-active');

    updateLevelStats();
    switchTab('how');
}

function closeInfo() {
    document.getElementById('info-modal').style.display = 'none';
    document.querySelector('button[onclick="openInfo()"]').classList.remove('info-active');
}

function switchTab(tabName) {
    document.getElementById('content-how').classList.toggle('active', tabName === 'how');
    document.getElementById('content-this').classList.toggle('active', tabName === 'this');
    document.getElementById('btn-how').classList.toggle('active', tabName === 'how');
    document.getElementById('btn-this').classList.toggle('active', tabName === 'this');
}

function updateLevelStats() {
    const lvl       = LEVELS[gameState.currentLevelIndex];
    const container = document.getElementById('level-stats-container');
    if (!container) return;

    container.innerHTML = `
        <div class="stat-line" style="color:#333;"><span>Name</span>        <b>${lvl.name}</b></div>
        <div class="stat-line" style="color:#333;"><span>Made by</span>     <b>Kutlu</b></div>
        <div class="stat-line" style="color:#333;"><span>Size</span>        <b>${gameState.cols} x ${gameState.rows}</b></div>
        <div class="stat-line" style="color:#333;"><span>Buoy Budget</span> <b>${lvl.maxWalls}</b></div>
        <div class="stat-line" style="color:#333;"><span>Level ID</span>    <b>#${gameState.currentLevelIndex + 100}</b></div>
    `;
}


// -----------------------------------------------------------------------------
// EKRAN YENİDEN BOYUTLANDIRMA
// -----------------------------------------------------------------------------

function resize() {
    const dpr          = window.devicePixelRatio || 1;
    const displayWidth  = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width  = displayWidth  * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width  = displayWidth  + 'px';
    canvas.style.height = displayHeight + 'px';

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const safeW = displayWidth  - 20;
    const safeH = displayHeight - 180;

    const tileW = Math.floor(safeW / gameState.cols);
    const tileH = Math.floor(safeH / gameState.rows);

    let ts = Math.min(tileW, tileH);
    ts = Math.max(GAME_CONFIG.TILE_SIZE_MIN, Math.min(GAME_CONFIG.TILE_SIZE_MAX, ts));

    gameState.tileSize = ts;

    const mapW = gameState.cols * ts;
    const mapH = gameState.rows * ts;

    gameState.offsetX = Math.floor((displayWidth  - mapW) / 2);
    gameState.offsetY = 80 + Math.floor((safeH - mapH) / 2);

    if (gameState.grid.length > 0) generateWaves();
    draw();
}


// -----------------------------------------------------------------------------
// GİRİŞ YÖNETİMİ (Mouse & Dokunmatik)
// -----------------------------------------------------------------------------

function handleInput(e, type) {
    if (e.cancelable) e.preventDefault();

    const rect    = canvas.getBoundingClientRect();
    const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;

    gameState._mouseX = clientX - rect.left;
    gameState._mouseY = clientY - rect.top;

    const x = Math.floor((clientX - rect.left - gameState.offsetX) / gameState.tileSize);
    const y = Math.floor((clientY - rect.top  - gameState.offsetY) / gameState.tileSize);

    // --- HOVER ---
    if (type === 'hover') {
        if (gameState.hoverPos.x !== x || gameState.hoverPos.y !== y) {
            const wasMoby = gameState.hoverPos.x === gameState.mobyPos.x &&
                            gameState.hoverPos.y === gameState.mobyPos.y;
            const isMoby  = x === gameState.mobyPos.x && y === gameState.mobyPos.y;

            // Moby'den ayrılınca animasyonları sıfırla
            if (wasMoby && !isMoby) {
                gameState.escapeAnim = { pathKey: null, progress: 0, complete: false };
                gameState.bubbleAnim = { active: false, side: 'right', msgIndex: 0, startTime: 0, sideSet: false };
            }

            // Moby'ye girilince konuşma balonunu başlat
            if (!wasMoby && isMoby) {
                playMobySound();
                const msgList = gameState.isWon ? MOBY_WIN_MESSAGES : MOBY_MESSAGES;
                gameState.bubbleAnim = {
                    active:    true,
                    side:      gameState.isWon
                                   ? (gameState.mobyPos.x < gameState.cols / 2 ? 'right' : 'left')
                                   : 'right',
                    msgIndex:  Math.floor(Math.random() * msgList.length),
                    startTime: Date.now(),
                    sideSet:   gameState.isWon
                };
            }
        }
        gameState.hoverPos = { x, y };
        return;
    }

    // --- TIKLAMA ---

    // "See Optimal" butonu tıklaması
    if (gameState._optBtn && gameState.isWon) {
        toggleOptimalView();
        return;
    }

    if (x < 0 || x >= gameState.cols || y < 0 || y >= gameState.rows) return;

    // Kazanılan durumda şamandıra kaldırılabilir
    if (gameState.isWon && !gameState.showingOptimal) {
        const wallIndex = gameState.playerWalls.findIndex(w => w.x === x && w.y === y);
        if (wallIndex !== -1) {
            gameState.grid[y][x] = TILE_TYPE.WATER;
            gameState.playerWalls.splice(wallIndex, 1);
            gameState.isWon       = false;
            gameState.winningPath = null;
        }
        return;
    }

    const cell = gameState.grid[y][x];

    // Su karosuna tıkla → şamandıra koy
    if ((cell === TILE_TYPE.WATER || cell === TILE_TYPE.MOBY) &&
         gameState.playerWalls.length < gameState.maxWalls) {
        if (cell === TILE_TYPE.MOBY) return;
        gameState.grid[y][x] = TILE_TYPE.BUOY;
        gameState.playerWalls.push({ x, y, spawnTime: Date.now() });
        checkWinCondition();
    }
    // Şamandıraya tıkla → kaldır
    else if (cell === TILE_TYPE.BUOY) {
        const idx = gameState.playerWalls.findIndex(w => w.x === x && w.y === y);
        if (idx !== -1) {
            gameState.grid[y][x] = TILE_TYPE.WATER;
            gameState.playerWalls.splice(idx, 1);
        }
    }
}


// -----------------------------------------------------------------------------
// KAÇIŞ YOLU ANİMASYONU (Kesik çizgi + ok)
// -----------------------------------------------------------------------------

function drawAnimatedPath(path) {
    if (!path || path.length < 2) return;

    const { tileSize, offsetX, offsetY } = gameState;

    // Tile boyutuna orantılı çizgi kalınlığı ve tire uzunluğu
    const lineWidth = Math.max(2, Math.floor(tileSize / 12));
    const dashLen   = Math.floor(tileSize * 0.3);
    const gapLen    = Math.floor(tileSize * 0.3);
    const arrowLen  = tileSize * 0.3;

    // Yol değişti mi? Animasyonu sıfırla
    const pathKey = path[path.length - 1].x + ',' + path[path.length - 1].y + ':' + path.length;
    if (gameState.escapeAnim.pathKey !== pathKey) {
        gameState.escapeAnim = { pathKey, progress: 0, complete: false };
    }

    // İlerlemeyi güncelle
    if (!gameState.escapeAnim.complete) {
        const remaining = (path.length - 1) - gameState.escapeAnim.progress;
        gameState.escapeAnim.progress += Math.max(0.08, remaining * 0.09);
        if (gameState.escapeAnim.progress >= path.length - 1) {
            gameState.escapeAnim.progress = path.length - 1;
            gameState.escapeAnim.complete = true;
        }
    }

    const fullTiles = Math.floor(gameState.escapeAnim.progress);
    const frac      = gameState.escapeAnim.progress - fullTiles;
    const pathColor = 'rgba(255, 255, 255, 0.8)';

    const getPos = (p) => ({
        px: p.x * tileSize + offsetX + tileSize / 2,
        py: p.y * tileSize + offsetY + tileSize / 2,
    });

    // Çizilecek noktaları topla
    const drawEnd = gameState.escapeAnim.complete ? path.length : fullTiles + 2;
    const pts     = [];
    for (let i = 0; i < Math.min(drawEnd, path.length); i++) {
        pts.push(getPos(path[i]));
    }
    if (pts.length < 2) return;

    // Ok başı için son segmenti kısalt
    let drawPts = pts;
    if (gameState.escapeAnim.complete && pts.length >= 2) {
        drawPts       = pts.map(p => ({ ...p }));
        const last    = drawPts[drawPts.length - 1];
        const prev    = drawPts[drawPts.length - 2];
        const angle   = Math.atan2(last.py - prev.py, last.px - prev.px);
        drawPts[drawPts.length - 1] = {
            px: last.px - arrowLen * Math.cos(angle),
            py: last.py - arrowLen * Math.sin(angle),
        };
    }

    // --- Kesik çizgiyi çiz ---
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth   = lineWidth;
    ctx.strokeStyle = pathColor;
    ctx.setLineDash([dashLen, gapLen]);
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    ctx.moveTo(drawPts[0].px, drawPts[0].py);

    if (drawPts.length === 2) {
        let endX = drawPts[1].px, endY = drawPts[1].py;
        if (!gameState.escapeAnim.complete && fullTiles < 1) {
            endX = drawPts[0].px + (drawPts[1].px - drawPts[0].px) * frac;
            endY = drawPts[0].py + (drawPts[1].py - drawPts[0].py) * frac;
        }
        ctx.lineTo(endX, endY);
    } else {
        const tension = 0.35;
        for (let i = 0; i < drawPts.length - 1; i++) {
            const p0 = drawPts[Math.max(0, i - 1)];
            const p1 = drawPts[i];
            const p2 = drawPts[i + 1];
            const p3 = drawPts[Math.min(drawPts.length - 1, i + 2)];

            let targetP2 = p2;
            if (!gameState.escapeAnim.complete && i === drawPts.length - 2 && fullTiles + 1 < path.length) {
                targetP2 = {
                    px: p1.px + (p2.px - p1.px) * frac,
                    py: p1.py + (p2.py - p1.py) * frac,
                };
            }

            const cp1x = p1.px + (targetP2.px - p0.px) * tension;
            const cp1y = p1.py + (targetP2.py - p0.py) * tension;
            const cp2x = targetP2.px - (p3.px - p1.px) * tension;
            const cp2y = targetP2.py - (p3.py - p1.py) * tension;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetP2.px, targetP2.py);
        }
    }
    ctx.stroke();

    // --- Ok başını çiz (animasyon tamamlandıktan sonra) ---
    if (gameState.escapeAnim.complete && path.length >= 2) {
        const last        = getPos(path[path.length - 1]);
        const prev        = getPos(path[path.length - 2]);
        const angle       = Math.atan2(last.py - prev.py, last.px - prev.px);
        const arrowSpread = 0.5;

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineWidth   = lineWidth;
        ctx.strokeStyle = pathColor;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        const tipX   = last.px;
        const tipY   = last.py;
        const leftX  = tipX - arrowLen * Math.cos(angle - arrowSpread);
        const leftY  = tipY - arrowLen * Math.sin(angle - arrowSpread);
        const rightX = tipX - arrowLen * Math.cos(angle + arrowSpread);
        const rightY = tipY - arrowLen * Math.sin(angle + arrowSpread);

        ctx.moveTo(leftX, leftY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
    }

    ctx.restore();
}


// -----------------------------------------------------------------------------
// BALON TARAFINI BELİRLE
// -----------------------------------------------------------------------------

/**
 * Kaçış yoluna ve Moby'nin konumuna bakarak
 * konuşma balonunun hangi tarafta görüneceğini döndürür.
 */
function resolveBubbleSide(escapePath, mobyPos, cols) {
    if (!escapePath || escapePath.length < 2) return BUBBLE_SIDE.RIGHT;

    // İlk adımın yatay yönüne bak
    const dx = escapePath[1].x - escapePath[0].x;
    if (dx < 0) return BUBBLE_SIDE.RIGHT;   // Ok sola gidiyorsa → balon sağda
    if (dx > 0) return BUBBLE_SIDE.LEFT;    // Ok sağa gidiyorsa → balon solda

    // İlk adım dikeyse ikinci adıma bak
    if (escapePath.length >= 3) {
        const dx2 = escapePath[2].x - escapePath[1].x;
        if (dx2 < 0) return BUBBLE_SIDE.RIGHT;
        if (dx2 > 0) return BUBBLE_SIDE.LEFT;
    }

    // Tamamen dikey yol → Moby'nin haritadaki konumuna göre karar ver
    return mobyPos.x < cols / 2 ? BUBBLE_SIDE.RIGHT : BUBBLE_SIDE.LEFT;
}