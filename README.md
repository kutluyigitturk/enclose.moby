<div align="center">

<h1 align="center"><img src="assets/MobyDick.png" width="30" height="30" alt="Enclose Moby Logo" /> enclose.moby </h1>

### *Enclose the Moby Dick in the biggest possible pen!*

[![Play Now](https://img.shields.io/badge/▶_PLAY_NOW-1a1a2e?style=for-the-badge&logo=github&logoColor=white)](https://kutluyigitturk.github.io/enclose.moby)
[![Version](https://img.shields.io/badge/version-0.6.7-blue?style=for-the-badge)](https://github.com/kutluyigitturk/enclose.moby)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<br>

<img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/enclosemobyv0_2.jpg" alt="enclose.moby gameplay" width="600">

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
- **Single File Architecture** — All assets embedded as Base64, no external dependencies
- **Dropdown Menu** — Access past puzzles via hamburger menu

---

## 🛠️ Technical Details

```
├── index.html    # Single-file game (HTML + CSS + JS + Base64 assets)
└── README.md     # This file
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
| v0.6.5  | 2026-02-07 | Moby Dick now helps you with buoys. The first AI maps. |
---

## 📋 Changelog

### v0.6.5 (2026-02-04) - The "Professional UI" Update 💎

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
