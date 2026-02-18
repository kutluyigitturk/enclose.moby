// =============================================================================
// game.js — Oyun mantığı: dalga üretimi, kazanma koşulu, kaçış yolu
// =============================================================================


// -----------------------------------------------------------------------------
// DALGA OLUŞTURMA
// -----------------------------------------------------------------------------

/**
 * Oyun alanı içindeki (waveMap) ve dışındaki (waves) dalga noktalarını üretir.
 * Her seviye yüklenişinde ve ekran yeniden boyutlandırıldığında çağrılır.
 */
function generateWaves() {
    gameState.waves = [];
    const { cols, rows, tileSize, offsetX, offsetY } = gameState;

    // Ekranın tamamını kapsayacak sanal grid sınırlarını hesapla
    const startCol = Math.floor(-offsetX / tileSize);
    const endCol   = cols + Math.floor((window.innerWidth  - (offsetX + cols * tileSize)) / tileSize) + 1;
    const startRow = Math.floor(-offsetY / tileSize);
    const endRow   = rows + Math.floor((window.innerHeight - (offsetY + rows * tileSize)) / tileSize) + 1;

    // İç dalga haritasını sıfırla
    gameState.waveMap = Array.from({ length: rows }, () => new Array(cols).fill(false));

    for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
            if (Math.random() > 0.10) continue; // %10 yoğunluk

            const isInsideMap = (c >= 0 && c < cols && r >= 0 && r < rows);

            if (isInsideMap) {
                // Yalnızca su karolarına iç dalga koy
                if (gameState.grid[r][c] === TILE_TYPE.WATER) {
                    gameState.waveMap[r][c] = true;
                }
            } else {
                // Harita dışı dalgalar (dış deniz)
                gameState.waves.push({
                    x: offsetX + c * tileSize,
                    y: offsetY + r * tileSize,
                });
            }
        }
    }
}


// -----------------------------------------------------------------------------
// KAZANMA KOŞULU
// -----------------------------------------------------------------------------

/**
 * BFS ile Moby'nin erişebildiği tüm alanı tarar.
 * Harita kenarına ulaşamazsa Moby çevrilmiş (oyun kazanılmış) demektir.
 */
function checkWinCondition() {
    const { rows, cols } = gameState;
    const dist  = Array.from({ length: rows }, () => new Int16Array(cols).fill(-1));
    const queue = [{ ...gameState.mobyPos, d: 0 }];
    dist[gameState.mobyPos.y][gameState.mobyPos.x] = 0;

    let escaped  = false;
    let areaSize = 0;

    while (queue.length > 0) {
        const { x, y, d } = queue.shift();
        areaSize++;

        if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) escaped = true;

        for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                if (dist[ny][nx] === -1 &&
                    gameState.grid[ny][nx] !== TILE_TYPE.LAND &&
                    gameState.grid[ny][nx] !== TILE_TYPE.BUOY) {
                    dist[ny][nx] = d + 1;
                    queue.push({ x: nx, y: ny, d: d + 1 });
                }
            }
        }
    }

    if (!escaped) {
        gameState.isWon       = true;
        gameState.winningPath = dist;
        gameState.lastScore   = areaSize;
        gameState.winTime     = Date.now();
    }
}


// -----------------------------------------------------------------------------
// KAÇIŞ YOLU BULMA
// -----------------------------------------------------------------------------

/**
 * BFS ile Moby'den harita kenarına giden en kısa yolu döndürür.
 * Kaçış yoksa null döner.
 *
 * @returns {Array<{x,y}>|null}
 */
function findEscapePath() {
    const { rows, cols, mobyPos } = gameState;
    const queue   = [{ x: mobyPos.x, y: mobyPos.y, path: [] }];
    const visited = Array.from({ length: rows }, () => new Uint8Array(cols).fill(0));
    visited[mobyPos.y][mobyPos.x] = 1;

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();
        const currentPath = [...path, { x, y }];

        // Kenar → kaçış bulundu
        if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
            return currentPath;
        }

        for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                if (visited[ny][nx] === 0 &&
                    gameState.grid[ny][nx] !== TILE_TYPE.LAND &&
                    gameState.grid[ny][nx] !== TILE_TYPE.BUOY) {
                    visited[ny][nx] = 1;
                    queue.push({ x: nx, y: ny, path: currentPath });
                }
            }
        }
    }

    return null; // Kaçış yolu yok
}