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

            // ---- Ice / Freeze Win Effect ----
            if (gameState.isWon && gameState.winningPath[y][x] >= 0) {
                const tileDist     = gameState.winningPath[y][x];
                const elapsed      = (now - gameState.winTime) / 1000;
                const tileDelay    = tileDist * 0.06;
                const tileProgress = Math.min(1, Math.max(0, (elapsed - tileDelay) / 0.5));

                if (tileProgress > 0) {
                    const seed  = (x * 7  + y * 13) % 17;
                    const seed2 = (x * 11 + y *  3) % 23;
                    const ts    = tileSize;

                    ctx.save();

                    // Phase 1 — Frost creeping inward from edges
                    if (tileProgress < 0.6) {
                        const edgeP  = tileProgress / 0.6;
                        const frostW = ts * edgeP * 0.5;

                        ctx.fillStyle = `rgba(225, 240, 255, ${edgeP * 0.35})`;
                        ctx.fillRect(px, py, ts, ts);

                        const makeGrad = (x0, y0, x1, y1) => {
                            const g = ctx.createLinearGradient(x0, y0, x1, y1);
                            g.addColorStop(0, `rgba(235, 245, 255, ${edgeP * 0.5})`);
                            g.addColorStop(1, 'rgba(235, 245, 255, 0)');
                            return g;
                        };
                        ctx.fillStyle = makeGrad(px,      py, px + frostW,      py); ctx.fillRect(px,                py, frostW, ts);
                        ctx.fillStyle = makeGrad(px + ts, py, px + ts - frostW, py); ctx.fillRect(px + ts - frostW, py, frostW, ts);
                        ctx.fillStyle = makeGrad(px, py,      px, py + frostW);      ctx.fillRect(px, py,                ts, frostW);
                        ctx.fillStyle = makeGrad(px, py + ts, px, py + ts - frostW); ctx.fillRect(px, py + ts - frostW, ts, frostW);
                    }

                    // Phase 2 — Full ice layer + crystal texture
                    if (tileProgress >= 0.3) {
                        const iceP = Math.min(1, (tileProgress - 0.3) / 0.5);
                        ctx.fillStyle = `rgba(230, 245, 255, ${iceP * 0.55})`;
                        ctx.fillRect(px, py, ts, ts);

                        ctx.strokeStyle = `rgba(240, 248, 255, ${iceP * 0.3})`;
                        ctx.lineWidth   = 0.5;
                        for (let i = 0; i < 3; i++) {
                            const fx   = px + ((seed  + i * 7) % 10) / 10 * ts;
                            const fy   = py + ((seed2 + i * 5) % 10) / 10 * ts;
                            const fLen = ts * 0.1 + (seed % 5) * ts * 0.02;
                            ctx.beginPath();
                            ctx.moveTo(fx, fy);
                            ctx.lineTo(fx + fLen, fy - fLen * 0.7);
                            ctx.moveTo(fx, fy);
                            ctx.lineTo(fx - fLen * 0.5, fy + fLen * 0.4);
                            ctx.stroke();
                        }
                    }

                    // Phase 3 — Cracks
                    if (tileProgress > 0.7) {
                        const crackP = (tileProgress - 0.7) / 0.3;
                        const cx     = px + ts * 0.5;
                        const cy     = py + ts * 0.5;

                        ctx.strokeStyle = `rgba(150, 195, 220, ${crackP * 0.7})`;
                        ctx.lineWidth   = 1.5;
                        ctx.beginPath();

                        const angle1  = (seed / 17) * Math.PI * 2;
                        const len1    = ts * (0.25 + (seed % 5) * 0.04);
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(cx + Math.cos(angle1) * len1, cy + Math.sin(angle1) * len1);

                        const bx      = cx + Math.cos(angle1) * len1 * 0.6;
                        const by      = cy + Math.sin(angle1) * len1 * 0.6;
                        const angle1b = angle1 + 0.8 + (seed2 % 5) * 0.1;
                        ctx.moveTo(bx, by);
                        ctx.lineTo(bx + Math.cos(angle1b) * len1 * 0.4, by + Math.sin(angle1b) * len1 * 0.4);

                        const angle2  = angle1 + Math.PI * 0.6 + (seed2 / 23) * Math.PI * 0.5;
                        const len2    = ts * (0.2 + (seed2 % 4) * 0.04);
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(cx + Math.cos(angle2) * len2, cy + Math.sin(angle2) * len2);
                        ctx.stroke();

                        ctx.strokeStyle = `rgba(220, 240, 255, ${crackP * 0.5})`;
                        ctx.lineWidth   = 0.5;
                        ctx.beginPath();
                        if (seed > 5) {
                            const a3 = angle1 + Math.PI * 1.2;
                            ctx.moveTo(cx + ts * 0.05, cy - ts * 0.05);
                            ctx.lineTo(cx + Math.cos(a3) * ts * 0.22, cy + Math.sin(a3) * ts * 0.22);
                        }
                        if (seed2 > 10) {
                            const a4 = angle2 - 0.9;
                            ctx.moveTo(cx - ts * 0.03, cy + ts * 0.03);
                            ctx.lineTo(cx + Math.cos(a4) * ts * 0.18, cy + Math.sin(a4) * ts * 0.18);
                        }
                        ctx.stroke();
                    }

                    // Phase 4 — Sparkles (fully frozen)
                    if (tileProgress > 0.9) {
                        const sparkleP = (tileProgress - 0.9) / 0.1;
                        const sparkle  = Math.sin(now / 300 + seed * 2) * 0.3 + 0.7;
                        ctx.fillStyle  = `rgba(255, 255, 255, ${sparkleP * sparkle * 0.6})`;
                        ctx.fillRect(
                            Math.floor(px + ((seed  * 3) % 10) / 10 * ts),
                            Math.floor(py + ((seed2 * 2) % 10) / 10 * ts),
                            2, 2
                        );
                        if (seed > 4) {
                            const sparkle2 = Math.sin(now / 400 + seed2) * 0.3 + 0.7;
                            ctx.fillStyle  = `rgba(255, 255, 255, ${sparkleP * sparkle2 * 0.4})`;
                            ctx.fillRect(
                                Math.floor(px + ((seed2 * 4 + 7) % 10) / 10 * ts),
                                Math.floor(py + ((seed  * 5 + 3) % 10) / 10 * ts),
                                1.5, 1.5
                            );
                        }
                    }

                    ctx.restore();
                }
            }

            // ---- Inner Waves (hidden on frozen tiles) ----
            if (gameState.waveMap && gameState.waveMap[y][x] && sprites.wave) {
                const isFrozen = gameState.isWon &&
                                 gameState.winningPath &&
                                 gameState.winningPath[y][x] >= 0;
                if (!isFrozen) {
                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(sprites.wave, px, py, tileSize, tileSize);
                    ctx.globalAlpha = 1.0;
                }
            }

            // ---- Land Tile ----
            if (cell === TILE_TYPE.LAND) {
                // Paint ice overlay on land edges adjacent to frozen water
                if (gameState.isWon && gameState.winningPath) {
                    const edgeW   = 4;
                    const scale   = tileSize / 50;
                    const edge    = Math.ceil(edgeW * scale);
                    const elapsed = (now - gameState.winTime) / 1000;

                    const getIceColor = (dist) => {
                        if (dist < 0) return null;
                        const tp = Math.min(1, Math.max(0, (elapsed - dist * 0.06) / 0.5));
                        return tp > 0 ? `rgba(230, 245, 255, ${tp * 0.55})` : null;
                    };

                    const fl  = x > 0        && gameState.winningPath[y][x - 1] >= 0;
                    const fr  = x < cols - 1 && gameState.winningPath[y][x + 1] >= 0;
                    const fu  = y > 0        && gameState.winningPath[y - 1][x] >= 0;
                    const fd  = y < rows - 1 && gameState.winningPath[y + 1][x] >= 0;
                    const fNW = y > 0        && x > 0        && gameState.winningPath[y - 1][x - 1] >= 0;
                    const fNE = y > 0        && x < cols - 1 && gameState.winningPath[y - 1][x + 1] >= 0;
                    const fSW = y < rows - 1 && x > 0        && gameState.winningPath[y + 1][x - 1] >= 0;
                    const fSE = y < rows - 1 && x < cols - 1 && gameState.winningPath[y + 1][x + 1] >= 0;

                    const paintEdge = (dist, rx, ry, rw, rh) => {
                        const c = getIceColor(dist);
                        if (c) { ctx.fillStyle = c; ctx.fillRect(rx, ry, rw, rh); }
                    };

                    if (fl) paintEdge(gameState.winningPath[y][x - 1], px,                   py,                   edge,              tileSize);
                    if (fr) paintEdge(gameState.winningPath[y][x + 1], px + tileSize - edge,  py,                   edge,              tileSize);
                    if (fu) paintEdge(gameState.winningPath[y - 1][x], px,                   py,                   tileSize,          edge);
                    if (fd) paintEdge(gameState.winningPath[y + 1][x], px + edge,             py + tileSize - edge, tileSize - edge*2, edge);

                    if (fNW && !fl && !fu) paintEdge(gameState.winningPath[y - 1][x - 1], px,                   py,                   edge, edge);
                    if (fNE && !fr && !fu) paintEdge(gameState.winningPath[y - 1][x + 1], px + tileSize - edge, py,                   edge, edge);
                    if (fSW && !fl && !fd) paintEdge(gameState.winningPath[y + 1][x - 1], px,                   py + tileSize - edge, edge, edge);
                    if (fSE && !fr && !fd) paintEdge(gameState.winningPath[y + 1][x + 1], px + tileSize - edge, py + tileSize - edge, edge, edge);
                }

                drawLandTile(x, y, px, py, tileSize);
            }
        }
    }

    // ── LAYER 3: GLOBAL GRID ────────────────────────────────────────────────
    drawGridLayer();

    // ── LAYER 4: ENTITIES (MOBY, BUOY, GHOST) ───────────────────────────────
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

    // ── LAYER 5: ESCAPE PATH + SPEECH BUBBLE ────────────────────────────────
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
        // After winning, only show speech bubble (no arrow)
        if (isHoveringMoby) renderSpeechBubble(ctx, gameState, sprites);
    }

    // ── UI OVERLAY ───────────────────────────────────────────────────────────
    const bottomY = offsetY + rows * tileSize + 30;

    ctx.save();
    ctx.font = "22px 'Schoolbell'";

    // Buoy counter — shake + red flash feedback when limit is reached
    const FEEDBACK_DURATION = 500; // ms
    const feedbackElapsed   = now - (gameState.buoyLimitFeedback || 0);
    const buoyText = `${t('buoy')}: ${gameState.maxWalls - gameState.playerWalls.length}/${gameState.maxWalls}`;

    if (feedbackElapsed < FEEDBACK_DURATION) {
        const t = feedbackElapsed / FEEDBACK_DURATION; // 0 → 1

        // Shake: damped sine wave → left/right jitter
        const shakeX = Math.round(Math.sin(t * Math.PI * 6) * (1 - t) * 2);

        // Color: red fading to white (#9b1b22 Red Hex Code)
        const r = Math.round(155 + (255 - 155) * t); // 155 → 255
        const g = Math.round(27  + (255 - 27)  * t); //  27 → 255
        const b = Math.round(34  + (255 - 34)  * t); //  34 → 255
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

            const label = gameState.showingOptimal ? t('yourSolution') : t('seeOptimal');
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