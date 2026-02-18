// =============================================================================
// main.js — Oyunun giriş noktası; olay dinleyicileri ve başlatma sırası
// =============================================================================


/**
 * Tüm modüller yüklendikten sonra çağrılır.
 * Olay dinleyicilerini bağlar, varlıkları yükler ve oyun döngüsünü başlatır.
 */
async function initGame() {

    // ── EKRAN YENİDEN BOYUTLANDIRMA ──────────────────────────────────────────
    window.addEventListener('resize', resize);

    // ── MOUSE OLAYLARI (Masaüstü) ────────────────────────────────────────────
    // İlk kullanıcı etkileşiminde (click) audio'yu unlock etmeye çalışıyoruz.
    canvas.addEventListener('mousedown', async (e) => {
        await unlockAudio();
        handleInput(e, 'click');
    });

    canvas.addEventListener('mousemove', (e) => handleInput(e, 'hover'));

    // Mouse oyun alanından çıkınca hover'ı sıfırla
    canvas.addEventListener('mouseleave', () => gameState.hoverPos = { x: -1, y: -1 });

    // ── DOKUNMATİK OLAYLAR (Mobil / iOS) ────────────────────────────────────
    // touchstart'ta hem hover hem click gönderiyoruz:
    //   → hover: Moby'ye dokunulunca konuşma balonu açılsın
    //   → click: şamandıra yerleştirme/kaldırma tetiklensin
    // Ayrıca touchstart bir "gesture" sayıldığı için audio unlock burada da yapılır.
    canvas.addEventListener('touchstart', async (e) => {
        if (e.cancelable) e.preventDefault();
        await unlockAudio();
        handleInput(e, 'hover');
        handleInput(e, 'click');
    }, { passive: false });

    // Parmak sürüklenirken hover konumunu güncelle
    canvas.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
        handleInput(e, 'hover');
    }, { passive: false });

    // ── BUTONLAR ─────────────────────────────────────────────────────────────
    document.getElementById('reset-btn').onclick = () => loadLevel(gameState.currentLevelIndex);

    // ── BAŞLATMA SIRASI ──────────────────────────────────────────────────────
    await loadAssets();            // 1. Görselleri ve sesleri yükle
    initMobySounds();              // 2. Ses nesnelerini hazırla
    initSoundButton();             // 3. Ses butonunun durumunu ayarla
     loadLevel(LEVELS.length - 1);  // 5. Son seviyeyi yükle
    loop();                        // 6. Render döngüsünü başlat
}


// Sayfa tamamen yüklenince oyunu başlat
window.onload = initGame;
