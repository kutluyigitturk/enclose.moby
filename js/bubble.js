// =============================================================================
// bubble.js — Konuşma balonu yapılandırması, mesajlar ve render fonksiyonları
// =============================================================================

// -----------------------------------------------------------------------------
// 9-SLICE BALON ÇERÇEVE ÇİZİCİSİ
// -----------------------------------------------------------------------------

/**
 * Verilen sprite'ı bozmadan keyfi boyuta uzatarak çizer.
 * Köşeler olduğu gibi kalır; kenarlar ve merkez esnetilir.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img   - Balon sprite'ı
 * @param {number} x               - Hedef sol üst X
 * @param {number} y               - Hedef sol üst Y
 * @param {number} width           - İstenen genişlik
 * @param {number} height          - İstenen yükseklik
 */
function draw9Slice(ctx, img, x, y, width, height) {
    const { SLICE, WIDTH, HEIGHT } = BUBBLE_CONFIG.SPRITE;

    // Orijinal sprite'daki orta bölüm boyutları
    const centerW = WIDTH  - SLICE.LEFT - SLICE.RIGHT;
    const centerH = HEIGHT - SLICE.TOP  - SLICE.BOTTOM;

    // Ekranda kaplanacak orta bölüm boyutları
    const targetCenterW = width  - SLICE.LEFT - SLICE.RIGHT;
    const targetCenterH = height - SLICE.TOP  - SLICE.BOTTOM;

    // 1. Sol Üst Köşe
    ctx.drawImage(img, 0, 0, SLICE.LEFT, SLICE.TOP,
                        x, y, SLICE.LEFT, SLICE.TOP);

    // 2. Üst Kenar (yatay uzatma)
    ctx.drawImage(img, SLICE.LEFT, 0, centerW, SLICE.TOP,
                        x + SLICE.LEFT, y, targetCenterW, SLICE.TOP);

    // 3. Sağ Üst Köşe
    ctx.drawImage(img, WIDTH - SLICE.RIGHT, 0, SLICE.RIGHT, SLICE.TOP,
                        x + width - SLICE.RIGHT, y, SLICE.RIGHT, SLICE.TOP);

    // 4. Sol Kenar (dikey uzatma)
    ctx.drawImage(img, 0, SLICE.TOP, SLICE.LEFT, centerH,
                        x, y + SLICE.TOP, SLICE.LEFT, targetCenterH);

    // 5. Merkez (her iki yönde uzatma)
    ctx.drawImage(img, SLICE.LEFT, SLICE.TOP, centerW, centerH,
                        x + SLICE.LEFT, y + SLICE.TOP, targetCenterW, targetCenterH);

    // 6. Sağ Kenar (dikey uzatma)
    ctx.drawImage(img, WIDTH - SLICE.RIGHT, SLICE.TOP, SLICE.RIGHT, centerH,
                        x + width - SLICE.RIGHT, y + SLICE.TOP, SLICE.RIGHT, targetCenterH);

    // 7. Sol Alt Köşe
    ctx.drawImage(img, 0, HEIGHT - SLICE.BOTTOM, SLICE.LEFT, SLICE.BOTTOM,
                        x, y + height - SLICE.BOTTOM, SLICE.LEFT, SLICE.BOTTOM);

    // 8. Alt Kenar (yatay uzatma)
    ctx.drawImage(img, SLICE.LEFT, HEIGHT - SLICE.BOTTOM, centerW, SLICE.BOTTOM,
                        x + SLICE.LEFT, y + height - SLICE.BOTTOM, targetCenterW, SLICE.BOTTOM);

    // 9. Sağ Alt Köşe
    ctx.drawImage(img, WIDTH - SLICE.RIGHT, HEIGHT - SLICE.BOTTOM, SLICE.RIGHT, SLICE.BOTTOM,
                        x + width - SLICE.RIGHT, y + height - SLICE.BOTTOM, SLICE.RIGHT, SLICE.BOTTOM);
}


// -----------------------------------------------------------------------------
// BALON METİN YAZICI
// -----------------------------------------------------------------------------

/**
 * Metni pixel-art kalitesinde bulanıklaşmadan çizer.
 * Kelime kaydırma (word-wrap) ve tam sayı koordinat oturturma içerir.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text       - Görüntülenecek metin (\n ile satır kırılabilir)
 * @param {number} centerX    - Metnin yatay merkezi
 * @param {number} centerY    - Metnin dikey merkezi
 * @param {number} maxWidth   - Maksimum satır genişliği (px)
 * @param {number} ts         - Tile boyutu (font ölçeklemesi için)
 * @returns {number}          - Oluşturulan satır sayısı
 */
function renderBubbleText(ctx, text, centerX, centerY, maxWidth, ts) {
    const fontSize = Math.max(10, Math.floor(ts * BUBBLE_CONFIG.LAYOUT.TEXT_SIZE));
    ctx.font          = `bold ${fontSize}px "Schoolbell", cursive`;
    ctx.fillStyle     = '#333';
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.imageSmoothingEnabled = false;

    // Kelime kaydırma
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
// ANA KONUŞMA BALONU YÖNETİCİSİ
// -----------------------------------------------------------------------------

/**
 * Moby'nin konumuna ve kaçış yönüne göre bütün balon sistemini çizer:
 *   1. Küçük nokta  (150 ms gecikmeli)
 *   2. Büyük nokta  (270 ms gecikmeli)
 *   3. Balon çerçevesi + metin  (450 ms gecikmeli, fade-in)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} gs      - gameState referansı
 * @param {object} assets  - sprites nesnesi
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

    // ---- 1. KÜÇÜK NOKTA ----
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

    // ---- 2. BÜYÜK NOKTA ----
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

    // ---- 3. BALON ----
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

    // Kelime kaydırma (balon genişliğini ölçmek için)
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