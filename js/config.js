// --- 1. GLOBAL VARIABLES AND SETTINGS ---
const TILE_TYPE = { WATER: 0, LAND: 1, BUOY: 2, MOBY: 3 };
const GAME_CONFIG = {
    TILE_SIZE_MIN: 15,
    TILE_SIZE_MAX: 60,
    BG_COLOR: "#142e47",
    WAVE_COUNT_OUTER: 150,
    WAVE_COUNT_INNER: 20
};
const BUBBLE_CONFIG = {
    // Dimensions in the original sprite rendering (based on the Base64 rendering)
    SPRITE: {
        WIDTH: 36,  // Total width of the sprite
        HEIGHT: 26, // Total height of the sprite
        // 9-Slice cutting points (edge ​​thicknesses of pixel-art sprites)
        SLICE: { LEFT: 8, RIGHT: 8, TOP: 8, BOTTOM: 8 }
    },
    // The balloon's behavior within the game
    LAYOUT: {
        MARGIN_Y: 1.5,      // How far above/below Moby will it appear (in Tile terms)?
        TEXT_SIZE: 0.4,     // Text size (ratio to tile size)
        PADDING_X: 0.3,     // Space between the text and the balloon border
        MIN_WIDTH: 3,       // Minimum balloon width (in Tiles)
        MAX_WIDTH: 7
    },
    ANIMATION: {
        SPEED: 0.01          // Balloon's swinging speed
    }
};

const BUBBLE_SIDE = Object.freeze({ LEFT: 'left', RIGHT: 'right' });