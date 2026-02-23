<div align="center">

<h1 align="center"><img src="assets/MobyDick.png" width="30" height="30" alt="Enclose Moby Logo" /> enclose.moby </h1>

### *Enclose the Moby Dick in the biggest possible pen!*

[![Play Now](https://img.shields.io/badge/▶_PLAY_NOW-1a1a2e?style=for-the-badge&logo=github&logoColor=white)](https://kutluyigitturk.github.io/enclose.moby)
[![Version](https://img.shields.io/badge/version-0.8.3-blue?style=for-the-badge)](https://github.com/kutluyigitturk/enclose.moby)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

<br>

<img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/screenshoots/enclosemobyv0_9.jpg" alt="enclose.moby gameplay — Desktop" width="600">

*Desktop*

<img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/screenshoots/enclosemobyv0_9_moibl.png" alt="enclose.moby gameplay — iPhone 13-Safari" width="280">

*iPhone 13 — Safari*

<br>

*A strategic puzzle game where you trap the legendary white whale*
</div>

---

## 🎮 How to Play

**Objective:** Trap Moby Dick in the smallest possible area using buoys.

| Action | Desktop | Mobile |
|--------|---------|--------|
| Place buoy | `Left Click` on sea tile | `Tap` on sea tile |
| Remove buoy | `Left Click` on placed buoy | `Tap` on placed buoy |
| Reset level | Click `Reset` button | Tap `Reset` button |

### 📋 Rules

- 🌊 Click/tap on sea tiles to place buoys (walls)
- 🚫 You have limited buoys per level
- 🐋 Moby Dick cannot swim diagonally or over walls
- 📏 Bigger enclosure = Higher score
- ✨ The game auto-detects when Moby is trapped

---

## ⚡ Features

### 🧠 Smart Game Mechanics
- **Auto-Detection System** — BFS algorithm instantly calculates if Moby Dick is trapped after each buoy placement
- **Area-Based Scoring** — Score is determined by how small the enclosed area is, not by buoys used
- **Non-Blocking Gameplay** — No annoying pop-ups; continue playing even after winning

### 🎨 Visual & UI Enhancements
- **Layered Rendering System** — Distinct layers for terrain, grid, entities, and UI to prevent visual artifacts.
- **Global Grid System** — Pixel-perfect grid lines with adjustable opacity (0% - 100%) via Settings.
- **Smart Wave Logic** — Inner waves align perfectly to grid cells; outer waves respect a buffer zone.
- **Menu System** — Consolidated UI with a dropdown menu and dedicated Settings modal.

### 📱 Cross-Platform Support
- **Full Mobile Support** — Touch controls work seamlessly on iOS and Android
- **Responsive Design** — Game scales to fit any screen size
- **Dynamic TILE Sizing** — Grid adapts from 15px to 60px based on device

### 🖥️ User Interface
- **Integrated Scoreboard** — Score displayed as `Area: X` in the bottom-right corner
- **Custom Favicon** — Moby Dick icon in browser tab
- **Modular Architecture** — Codebase split into 9 dedicated JS modules for maintainability and scalability
- **Dropdown Menu** — Access past puzzles via hamburger menu

---

## 🛠️ Technical Details

```
├── index.html        # Entry point
├── style.css         # All UI styles
├── README.md         # This file
└── js/
    ├── config.js     # Constants & game configuration
    ├── strings.js    # Localization strings for TR / EN
    ├── levels.js     # Level data
    ├── assets.js     # Base64 sprites & audio
    ├── bubble.js     # Speech bubble config, messages & rendering
    ├── state.js      # Game state, sound management, asset loading
    ├── ui.js         # Menus, modals, input handling & resize
    ├── game.js       # Core logic: waves, win condition, pathfinding
    ├── renderer.js   # Rendering pipeline & draw loop
    └── main.js       # Entry point: initGame & event listeners
```

| Technology | Usage |
|------------|-------|
| HTML5 Canvas | Game rendering |
| Vanilla JavaScript | Game logic (OOP Architecture) & BFS pathfinding |
| CSS3 | UI styling & animations |
| Base64 | Embedded sprites & assets |

---

## 🗺️ Roadmap

- [x] Core gameplay mechanics
- [x] BFS pathfinding algorithm
- [x] Dynamic wave animations
- [x] Area-based scoring system
- [x] Mobile touch support
- [x] Refactor to OOP Architecture (v0.5)
- [x] Additional levels
- [x] Modular JS architecture — 9 dedicated modules (v0.8)
- [ ] Level editor
- [ ] Leaderboard system

---

## 🚀 Run Locally

```bash
# Clone the repository
git clone https://github.com/kutluyigitturk/enclose.moby.git

# Open in browser
cd enclose.moby
open index.html  # macOS
# or
start index.html # Windows
```

Or simply visit: **[kutluyigitturk.github.io/enclose.moby](https://kutluyigitturk.github.io/enclose.moby)**

---

## 📝 Version History

| Version |    Date    | Changes |
|---------|------------|---------|
| v0.1    | 2026-01-29 | Initial release - Core mechanics, 1 level |
| v0.2    | 2026-01-29 | Bug Fixes, Change font family, 1 level |
| v0.3    | 2026-01-31 | Responsive design, dynamic scaling, UI improvements |
| v0.4    | 2026-02-01 | Mobile support, buoy sprite fix, touch controls |
| v0.5    | 2026-02-01 | Clean Code Refactor, OOP Architecture, High DPI Support |
| v0.6    | 2026-02-01 | Layered Rendering, Settings Menu & Smart Waves |
| v0.6.1  | 2026-02-02 | Added Happy Moby victory state sprite |
| v0.6.2  | 2026-02-02 | Added New Level, Bug Fixes |
| v0.6.3  | 2026-02-03 | Added About |
| v0.6.4  | 2026-02-04 | Professional UI Overhaul, Tabbed Info Panel & UX Fixes |
| v0.6.5  | 2026-02-07 | Moby Dick Now Helps You With Buoys. The first AI maps |
| v0.6.6  | 2026-02-08 | The Speech Bubble Feature Has Been Improved |
| v0.6.8  | 2026-02-10 | Implement Optimal Solution Preview and Player Solution Toggle |
| v0.6.9  | 2026-02-10 | Fix Mobile Touch Interactions & Best Escape Way Arrow |
| v0.7    | 2026-02-14 | Major visual improvements |
| v0.7.1  | 2026-02-15 | Grass Tile Set Improvement |
| v0.7.2  | 2026-02-16 | Visual Improvements: Winning Prize, Bug Fixes |
| v0.7.3  | 2026-02-16 | Moby Dick Speec Bubbles, New Features Added |
| v0.7.4  | 2026-02-17 | Sound Element Added For Moby Dick | Test |
| v0.8.0  | 2026-02-18 | Modular Architecture Refactor — Monolithic HTML split into 9 JS modules |
| v0.8.1  | 2026-02-19 | Add Buoy Limit Feedback With Shake + Color Flash Animation |
| v0.8.2  | 2026-02-23 | TR/EN Localization System, Custom Font & Level Author Field |
| v0.8.3  | 2026-02-24 | Fix mobile UI improvements — modal width, tab colors & button layout |
---

## 📋 Changelog

### v0.8.2 (2026-02-23) - The "Localization" Update 🌍

**🌐 TR/EN Language System**
- **`strings.js` Module:** A new dedicated localization module added to the JS pipeline. All in-game text is now managed through a centralized `STRINGS` object with `en` and `tr` keys.
- **Language Switch Button:** A translate icon button (Bootstrap Icons) added to the top-right toolbar — between the volume and hamburger menu buttons.
- **`t()` Helper Function:** All UI text is now rendered via `t('key')`, returning the correct string for the active language.
- **`data-i18n` Attribute System:** HTML elements are tagged with `data-i18n` attributes; a single `updateAllUI()` loop updates all of them on language change.
- **Canvas Text Localized:** Buoy counter, Area score, See Optimal, Your Solution and optimal found message all respond to language changes.
- **Moby Messages Localized:** `MOBY_MESSAGES` and `MOBY_WIN_MESSAGES` arrays moved from `config.js` into `strings.js` for clean separation of concerns.
- **Default Language:** Game always starts in English (`'en'`) regardless of previous session.

**🔤 Custom Font**
- **Schoolbell Turkish Support:** Missing Turkish characters (`ğ`, `Ğ`, `ş`, `Ş`, `ı`, `İ`) manually added to the Schoolbell font using FontForge.
- **Self-Hosted Font:** Google Fonts CDN replaced with a locally hosted `Schoolbell-Custom.ttf` via `@font-face`.

**🗺️ Level Improvements**
- **Author Field:** Each level in `levels.js` now has an `author` property (`'Kutlu'` or `'enclose.mobyAi'`).
- **Dynamic Author Display:** "This Level" tab now reads `lvl.author` instead of a hardcoded string.
- **New Level Added:** One new puzzle level added to the game.

---

### v0.8.1 (2026-02-19) - The "Feedback" Update 🔔

**✨ Visual Feedback**
- **Buoy Limit Shake:** When the player tries to place a buoy after reaching the level's limit, the buoy counter triggers a shake + red flash animation.
- **Shake Formula:** `Math.sin(t × π × 7) × (1-t) × 5` — 7 damped oscillations over 500ms.
- **Color Interpolation:** Counter fades from `#9b1b22` (dark red) back to white over the feedback duration.
- **Frame-Independent Timing:** Uses `Date.now()` timestamps for consistent behavior across all frame rates.

**🎨 UI Polish**
- Sound and hamburger menu buttons now have consistent size, alignment and hover opacity transition.
- `lang` attribute corrected from `tr` to `en` to match the game's language.

---

### v0.8.0 (2026-02-18) - The "Modular Architecture" Update 🏗️

**🗂️ Full Codebase Restructure**
- **Monolith → Modules:** The single-file `index.html` (2000+ lines) has been split into 9 dedicated JavaScript modules, each with a single responsibility.
- **`config.js`** — All constants and game configuration (`TILE_TYPE`, `GAME_CONFIG`)
- **`levels.js`** — Level data isolated for easy addition of new puzzles
- **`assets.js`** — All Base64 sprites and audio in one place
- **`bubble.js`** — Speech bubble config, message arrays and all bubble rendering logic
- **`state.js`** — Game state object, sound management, asset loading and level management
- **`ui.js`** — Menus, modals, settings panel, input handling and canvas resize
- **`game.js`** — Core logic: wave generation, BFS win detection, escape pathfinding
- **`renderer.js`** — Full rendering pipeline, draw loop and all sprite helpers
- **`main.js`** — Minimal entry point: event listeners and `window.onload`

---

### v0.6.8 (2026-02-10) - The "Optimal Solution Visualizer" Update 🧠

**👁️ Interactive Optimal Solution Viewer**
- **See Optimal Section:** Introduced a clickable “See Optimal” text under the Area score display. Styled with the game’s native pixel font and subtle opacity-based hover feedback (60% → 100%). Not a button—designed as an immersive in-world UI element.

**🔁 Dual-Solution Toggle System**
- **Solution Toggling** After viewing the optimal solution, players can switch back to their own layout via “Your Solution” toggle. Enables direct comparison between player strategy and the optimal enclosure.

**🎯 Smart Optimal Detection Logic**
- **Strong Deteciton** If the player already found the optimal solution, “See Optimal” displays a confirmation message instead of modifying the map. Prevents redundant visualization and reinforces player achievement.

---

### v0.6.6 (2026-02-08) - The "Responsive Dialogue System" Update 💬

**🧠 Engine-Level UI Refactor**
- **Content-Driven Speech Bubbles:** Speech bubble sizing has been fully decoupled from tile-based scaling. Bubble width and height are now dynamically calculated using real-time text measurement (CanvasRenderingContext2D.measureText()), enabling true responsive UI behavior.
- **Pixel-Perfect Rendering Pipeline:** All bubble UI elements now use integer pixel snapping and enforced imageSmoothingEnabled = false to preserve crisp pixel-art visuals across all resolutions and tile sizes.
- **9-Slice Scalable Bubble Sprites:** Integrated a 9-slice sprite system for speech bubbles, preventing texture distortion during scaling and maintaining consistent pixel-art corners and borders.

**💬 Narrative & Text System Improvements**
- **Manual Line-Break Control:** Line wrapping is now strictly controlled via \n characters, allowing handcrafted narrative pacing and cinematic dialogue layout.
- **Optional Emergency Word Wrapping:** A fallback smart-wrap system was introduced to prevent UI overflow when extremely long messages exceed the maximum bubble width (configurable).
- **Dynamic Text Layout:** Bubble padding, line height, and text centering are now calculated programmatically to ensure consistent visual hierarchy across different message lengths.

**🎯 Direction-Aware UI Behavior**
- **Contextual Bubble Placement:** Speech bubbles automatically spawn on the opposite side of Moby Dick’s escape direction to avoid obstructing the player’s tactical view.

---

### v0.6.5 (2026-02-07) - The "Professional UI" Update 💎

**🤖 AI-Powered Evolution**
- **AI-Generated Maps:** For the first time, levels are procedurally generated using Deep Learning models. Powered by the enclose.mobyAi repository, this system creates unique, complex coastal layouts for infinite replayability.
- **Tactical Foresight:** Hovering over Moby Dick now reveals his calculated escape vector. A dynamic arrow points toward his intended path, allowing players to strategize and cut off his escape routes proactively.

**💬 Immersion & Interaction**
- **The Voice of the Whale:** The hunt is now personal. Moby Dick communicates directly with the player via pixel-art speech bubbles, reacting to blocked paths or celebrating open escape routes to increase engagement.
- **Smart UI Positioning:** Speech bubbles are context-aware; they dynamically appear on the opposite side of Moby's movement direction (e.g., if he moves Left, the bubble appears on the Right) to ensure the player's view of the escape path is never obstructed.

---

### v0.6.4 (2026-02-04) - The "Professional UI" Update 💎

**🚀 UI/UX Revolution**
- **Persistent Help Button:** Added a '?' button in the top-left corner that glows yellow when active.
- **Tabbed Modal System:** Replaced the simple "About" section with a dual-tabbed interface (How to Play / This Level).
- **Backdrop Blur:** Opening any menu or info panel now applies a sophisticated 5px blur to the game field for better focus.
- **Unified Design System:** Re-skinned "Past Puzzles" and "Settings" menus to match the new professional aesthetic (white box, sharp borders, external close button).

**🛠 UX Fixes & Polish**
- **Menu Logic Overhaul:** Fixed a critical bug where closing a modal would accidentally re-open the dropdown menu.
- **Enhanced Close Interaction:** Closing buttons (✕) are now positioned outside the modal boxes for a more modern, accessible feel.
- **Visual Feedback:** Main menu buttons now toggle to yellow when active, providing clear state communication.

---

### v0.6.3 (2026-02-02) - The "Juice" Update 🧃
- **Settings Menu:** Added a about section.

---

### v0.6.2 (2026-02-02) - The "Tidebound" Content Update

**🚀 New Content & Logic** 
- **New Level:** Added "Tidebound", a challenging new puzzle layout (Level 3).
- **Smart Startup: The game now automatically loads the latest added level upon launch or reset, giving players immediate access to new content.

**🎨 UI & Visual Polish** 
- **Header Typography:**  Increased the main title font size to 32px for a bolder, more prominent look.
- **Compact Layout:**  Adjusted the subtitle margin (-10px) to visually group the level name tighter with the game title.

---

### v0.6.1 (2026-02-02) - The "Juice" Update 🧃
- **Visual Feedback:** Moby now displays a happy expression when the level is won!

---

### v0.6 (2026-02-01) - The Visual Polish Update ✨

**🚀 Major Features**
- **Settings Menu:** Added a slider to control Grid Visibility dynamically.
- **Layered Rendering:** Rewrote the `draw()` loop to render layers sequentially (Background > Terrain > Global Grid > Entities > UI). This fixes all opacity overlapping issues.
- **Perfect Waves:** - Inner waves are now centered within their tiles.
    - Outer waves utilize a virtual grid to prevent overlapping with the map area.

**🛠 Tech & Cleanup**
- **Architecture:** Finalized on a "Clean Functional" approach for simplicity and performance.
- **Grid Optimization:** Replaced per-cell `strokeRect` with a global path-based grid drawer for better performance.
- **Asset Management:** Moved all Base64 assets to a dedicated structure at the end of the file for better code readability.

---

### v0.5 (2025-02-01) - The Clean Code Update 🧹

**🛠 Architecture & Refactoring**
- **OOP Transition:** Converted legacy functional code to a modular Class-based structure (`EncloseMobyGame` class).
- **Separation of Concerns:** Decoupled Game Logic from UI Management (`UIManager` object).
- **Code Cleanup:** Removed unused variables (`srcGrass`, etc.), dead code, and magic numbers.
- **Optimized Assets:** Centralized asset loading with `Promise.all` for better performance.

**✨ Visual & Performance Enhancements**
- **High DPI Support:** Added `window.devicePixelRatio` scaling to prevent blurriness on Retina/High-Res displays.
- **Smart Rendering:** Refined `drawLand` logic with pixel-snapping (`+0.5`) for sharper grid lines.
- **CSS Animations:** Added hover effects and micro-interactions to UI buttons.
- **Performance:** Optimized `requestAnimationFrame` loop and input handling events.

---

### v0.4 (2025-02-01)

**📱 Mobile Support**
- Added full touch support for iOS and Android devices
- Touch events (`ontouchstart`, `ontouchmove`) properly handle buoy placement and removal
- Fixed `window.onclick` conflict that was blocking canvas touch events

**🐛 Critical Bug Fix: Mobile Sprite Rendering**
- **Problem:** Buoy sprites were not rendering on mobile devices - only shadows appeared
- **Root Cause:** When TILE size became small (e.g., 19px on mobile), the sprite's `drawY` position became negative, causing it to render outside the visible canvas area
- **Technical Details:**
  - Buoy sprite frame 3 had dimensions 50x75 (ratio 1.5)
  - On mobile with TILE=19px: `drawH = 19 * 1.5 = 28.5px`
  - `drawY = py + TILE - drawH = py + 19 - 28.5 = py - 9.5` (negative offset!)
  - Frames 0-2 worked because they had smaller ratios (≤1.36)
- **Solution:** Resized buoy sprite frame 3 from 50x75 to 50x73 (ratio 1.46), ensuring `drawY` stays within bounds on all screen sizes

**🎨 Visual Improvements**
- Buoy spawn animation now runs at consistent speed (50ms, 100ms, 150ms frames)
- Animation properly completes with `requestAnimationFrame` up to 200ms

**🔧 Technical Fixes**
- Removed debug `console.log` and `alert` statements from production code
- Fixed dropdown menu not closing when clicking outside
- Ghost preview now correctly calculates sprite ratio

---

### v0.3 (2025-01-31)

**🎨 UI/UX Improvements**
- TILE size now dynamically calculated based on screen size (min 15px, max 60px)
- Game area centered horizontally and positioned below header
- Buoy counter now shows "Buoy: x/y" format
- Ghost preview respects level-based wall limits

**✨ Visual Enhancements**
- Buoy placement now has multi-frame spawn animation
- Shadow effect added to buoys for depth
- Ocean waves now render outside game area too
- Moby Dick sprite scales with TILE size

**🔧 Technical Fixes**
- Fixed wave generation to align with offset and TILE
- Ghost preview no longer appears on Moby Dick's position
- All state variables properly reset on level load
- Grid data initialization made more robust
- Win animation uses requestAnimationFrame for smooth rendering

**📱 Responsiveness**
- Header and footer dynamically positioned relative to game area
- Minimum and maximum TILE constraints for small screens
- Removed fixed 10-wall limit, now level-based (currentMaxWalls)

---

<div align="center">

### Can you trap the Moby Dick?

Made with ❤️ by [Kutlu Yigitturk](https://github.com/kutluyigitturk)

<br>

[![GitHub](https://img.shields.io/badge/GitHub-kutluyigitturk-181717?style=flat-square&logo=github)](https://github.com/kutluyigitturk)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kutlu--yigitturk-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/kutlu-yigitturk/)
[![Twitter](https://img.shields.io/badge/Twitter-@KutluYigitturk-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/KutluYigitturk)

</div>
