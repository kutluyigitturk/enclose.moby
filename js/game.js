// =============================================================================
// game.js — Game mechanics: wave generation, winning condition, escape route
// =============================================================================

// -----------------------------------------------------------------------------
// WAVE GENERATION
// -----------------------------------------------------------------------------

/**
 * Generates wave points inside (waveMap) and outside (waves) the game area.
 * Called at each level load and when the screen is resized.
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
            if (Math.random() > 0.10) continue; // 10% density

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
 * Scans the entire area accessible to Moby via BFS.
 * If Moby cannot reach the edge of the map, the game is won.
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
        gameState.isWon               = true;
        gameState.winningPath         = dist;
        gameState.lastScore           = areaSize;
        gameState.winTime             = Date.now();
        const levelDef = LEVELS[gameState.currentLevelIndex];
        gameState.lighthousePos = levelDef.lighthousePos
            ? { ...levelDef.lighthousePos }
            : findLighthousePos();
        gameState.lighthouseSpawnTime = Date.now();
        gameState.outsideDarkAlpha    = 0;
    }
}


// -----------------------------------------------------------------------------
// FINDING AN ESCAPE ROUTE
// -----------------------------------------------------------------------------

/**
 * Returns the shortest path from Moby to the edge of the map using BFS.
 * Uses a parent pointer pattern instead of copying the path at each step,
 * reducing memory usage on large grids.
 * Returns null if there is no escape route.
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

// -----------------------------------------------------------------------------
// LIGHTHOUSE SPAWN POSITION
// -----------------------------------------------------------------------------

/**
 * Finds a suitable 2x2 water tile block outside the enclosed area,
 * closest to the enclosed area's centroid.
 *
 * Search priority:
 *   1. Distance 3–5 from the boundary  (ideal)
 *   2. Distance 1–7                    (wider fallback)
 *   3. Any single outside water tile   (last resort)
 *
 * @returns {{ x: number, y: number } | null}
 */
function findLighthousePos() {
    const { rows, cols, winningPath, grid } = gameState;

    // Step 1 — Calculate centroid of the enclosed area
    let sumX = 0, sumY = 0, count = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (winningPath[y][x] >= 0) {
                sumX += x; sumY += y; count++;
            }
        }
    }
    if (count === 0) return null;
    const centroid = { x: sumX / count, y: sumY / count };

    // Step 2 — BFS outward from the enclosed boundary to build a distance map
    const distOutside = Array.from({ length: rows }, () => new Array(cols).fill(-1));
    const queue = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (winningPath[y][x] !== -1) continue;
            // Seed: outside tiles that directly border the enclosed area
            for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows &&
                    winningPath[ny][nx] >= 0) {
                    distOutside[y][x] = 0;
                    queue.push({ x, y });
                    break;
                }
            }
        }
    }

    let head = 0;
    while (head < queue.length) {
        const { x, y } = queue[head++];
        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows &&
                distOutside[ny][nx] === -1 &&
                winningPath[ny][nx] === -1) {
                distOutside[ny][nx] = distOutside[y][x] + 1;
                queue.push({ x: nx, y: ny });
            }
        }
    }

    // Step 3 — Collect valid 2x2 water blocks within the given distance range
    const collectCandidates = (minD, maxD) => {
        const results = [];
        for (let y = 1; y < rows - 1; y++) {
            for (let x = 1; x < cols - 2; x++) {
                const d = distOutside[y][x];
                if (d < minD || d > maxD) continue;

                const allWater =
                    grid[y][x]       === TILE_TYPE.WATER &&
                    grid[y][x + 1]   === TILE_TYPE.WATER &&
                    grid[y + 1][x]   === TILE_TYPE.WATER &&
                    grid[y + 1][x+1] === TILE_TYPE.WATER &&
                    winningPath[y][x]       === -1 &&
                    winningPath[y][x + 1]   === -1 &&
                    winningPath[y + 1][x]   === -1 &&
                    winningPath[y + 1][x+1] === -1;

                if (allWater) results.push({ x, y });
            }
        }
        return results;
    };

    // Step 4 — Try progressively wider distance ranges
    let candidates = collectCandidates(3, 5);
    if (candidates.length === 0) candidates = collectCandidates(1, 7);

    // Step 5 — Last resort: any single outside water tile
    if (candidates.length === 0) {
        for (let y = 1; y < rows - 1; y++) {
            for (let x = 1; x < cols - 1; x++) {
                if (distOutside[y][x] >= 0 && grid[y][x] === TILE_TYPE.WATER) {
                    candidates.push({ x, y });
                    break;
                }
            }
            if (candidates.length > 0) break;
        }
    }

    if (candidates.length === 0) return null;

    // Step 6 — Pick the candidate closest to the centroid
    let best = null, bestDist = Infinity;
    for (const c of candidates) {
        const dist = Math.hypot((c.x + 0.5) - centroid.x, (c.y + 0.5) - centroid.y);
        if (dist < bestDist) { bestDist = dist; best = c; }
    }

    return best;
}