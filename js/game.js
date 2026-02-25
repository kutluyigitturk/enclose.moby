// =============================================================================
// game.js — Game mechanics: wave generation, winning condition, escape route
// =============================================================================

// -----------------------------------------------------------------------------
// WAVE generatıon
// -----------------------------------------------------------------------------

/**
 * It generates wave points inside (waveMap) and outside (waves) the game area.
 * It is called at each level load and when the screen is resized.
 */
function generateWaves() {
    gameState.waves = [];
    const { cols, rows, tileSize, offsetX, offsetY } = gameState;

    // Calculate the virtual grid boundaries that will cover the entire screen
    const startCol = Math.floor(-offsetX / tileSize);
    const endCol   = cols + Math.floor((window.innerWidth  - (offsetX + cols * tileSize)) / tileSize) + 1;
    const startRow = Math.floor(-offsetY / tileSize);
    const endRow   = rows + Math.floor((window.innerHeight - (offsetY + rows * tileSize)) / tileSize) + 1;

    // Reset the internal wave map
    gameState.waveMap = Array.from({ length: rows }, () => new Array(cols).fill(false));

    for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
            if (Math.random() > 0.10) continue; // %10 density

            const isInsideMap = (c >= 0 && c < cols && r >= 0 && r < rows);

            if (isInsideMap) {
                // Only place internal waves on water tiles
                if (gameState.grid[r][c] === TILE_TYPE.WATER) {
                    gameState.waveMap[r][c] = true;
                }
            } else {
                // Offshore waves (open sea)
                gameState.waves.push({
                    x: offsetX + c * tileSize,
                    y: offsetY + r * tileSize,
                });
            }
        }
    }
}


// -----------------------------------------------------------------------------
// WINNING CONDITION
// -----------------------------------------------------------------------------

/**
 * It scans the entire area accessible to BFS and Moby.
 * If Moby cannot reach the edge of the map, it means the game is over (the game has been won).
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
// FINDING AN ESCAPE ROUTE
// -----------------------------------------------------------------------------

/**
 * Returns the shortest path from Moby to the edge of the map using BFS.
 * Uses a parent pointer pattern instead of copying the path at each step,
 * reducing memory usage on large grids.
 * If there is no escape, it returns null.
 *
 * @returns {Array<{x,y}>|null}
 */
function findEscapePath() {
    const { rows, cols, mobyPos } = gameState;
    const parent  = Array.from({ length: rows }, () => new Array(cols).fill(null));
    const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
    const queue   = [{ x: mobyPos.x, y: mobyPos.y }];
    visited[mobyPos.y][mobyPos.x] = 1;

    while (queue.length > 0) {
        const { x, y } = queue.shift();

        if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
            const path = [];
            let cx = x, cy = y;
            while (cx !== mobyPos.x || cy !== mobyPos.y) {
                path.unshift({ x: cx, y: cy });
                ({ x: cx, y: cy } = parent[cy][cx]);
            }
            path.unshift({ x: mobyPos.x, y: mobyPos.y });
            return path;
        }

        for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows &&
                visited[ny][nx] === 0 &&
                gameState.grid[ny][nx] !== TILE_TYPE.LAND &&
                gameState.grid[ny][nx] !== TILE_TYPE.BUOY) {
                visited[ny][nx] = 1;
                parent[ny][nx]  = { x, y };
                queue.push({ x: nx, y: ny });
            }
        }
    }

    return null;
}