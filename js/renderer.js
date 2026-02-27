// =============================================================================
// renderer.js — All drawing and rendering functions
// =============================================================================


// -----------------------------------------------------------------------------
// MAIN DRAW FUNCTION
// -----------------------------------------------------------------------------

function draw() {
    const { tileSize, offsetX, offsetY, rows, cols } = gameState;
    const now = Date.now();

    // ── LAYER 1: BACKGROUND ─────────────────────────────────────────────────
    ctx.fillStyle = GAME_CONFIG.BG_COLOR;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Outer waves
    if (sprites.wave) {
        ctx.globalAlpha = 0.6;
        for (const w of gameState.waves) {
            ctx.drawImage(sprites.wave, w.x, w.y, tileSize, tileSize);
        }
        ctx.globalAlpha = 1.0;
    }

    // ── LAYER 2: TERRAIN (WATER + LAND) ─────────────────────────────────────
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const px   = x * tileSize + offsetX;
            const py   = y * tileSize + offsetY;
            const cell = gameState.grid[y][x];

            // ---- Inner Waves (hidden inside the enclosed area after winning) ----
            if (gameState.waveMap && gameState.waveMap[y][x] && sprites.wave) {
                const isEnclosed = gameState.isWon &&
                                   gameState.winningPath &&
                                   gameState.winningPath[y][x] >= 0;
                if (!isEnclosed) {
                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(sprites.wave, px, py, tileSize, tileSize);
                    ctx.globalAlpha = 1.0;
                }
            }

            // ---- Land Tile ----
            if (cell === TILE_TYPE.LAND) {
                drawLandTile(x, y, px, py, tileSize);
            }
        }
    }

    // ── LAYER 3: SPARKLE EFFECT (win state only) ────────────────────────────
    if (gameState.isWon) drawSparkleEffect();

    // ── LAYER 4: GLOBAL GRID ────────────────────────────────────────────────
    drawGridLayer();

    // ── LAYER 5: ENTITIES (MOBY, BUOY, GHOST) ───────────────────────────────
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const px   = x * tileSize + offsetX;
            const py   = y * tileSize + offsetY;
            const cell = gameState.grid[y][x];

            // Moby Dick
            if (x === gameState.mobyPos.x && y === gameState.mobyPos.y) {
                const spr = gameState.isWon ? sprites.mobyHappy : sprites.moby;
                if (spr) ctx.drawImage(spr, px + 2, py + 2, tileSize - 4, tileSize - 4);
            }

            // Buoy + drop shadow
            if (cell === TILE_TYPE.BUOY) {
                const wall    = gameState.playerWalls.find(w => w.x === x && w.y === y);
                const elapsed = now - (wall ? wall.spawnTime : 0);
                const frame   = Math.min(3, Math.floor(elapsed / 50));

                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(px + 4, py + tileSize - 6, tileSize - 8, 4);

                const img = sprites.buoys[frame];
                if (img) drawSpriteAspect(img, px, py, tileSize);
            }

            // Ghost Preview (hover)
            const hx = gameState.hoverPos.x;
            const hy = gameState.hoverPos.y;
            if (!gameState.isWon &&
                x === hx && y === hy &&
                cell === TILE_TYPE.WATER &&
                gameState.playerWalls.length < gameState.maxWalls &&
                (x !== gameState.mobyPos.x || y !== gameState.mobyPos.y)) {
                ctx.save();
                ctx.globalAlpha = 0.5;
                if (sprites.buoys[0]) drawSpriteAspect(sprites.buoys[0], px, py, tileSize);
                ctx.restore();
            }
        }
    }

    // ── LAYER 6: WIN EFFECTS ─────────────────────────────────────────────────
    if (gameState.isWon) {
        const winElapsed = now - gameState.winTime;

        // --- Darken the outside ---
        const TARGET_ALPHA = 0.75;
        const DARK_DELAY   = 400; // ms after win before darkening begins
        if (winElapsed > DARK_DELAY) {
            gameState.outsideDarkAlpha = Math.min(
                TARGET_ALPHA,
                gameState.outsideDarkAlpha + 0.025
            );
        }

        if (gameState.outsideDarkAlpha > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(0, 0, 0, ${gameState.outsideDarkAlpha})`;

            const EDGE = 4;
            const DIAG = 5;

            // Reusable offscreen canvas
            if (!gameState._darkOffCanvas || gameState._darkOffCanvas.width !== tileSize) {
                gameState._darkOffCanvas = document.createElement('canvas');
                gameState._darkOffCanvas.width  = tileSize;
                gameState._darkOffCanvas.height = tileSize;
            }
            const offCvs = gameState._darkOffCanvas;
            const offCtx = offCvs.getContext('2d');

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (gameState.winningPath[y][x] >= 0) continue;

                    const px  = x * tileSize + offsetX;
                    const py0 = y * tileSize + offsetY;

                    const isPlayerWall = gameState.playerWalls.some(w => w.x === x && w.y === y);
                    if (isPlayerWall) continue;

                    if (gameState.grid[y][x] === TILE_TYPE.LAND) {
                        const fl = x > 0        && gameState.winningPath[y][x-1] >= 0;
                        const fr = x < cols - 1 && gameState.winningPath[y][x+1] >= 0;
                        const ft = y > 0        && gameState.winningPath[y-1][x] >= 0;
                        const fb = y < rows - 1 && gameState.winningPath[y+1][x] >= 0;
                        const dTL = !fl && !ft && x > 0        && y > 0        && gameState.winningPath[y-1][x-1] >= 0;
                        const dTR = !fr && !ft && x < cols - 1 && y > 0        && gameState.winningPath[y-1][x+1] >= 0;
                        const dBL = !fl && !fb && x > 0        && y < rows - 1 && gameState.winningPath[y+1][x-1] >= 0;
                        const dBR = !fr && !fb && x < cols - 1 && y < rows - 1 && gameState.winningPath[y+1][x+1] >= 0;

                        if (fl || fr || ft || fb || dTL || dTR || dBL || dBR) {
                            // Build darkened grass on offscreen canvas.
                            // source-atop darkens ONLY opaque grass pixels;
                            // transparent pixels (sea gaps) stay transparent.
                            offCtx.clearRect(0, 0, tileSize, tileSize);
                            offCtx.globalCompositeOperation = 'source-over';
                            offCtx.imageSmoothingEnabled = false;
                            const spr = getGrassSprite(x, y);
                            if (spr) offCtx.drawImage(spr, 0, 0, tileSize, tileSize);
                            // Inner corners omitted: overlay sprites can fill
                            // transparent areas of edge sprites (e.g. grassEdgeN),
                            // turning what should be visible sea into opaque green.
                            offCtx.globalCompositeOperation = 'source-atop';
                            offCtx.fillStyle = `rgba(0, 0, 0, ${gameState.outsideDarkAlpha})`;
                            offCtx.fillRect(0, 0, tileSize, tileSize);
                            offCtx.globalCompositeOperation = 'source-over';

                            // Darken the entire tile first
                            ctx.fillRect(px, py0, tileSize, tileSize);

                            // On enclosed-facing edges: paint bright sea + darkened grass stamp
                            const S = tileSize;
                            if (fl) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px, py0, EDGE, S);
                                ctx.drawImage(offCvs, 0, 0, EDGE, S, px, py0, EDGE, S);
                            }
                            if (fr) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px + S - EDGE, py0, EDGE, S);
                                ctx.drawImage(offCvs, S - EDGE, 0, EDGE, S, px + S - EDGE, py0, EDGE, S);
                            }
                            if (ft) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px, py0, S, EDGE);
                                ctx.drawImage(offCvs, 0, 0, S, EDGE, px, py0, S, EDGE);
                            }
                            if (fb) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px, py0 + S - EDGE, S, EDGE);
                                ctx.drawImage(offCvs, 0, S - EDGE, S, EDGE, px, py0 + S - EDGE, S, EDGE);
                            }
                            if (dTL) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px, py0, DIAG, DIAG);
                                ctx.drawImage(offCvs, 0, 0, DIAG, DIAG, px, py0, DIAG, DIAG);
                            }
                            if (dTR) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px + S - DIAG, py0, DIAG, DIAG);
                                ctx.drawImage(offCvs, S - DIAG, 0, DIAG, DIAG, px + S - DIAG, py0, DIAG, DIAG);
                            }
                            if (dBL) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px, py0 + S - DIAG, DIAG, DIAG);
                                ctx.drawImage(offCvs, 0, S - DIAG, DIAG, DIAG, px, py0 + S - DIAG, DIAG, DIAG);
                            }
                            if (dBR) {
                                ctx.fillStyle = GAME_CONFIG.BG_COLOR;
                                ctx.fillRect(px + S - DIAG, py0 + S - DIAG, DIAG, DIAG);
                                ctx.drawImage(offCvs, S - DIAG, S - DIAG, DIAG, DIAG, px + S - DIAG, py0 + S - DIAG, DIAG, DIAG);
                            }

                            ctx.fillStyle = `rgba(0, 0, 0, ${gameState.outsideDarkAlpha})`;
                            continue;
                        }
                    }

                    const isAboveWall = gameState.playerWalls.some(w => w.x === x && w.y === y + 1);
                    if (isAboveWall) {
                        const overflowPx = tileSize * 0.46;
                        ctx.fillRect(px, py0, tileSize, tileSize - overflowPx);
                        continue;
                    }

                    ctx.fillRect(px, py0, tileSize, tileSize);
                }
            }

            // Darken the area outside the grid
            ctx.fillRect(0,                         0,       canvas.width, offsetY);
            ctx.fillRect(0,                         offsetY, offsetX,      rows * tileSize);
            ctx.fillRect(offsetX + cols * tileSize,  offsetY, canvas.width, rows * tileSize);
            ctx.fillRect(0, offsetY + rows * tileSize, canvas.width, canvas.height);

            // Redraw ALL outside buoys after darkening
            for (const w of gameState.playerWalls) {
                if (gameState.winningPath[w.y][w.x] >= 0) continue;
                const bpx = w.x * tileSize + offsetX;
                const bpy = w.y * tileSize + offsetY;
                const elapsed = now - (w.spawnTime || 0);
                const frame   = Math.min(3, Math.floor(elapsed / 50));
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(bpx + 4, bpy + tileSize - 6, tileSize - 8, 4);
                const img = sprites.buoys[frame];
                if (img) drawSpriteAspect(img, bpx, bpy, tileSize);
            }

            ctx.restore();
        }

        // --- Lighthouse Drawing ---
        if (gameState.lighthousePos && sprites.lighthouse) {
            const FRAME_DURATION = 60;  // ms per frame
            const TOTAL_FRAMES   = 15;
            const lp             = gameState.lighthousePos;
            const spawnElapsed   = now - gameState.lighthouseSpawnTime;
            const frame          = Math.min(TOTAL_FRAMES - 1, Math.floor(spawnElapsed / FRAME_DURATION));
            const spr            = sprites.lighthouse[frame];

            if (spr) {
                const BASE_TILE = 50; // Reference tile size the sprite was designed for
                const scale     = tileSize / BASE_TILE;
                const lhW       = spr.width  * scale;
                const lhH       = spr.height * scale;
                const baseX     = lp.x * tileSize + offsetX + tileSize - lhW / 2;
                const baseY     = lp.y * tileSize + offsetY + tileSize * 2;

                ctx.imageSmoothingEnabled = false;
                // ** LIGHTHOUSE DARKENING EFFECT START **
                // Create a dedicated offscreen canvas for the lighthouse if it doesn't exist
                if (!gameState._lighthouseCanvas) {
                    gameState._lighthouseCanvas = document.createElement('canvas');
                }
                const offCvslh = gameState._lighthouseCanvas;
                const offCtxlh = offCvslh.getContext('2d');

                // Match offscreen size to the sprite size
                offCvslh.width  = spr.width;
                offCvslh.height = spr.height;
                offCtxlh.clearRect(0, 0, spr.width, spr.height);
                offCtxlh.imageSmoothingEnabled = false;

                // 1. Draw lighthouse normally on offscreen
                offCtxlh.drawImage(spr, 0, 0);

                // 2. Create darkening gradient starting from lamp room
                // Light source is at top ~15%
                const lightY = spr.height * 0.15;
                const radius = spr.height; // Fade covers entire height

                // Composite mode: only draw inside the lighthouse pixels
                offCtxlh.globalCompositeOperation = 'source-atop';

                const gradient = offCtxlh.createRadialGradient(
                    spr.width / 2, lightY, 0,      // Start (Lamp Room)
                    spr.width / 2, lightY, radius  // End (Base)
                );

                // Fallback to 0 if outsideDarkAlpha is not set yet (before winning)
                const darkAlpha = gameState.outsideDarkAlpha || 0;

                // Transparent at source, environmental darkness at base
                gradient.addColorStop(0,   'rgba(0, 0, 0, 0)'); 
                gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0)'); 
                gradient.addColorStop(0.8, `rgba(0, 0, 0, ${darkAlpha * 0.9})`); 
                gradient.addColorStop(1,   `rgba(0, 0, 0, ${darkAlpha})`);      

                offCtxlh.fillStyle = gradient;
                offCtxlh.fillRect(0, 0, spr.width, spr.height);

                // Reset composite mode
                offCtxlh.globalCompositeOperation = 'source-over';

                // 3. Draw modified offscreen lighthouse to main canvas
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(offCvslh, baseX, baseY - lhH, lhW, lhH);
                // ** LIGHTHOUSE DARKENING EFFECT END **
            }
        }
        /*
        // --- Lighthouse Light Effect (active only on the final frame) ---
        if (gameState.lighthousePos && sprites.lighthouse) {
            const TOTAL_FRAMES = 15;
            const spawnElapsed = now - gameState.lighthouseSpawnTime;
            const frame        = Math.min(TOTAL_FRAMES - 1, Math.floor(spawnElapsed / 80));

            if (frame === TOTAL_FRAMES - 1) {
                const lp      = gameState.lighthousePos;
                const BASE_TILE = 50;
                const scale   = tileSize / BASE_TILE;
                const lhW     = sprites.lighthouse[14].width  * scale;
                const lhH     = sprites.lighthouse[14].height * scale;
                const baseX   = lp.x * tileSize + offsetX + tileSize - lhW / 2;
                const baseY   = lp.y * tileSize + offsetY + tileSize * 2;

                // Light source at the lamp room — top ~15% of the sprite
                const lightX = baseX + lhW / 2;
                const lightY = baseY - lhH * 0.85;

                // Subtle flicker effect
                const flicker  = 0.85 + Math.sin(now / 200) * 0.08;
                const radius   = tileSize * 6;

                const gradient = ctx.createRadialGradient(
                    lightX, lightY, 0,
                    lightX, lightY, radius
                );
                gradient.addColorStop(0,    `rgba(255, 220, 100, ${0.9  * flicker})`);
                gradient.addColorStop(0.15, `rgba(255, 210, 80,  ${0.7  * flicker})`);
                gradient.addColorStop(0.4,  `rgba(255, 190, 60,  ${0.35 * flicker})`);
                gradient.addColorStop(0.7,  `rgba(255, 170, 40,  ${0.15 * flicker})`);
                gradient.addColorStop(1,    `rgba(255, 150, 20,  0)`);

                // Clip the light to only illuminate the enclosed area
                ctx.save();
                ctx.beginPath();
                for (let y = 0; y < gameState.rows; y++) {
                    for (let x = 0; x < gameState.cols; x++) {
                        if (gameState.winningPath[y][x] >= 0) {
                            ctx.rect(
                                x * tileSize + offsetX,
                                y * tileSize + offsetY,
                                tileSize, tileSize
                            );
                        }
                    }
                }
                ctx.clip();
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
        } */
    }

    // ── LAYER 7: ESCAPE PATH + SPEECH BUBBLE ────────────────────────────────
    const isHoveringMoby = gameState.hoverPos.x === gameState.mobyPos.x &&
                           gameState.hoverPos.y === gameState.mobyPos.y;

    if (!gameState.isWon) {
        if (isHoveringMoby) {
            const escapePath = findEscapePath();
            if (escapePath && escapePath.length >= 3) {
                // Determine bubble side once, based on escape direction
                if (gameState.bubbleAnim.active && !gameState.bubbleAnim.sideSet) {
                    gameState.bubbleAnim.side    = resolveBubbleSide(escapePath, gameState.mobyPos, gameState.cols);
                    gameState.bubbleAnim.sideSet = true;
                }
                // Start the arrow at the midpoint between Moby and the next tile
                const moby   = escapePath[0];
                const next   = escapePath[1];
                const border = { x: (moby.x + next.x) / 2, y: (moby.y + next.y) / 2 };
                drawAnimatedPath([border, ...escapePath.slice(1)]);
            }
            renderSpeechBubble(ctx, gameState, sprites);
        }
    } else {
        // After winning, only show the speech bubble (no escape arrow)
        if (isHoveringMoby) renderSpeechBubble(ctx, gameState, sprites);
    }

    // ── UI OVERLAY ───────────────────────────────────────────────────────────
    const bottomY = offsetY + rows * tileSize + 30;

    ctx.save();
    ctx.font = "22px 'Schoolbell'";

    // Buoy counter — shake + red flash feedback when the limit is reached
    const FEEDBACK_DURATION = 500; // ms
    const feedbackElapsed   = now - (gameState.buoyLimitFeedback || 0);
    const buoyText = `${t('buoy')}: ${gameState.maxWalls - gameState.playerWalls.length}/${gameState.maxWalls}`;

    if (feedbackElapsed < FEEDBACK_DURATION) {
        const feedbackProgress = feedbackElapsed / FEEDBACK_DURATION; // 0 → 1

        // Shake: damped sine wave → left/right jitter
        const shakeX = Math.round(Math.sin(feedbackProgress * Math.PI * 6) * (1 - feedbackProgress) * 2);

        // Color: red (#9b1b22) fading to white
        const r = Math.round(155 + (255 - 155) * feedbackProgress);
        const g = Math.round(27  + (255 - 27)  * feedbackProgress);
        const b = Math.round(34  + (255 - 34)  * feedbackProgress);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.textAlign = 'left';
        ctx.fillText(buoyText, offsetX + shakeX, bottomY);
    } else {
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText(buoyText, offsetX, bottomY);
    }

    // Score (bottom right)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.fillText(gameState.isWon ? `${t('area')}: ${gameState.lastScore}` : t('areaEmpty'), offsetX + cols * tileSize, bottomY);

    // "See Optimal" button (only shown after winning)
    if (gameState.isWon) {
        const optY = bottomY + 24;
        ctx.font = "16px 'Schoolbell'";
        ctx.textAlign = 'right';

        if (gameState.optimalMessage && (now - gameState.optimalMessageTime) < 2500) {
            ctx.fillStyle = '#f0c040';
            ctx.fillText(gameState.optimalMessage, offsetX + cols * tileSize, optY);
        } else {
            gameState.optimalMessage = null;

            const label      = gameState.showingOptimal ? t('yourSolution') : t('seeOptimal');
            const labelWidth = ctx.measureText(label).width;
            const labelX     = offsetX + cols * tileSize - labelWidth;

            const isHovering = gameState._mouseX >= labelX &&
                               gameState._mouseX <= labelX + labelWidth &&
                               gameState._mouseY >= optY - 14 &&
                               gameState._mouseY <= optY + 4;

            // Smooth opacity transition on hover
            const targetAlpha     = isHovering ? 1.0 : 0.6;
            gameState.optBtnAlpha += (targetAlpha - gameState.optBtnAlpha) * 0.1;

            ctx.fillStyle = `rgba(255, 255, 255, ${gameState.optBtnAlpha})`;
            ctx.fillText(label, offsetX + cols * tileSize, optY);

            canvas.style.cursor = isHovering ? 'pointer' : 'default';
            gameState._optBtn   = isHovering;
        }
    }

    ctx.restore();
}

// -----------------------------------------------------------------------------
// MAIN GAME LOOP
// -----------------------------------------------------------------------------

function loop() {
    draw();
    requestAnimationFrame(loop);
}


// -----------------------------------------------------------------------------
// TERRAIN HELPER FUNCTIONS
// -----------------------------------------------------------------------------

/** Returns true if the given coordinate is a land tile within the map. */
function isLand(x, y) {
    if (x < 0 || x >= gameState.cols || y < 0 || y >= gameState.rows) return false;
    return gameState.grid[y][x] === TILE_TYPE.LAND;
}

/**
 * Returns the correct grass sprite based on neighbouring land tiles.
 * Implements a 4-edge + diagonal tileset selection algorithm.
 */
function getGrassSprite(x, y) {
    const n = isLand(x, y - 1);
    const s = isLand(x, y + 1);
    const e = isLand(x + 1, y);
    const w = isLand(x - 1, y);

    // All 4 sides water → island
    if (!n && !s && !e && !w) return sprites.grassIsland;

    // 3 sides water → peninsula
    if (!n && !e && !w) return sprites.grassPeninsulaN;
    if (!s && !e && !w) return sprites.grassPeninsulaS;
    if (!n && !s && !w) return sprites.grassPeninsulaW;
    if (!n && !s && !e) return sprites.grassPeninsulaE;

    // 2 opposite sides water → corridor
    if (!n && !s) return sprites.grassCorridorH;
    if (!e && !w) return sprites.grassCorridorV;

    // 2 adjacent sides water → outer corner
    if (!n && !w) return sprites.grassCornerNW;
    if (!n && !e) return sprites.grassCornerNE;
    if (!s && !w) return sprites.grassCornerSW;
    if (!s && !e) return sprites.grassCornerSE;

    // 1 side water → edge
    if (!n) return sprites.grassEdgeN;
    if (!s) return sprites.grassEdgeS;
    if (!e) return sprites.grassEdgeE;
    if (!w) return sprites.grassEdgeW;

    // All 4 neighbours are land → check diagonals
    const nw = isLand(x - 1, y - 1);
    const ne = isLand(x + 1, y - 1);
    const sw = isLand(x - 1, y + 1);
    const se = isLand(x + 1, y + 1);

    if (nw && ne && sw && se) return sprites.grassCenter;
    if (!sw && !se) return sprites.grassInnerSESW;
    if (!nw && !sw) return sprites.grassInnerNWSW;
    if (!ne) return sprites.grassInnerNE;
    if (!nw) return sprites.grassInnerNW;
    if (!se) return sprites.grassInnerSE;
    if (!sw) return sprites.grassInnerSW;

    return sprites.grassCenter; // Fallback for undefined combinations
}

/**
 * Returns inner corner overlay sprites for a land tile
 * surrounded by land on all 4 cardinal sides.
 *
 * @returns {Array<HTMLImageElement>}
 */
function getInnerCorners(x, y) {
    const overlays = [];
    const n = isLand(x, y - 1);
    const s = isLand(x, y + 1);
    const e = isLand(x + 1, y);
    const w = isLand(x - 1, y);

    if (n && w && !isLand(x - 1, y - 1)) overlays.push(sprites.grassInnerNW);
    if (n && e && !isLand(x + 1, y - 1)) overlays.push(sprites.grassInnerNE);
    if (s && w && !isLand(x - 1, y + 1)) overlays.push(sprites.grassInnerSW);
    if (s && e && !isLand(x + 1, y + 1)) overlays.push(sprites.grassInnerSE);

    return overlays;
}

/** Selects the correct grass sprite and draws a land tile. */
function drawLandTile(x, y, px, py, size) {
    const spr = getGrassSprite(x, y);
    if (spr) {
        ctx.drawImage(spr, px, py, size, size);
    } else {
        ctx.fillStyle = '#35693f';
        ctx.fillRect(px, py, size, size);
    }
}

/** Draws semi-transparent grid lines across the entire map. */
function drawGridLayer() {
    if (gameState.gridOpacity <= 0) return;

    const { cols, rows, tileSize, offsetX, offsetY, gridOpacity } = gameState;
    const width  = cols * tileSize;
    const height = rows * tileSize;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(0, 0, 0, ${gridOpacity})`;
    ctx.lineWidth   = 0.5;

    for (let x = 0; x <= cols; x++) {
        const xPos = offsetX + x * tileSize + 0.5;
        ctx.moveTo(xPos, offsetY);
        ctx.lineTo(xPos, offsetY + height);
    }
    for (let y = 0; y <= rows; y++) {
        const yPos = offsetY + y * tileSize + 0.5;
        ctx.moveTo(offsetX, yPos);
        ctx.lineTo(offsetX + width, yPos);
    }

    ctx.stroke();
}

/**
 * Draws a sprite maintaining its original aspect ratio,
 * aligned to the bottom of the tile.
 */
function drawSpriteAspect(img, x, y, size) {
    const ratio = img.height / img.width;
    const h     = size * ratio;
    ctx.drawImage(img, x, y + size - h, size, h);
}

/**
 * Generates a fixed star map at win time.
 * Each enclosed tile gets 5–8 stars with pre-computed properties.
 * Called once from drawSparkleEffect on first render after winning.
 */
function generateStarMap() {
    const { rows, cols, tileSize } = gameState;

    const COLORS = [
        { r: 255, g: 255, b: 255 },   // white
        { r: 255, g: 255, b: 255 },
        { r: 255, g: 240, b: 200 },   // warm white
        { r: 255, g: 220, b: 150 },   // gold
        { r: 255, g: 220, b: 150 },
        { r: 200, g: 230, b: 255 },   // ice blue
    ];

    const hash = (n) => {
        n = ((n >> 16) ^ n) * 0x45d9f3b;
        n = ((n >> 16) ^ n) * 0x45d9f3b;
        n = (n >> 16) ^ n;
        return Math.abs(n);
    };

    const starMap = [];
    for (let y = 0; y < rows; y++) {
        starMap[y] = [];
        for (let x = 0; x < cols; x++) {
            const stars = [];
            const count = 5 + hash(x * 31 + y * 97) % 4;     // 5–8 stars

            for (let i = 0; i < count; i++) {
                const h1 = hash(x * 73  + y * 113 + i * 211);
                const h2 = hash(x * 57  + y * 149 + i * 179);
                const h3 = hash(x * 43  + y * 131 + i * 251);
                const h4 = hash(x * 89  + y *  61 + i * 197);

                const pad = 3;
                stars.push({
                    x:        pad + (h1 % (tileSize - pad * 2)),
                    y:        pad + (h2 % (tileSize - pad * 2)),
                    size:     1 + (h3 % 3),                     // 1–3 px
                    color:    COLORS[h1 % COLORS.length],
                    maxAlpha: 0.45 + (h2 % 50) / 100,          // 0.45–0.95
                    // Three independent sine-wave frequencies for organic flicker
                    freq1:    200 + (h1 % 15) * 40,            // 200–760 ms
                    freq2:    300 + (h2 % 12) * 50,            // 300–850 ms
                    freq3:    500 + (h3 % 10) * 60,            // 500–1100 ms
                    phase1:   (h1 % 100) * 0.063,
                    phase2:   (h2 % 100) * 0.063,
                    phase3:   (h3 % 100) * 0.063,
                    // Per-star spatial frequency for the scrolling shimmer wave
                    shimmerK: 0.008 + (h4 % 40) * 0.0003,
                });
            }
            starMap[y][x] = stars;
        }
    }

    gameState._starMap = starMap;
}


/**
 * Two-layer twinkle system inspired by the stars + scrolling-twinkling pattern:
 *
 *   Layer 1 — Static star field  (fixed positions, sizes, colors)
 *   Layer 2 — Spatial shimmer    (slow sine wave drifting across the screen
 *                                  that brightens/dims nearby stars together)
 *
 * Combined with per-star multi-frequency flicker for organic results.
 * BFS distance-based fade-in is preserved.
 */
function drawSparkleEffect() {
    const { rows, cols, tileSize, offsetX, offsetY, winningPath, winTime } = gameState;
    const now     = Date.now();
    const elapsed = now - winTime;

    // Generate star map once
    if (!gameState._starMap) generateStarMap();

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const dist = winningPath[y][x];
            if (dist < 0) continue;

            // BFS distance-based reveal
            const tileAge = elapsed - dist * 120;
            if (tileAge <= 0) continue;
            const fadeIn = Math.min(1, tileAge / 600);

            const px = x * tileSize + offsetX;
            const py = y * tileSize + offsetY;

            const stars = gameState._starMap[y]?.[x];
            if (!stars) continue;

            for (const s of stars) {
                // --- Layer 1: Per-star flicker (3 overlapping sine waves) ---
                const t1 = Math.sin(now / s.freq1 + s.phase1) * 0.5 + 0.5;
                const t2 = Math.sin(now / s.freq2 + s.phase2) * 0.5 + 0.5;
                const t3 = Math.sin(now / s.freq3 + s.phase3) * 0.5 + 0.5;
                const flicker = t1 * 0.4 + t2 * 0.35 + t3 * 0.25;

                // --- Layer 2: Spatial shimmer (scrolling wave across screen) ---
                const worldX  = px + s.x;
                const worldY  = py + s.y;
                const shimmer = Math.sin(
                    worldX * s.shimmerK + now * 0.0008 +
                    worldY * s.shimmerK * 0.7 + now * 0.0006
                ) * 0.5 + 0.5;

                // Combine: flicker controls individual twinkle,
                //          shimmer makes nearby stars pulse together
                const combined  = flicker * 0.55 + shimmer * 0.45;
                // Cubic sharpening — occasional bright flashes
                const sharpened = combined * 0.6 + Math.pow(combined, 3) * 0.4;
                const alpha     = fadeIn * sharpened * s.maxAlpha;
                if (alpha < 0.02) continue;

                const { r, g, b } = s.color;
                const sz = Math.round(s.size * (0.8 + combined * 0.4));
                
                // Upward drift effect: 
                // Creates an organic floating motion using 'now' (time) and the sparkle's worldX.
                const driftY = (now * 0.005 + worldX) % (tileSize * 0.5); 
                const sx = Math.round(px + s.x);
                const sy = Math.round(py + s.y - driftY * 0.1); // Drifts slowly upwards

                // 1. Background glow halo - Drawn only if alpha is high enough
                if (s.size >= 2 && alpha > 0.3) {
                    const glowSz = sz * 3;
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`;
                    // Draw the glow as a cross/diamond shape instead of a blocky square
                    ctx.fillRect(sx - glowSz/2, sy - sz/2, glowSz, sz);
                    ctx.fillRect(sx - sz/2, sy - glowSz/2, sz, glowSz);
                }

                // 2. The bright center star
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                
                // If the star is small, draw a single point. If large, draw a nostalgic 8-bit plus (+) shape
                if (sz <= 1) {
                    ctx.fillRect(sx, sy, 1, 1);
                } else {
                    ctx.fillRect(sx, sy - 1, 1, 3); // Vertical line
                    ctx.fillRect(sx - 1, sy, 3, 1); // Horizontal line
                    
                    // Add extra white core during the brightest (sharpened) moments
                    if (sharpened > 0.8) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.fillRect(sx, sy, 1, 1);
                    }
                }
            }
        }
    }
}