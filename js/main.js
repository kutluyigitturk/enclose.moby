// =============================================================================
// main.js — The game's entry point; event listeners and launch order
// =============================================================================


/**
 * It is called after all modules have been loaded.
 * The event binds listeners, loads assets, and starts the game loop.
 */
async function initGame() {

    // SCREEN RESIZING
    window.addEventListener('resize', resize);

    //  MOUSE EVENTS (Desktop)
    // We are trying to unlock the audio upon the first user interaction (click).
    canvas.addEventListener('mousedown', async (e) => {
        await unlockAudio();
        handleInput(e, 'click');
    });

    canvas.addEventListener('mousemove', (e) => handleInput(e, 'hover'));

    // Reset the hover when the mouse leaves the play area
    canvas.addEventListener('mouseleave', () => gameState.hoverPos = { x: -1, y: -1 });

    // TOUCH EVENTS (Mobile / iOS) 
    // We send both hover and click events on touchstart:
    //   → hover: When you hover over Moby, a speech bubble should appear.
    //   → click: trigger buoy placement/removal
    // Additionally, since touchstart is considered a "gesture," audio unlock is also performed here.
    canvas.addEventListener('touchstart', async (e) => {
        if (e.cancelable) e.preventDefault();
        await unlockAudio();
        handleInput(e, 'hover');
        handleInput(e, 'click');
    }, { passive: false });

    // Update the hover position while swiping
    canvas.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
        handleInput(e, 'hover');
    }, { passive: false });

    // Reset Button
    document.getElementById('reset-btn').onclick = () => {
        playSFX('resetSound');
        if (gameState.submitted) {
            document.getElementById('reset-confirm-title').textContent = t('mobyTip');
            document.getElementById('reset-confirm-text').textContent = t('resetConfirm');
            document.getElementById('reset-go-back').textContent = t('goBack');
            document.getElementById('reset-yes').textContent = t('resetYes');
            document.getElementById('reset-confirm-modal').style.display = 'flex';
            return;
        }
        loadLevel(gameState.currentLevelIndex);
    };

    // Reset Confirm — Go Back
    document.getElementById('reset-go-back').onclick = () => {
        playSFX('resetSound');
        document.getElementById('reset-confirm-modal').style.display = 'none';
    };

    // Reset Confirm — Yes, Reset
    document.getElementById('reset-yes').onclick = () => {
        playSFX('resetSound');
        document.getElementById('reset-confirm-modal').style.display = 'none';
        clearLevelState(gameState.currentLevelIndex);
        loadLevel(gameState.currentLevelIndex);
    };

    document.getElementById('submit-btn').textContent = t('submit');

    // STARTUP ORDER
    await loadAssets();              // 1. Upload images and sounds
    initMobySounds();                // 2. Prepare the sound objects
    initSFX();                       // 3. Play SFX sound
    initSoundButton();               // 4. Set the status of the sound button
    loadLevel(LEVELS.length - 1);    // 5. Load the final level
    updateAllUI();                   // 6. Button texts are also localized upon initial launch
    loop();                          // 7. Start the rendering cycle
}

// Start the game once the page has fully loaded
window.onload = initGame;