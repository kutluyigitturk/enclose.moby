// =============================================================================
// bubble.js — Speech bubble configuration, messages, and render functions
// =============================================================================

// -----------------------------------------------------------------------------
// 9-SLICE BUBBLE FRAME DRAWER
// -----------------------------------------------------------------------------

/**
 * Draws the given sprite by stretching it to any size without distorting it.
 * The corners remain as they are; the edges and center are stretched.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img   - Balloon sprite
 * @param {number} x               - Target top left X
 * @param {number} y               - Target top left Y
 * @param {number} width           - Desired width
 * @param {number} height          - Desired height
 */
function draw9Slice(ctx, img, x, y, width, height) {
    const { SLICE, WIDTH, HEIGHT } = BUBBLE_CONFIG.SPRITE;

    // Dimensions of the middle section in the original sprite
    const centerW = WIDTH  - SLICE.LEFT - SLICE.RIGHT;
    const centerH = HEIGHT - SLICE.TOP  - SLICE.BOTTOM;

    // Dimensions of the center section to be covered on the screen
    const targetCenterW = width  - SLICE.LEFT - SLICE.RIGHT;
    const targetCenterH = height - SLICE.TOP  - SLICE.BOTTOM;

    // 1. Top Left Corner
    ctx.drawImage(img, 0, 0, SLICE.LEFT, SLICE.TOP,
                        x, y, SLICE.LEFT, SLICE.TOP);

    // 2. Top Edge (horizontal extension)
    ctx.drawImage(img, SLICE.LEFT, 0, centerW, SLICE.TOP,
                        x + SLICE.LEFT, y, targetCenterW, SLICE.TOP);

    // 3. Top Right Corner
    ctx.drawImage(img, WIDTH - SLICE.RIGHT, 0, SLICE.RIGHT, SLICE.TOP,
                        x + width - SLICE.RIGHT, y, SLICE.RIGHT, SLICE.TOP);

    // 4. Left Edge (vertical extension)
    ctx.drawImage(img, 0, SLICE.TOP, SLICE.LEFT, centerH,
                        x, y + SLICE.TOP, SLICE.LEFT, targetCenterH);

    // 5. Center (extension in both directions)
    ctx.drawImage(img, SLICE.LEFT, SLICE.TOP, centerW, centerH,
                        x + SLICE.LEFT, y + SLICE.TOP, targetCenterW, targetCenterH);

    // 6. Right Edge (vertical extension)
    ctx.drawImage(img, WIDTH - SLICE.RIGHT, SLICE.TOP, SLICE.RIGHT, centerH,
                        x + width - SLICE.RIGHT, y + SLICE.TOP, SLICE.RIGHT, targetCenterH);

    // 7. Bottom Left Corner
    ctx.drawImage(img, 0, HEIGHT - SLICE.BOTTOM, SLICE.LEFT, SLICE.BOTTOM,
                        x, y + height - SLICE.BOTTOM, SLICE.LEFT, SLICE.BOTTOM);

    // 8. Bottom Edge (horizontal extension)
    ctx.drawImage(img, SLICE.LEFT, HEIGHT - SLICE.BOTTOM, centerW, SLICE.BOTTOM,
                        x + SLICE.LEFT, y + height - SLICE.BOTTOM, targetCenterW, SLICE.BOTTOM);

    // 9. Bottom Right Corner
    ctx.drawImage(img, WIDTH - SLICE.RIGHT, HEIGHT - SLICE.BOTTOM, SLICE.RIGHT, SLICE.BOTTOM,
                        x + width - SLICE.RIGHT, y + height - SLICE.BOTTOM, SLICE.RIGHT, SLICE.BOTTOM);
}


// -----------------------------------------------------------------------------
// BUBBLE TEXT PRINTER
// -----------------------------------------------------------------------------

/**
 * It draws text in pixel-art quality without blurring.
 * Includes word-wrap and integer coordinate positioning.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text       - Text to be displayed (lines can be broken with \n)
 * @param {number} centerX    - Horizontal center of the text
 * @param {number} centerY    - Vertical center of the text
 * @param {number} maxWidth   - Maximum line width (px)
 * @param {number} ts         - Tile size (for font scaling)
 * @returns {number}          - Number of rows created
 */
function renderBubbleText(ctx, text, centerX, centerY, maxWidth, ts) {
    const fontSize = Math.max(10, Math.floor(ts * BUBBLE_CONFIG.LAYOUT.TEXT_SIZE));
    ctx.font          = `bold ${fontSize}px "Schoolbell", cursive`;
    ctx.fillStyle     = '#333';
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.imageSmoothingEnabled = false;

    // Word shift
    const lines = [];
    for (const seg of text.split('\n')) {
        const words = seg.split(' ');
        let line = '';
        for (const word of words) {
            const test = line ? line + ' ' + word : word;
            if (ctx.measureText(test).width > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
    }

    const lineH  = fontSize * 1.3;
    const totalH = lines.length * lineH;
    const startY = centerY - totalH / 2 + lineH / 2;

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], Math.round(centerX), Math.round(startY + i * lineH));
    }

    return lines.length;
}


// -----------------------------------------------------------------------------
// MAIN SPEECH BUBBLE MANAGER
// -----------------------------------------------------------------------------

/**
 * Draws the entire balloon system based on Moby's position and escape direction:
 *   1. Small dot (150 ms delay)
 *   2. Large dot (270 ms delay)
 *   3. Balloon frame + text (450 ms delay, fade-in)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} gs      - gameState reference
 * @param {object} assets  - sprite object
 */
function renderSpeechBubble(ctx, gs, assets) {
    const anim = gs.bubbleAnim;
    if (!anim.active) return;

    const ts      = gs.tileSize;
    const oX      = gs.offsetX;
    const oY      = gs.offsetY;
    const elapsed = Date.now() - anim.startTime;

    const mobyScreenX = oX + gs.mobyPos.x * ts;
    const mobyScreenY = oY + gs.mobyPos.y * ts;
    const mobyCenterX = mobyScreenX + ts / 2;
    const mobyCenterY = mobyScreenY + ts / 2;

    const smallDotSize = ts * 0.35;
    const bigDotSize   = ts * 0.55;
    const side         = anim.side;

    // ---- 1. SMALL DOT ----
    const dotSmall = (side === 'right') ? assets.rightDotSmall : assets.leftDotSmall;
    if (dotSmall && elapsed >= 0) {
        const alpha = Math.min(1, elapsed / 150);
        const dotX  = (side === 'right')
            ? mobyCenterX + ts * 0.25
            : mobyCenterX - ts * 0.25 - smallDotSize;
        const dotY  = mobyCenterY - ts * 0.9;

        ctx.save();
        ctx.globalAlpha           = alpha;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            dotSmall,
            Math.round(dotX), Math.round(dotY),
            Math.round(smallDotSize), Math.round(smallDotSize * 1.2)
        );
        ctx.restore();
    }

    // ---- 2. BIG DOT ----
    const dotBig = (side === 'right') ? assets.rightDotBig : assets.leftDotBig;
    if (dotBig && elapsed >= 120) {
        const alpha = Math.min(1, (elapsed - 120) / 150);
        const dotX  = (side === 'right')
            ? mobyCenterX + ts * 0.60
            : mobyCenterX - ts * 0.60 - bigDotSize;
        const dotY  = mobyCenterY - ts * 1.45;

        ctx.save();
        ctx.globalAlpha           = alpha;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            dotBig,
            Math.round(dotX), Math.round(dotY),
            Math.round(bigDotSize), Math.round(bigDotSize)
        );
        ctx.restore();
    }

    // ---- 3. BUBBLE ----
    if (elapsed < 250) return;

    const bubbleSprite = (side === 'left') ? assets.bubbleLeft : assets.bubbleRight;
    if (!bubbleSprite) return;

    const fadeT   = Math.min(1, (elapsed - 250) / 200);
    const msgList = gs.isWon ? MOBY_WIN_MESSAGES : MOBY_MESSAGES;
    const message = msgList[anim.msgIndex % msgList.length];

    const fontSize  = Math.max(10, Math.floor(ts * BUBBLE_CONFIG.LAYOUT.TEXT_SIZE));
    ctx.font        = `bold ${fontSize}px "Schoolbell", cursive`;

    const padX     = ts * BUBBLE_CONFIG.LAYOUT.PADDING_X + 8;
    const minW     = ts * BUBBLE_CONFIG.LAYOUT.MIN_WIDTH;
    const testMaxW = ts * BUBBLE_CONFIG.LAYOUT.MAX_WIDTH - padX * 2;

    // Word shift (to measure balloon width)
    const lines = [];
    for (const seg of message.split('\n')) {
        const words = seg.split(' ');
        let line = '';
        for (const word of words) {
            const test = line ? line + ' ' + word : word;
            if (ctx.measureText(test).width > testMaxW && line) {
                lines.push(line);
                line = word;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
    }

    let maxLineW = 0;
    for (const l of lines) {
        const w = ctx.measureText(l).width;
        if (w > maxLineW) maxLineW = w;
    }

    let bubbleW = maxLineW + padX * 2;
    if (bubbleW < minW) bubbleW = minW;

    const lineH   = fontSize * 1.3;
    const bubbleH = Math.max(ts * 1.2, lines.length * lineH + ts * 0.6);

    const bubbleX = (side === 'right')
        ? mobyCenterX + ts * 0.5
        : mobyCenterX - ts * 0.5 - bubbleW;

    const bubbleY = mobyCenterY - ts * 1.65 - bubbleH;

    ctx.save();
    ctx.globalAlpha           = fadeT;
    ctx.imageSmoothingEnabled = false;
    draw9Slice(ctx, bubbleSprite, bubbleX, bubbleY, bubbleW, bubbleH);
    renderBubbleText(ctx, message, bubbleX + bubbleW / 2, bubbleY + bubbleH / 2, bubbleW - padX * 2, ts);
    ctx.restore();
}