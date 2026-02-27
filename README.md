<div align="center">

<h1 align="center"><img src="assets/MobyDick.png" width="30" height="30" alt="Enclose Moby Logo" /> enclose.moby </h1>

### *Enclose the Moby Dick in the biggest possible pen!*

[![Play Now](https://img.shields.io/badge/▶_PLAY_NOW-1a1a2e?style=for-the-badge&logo=github&logoColor=white)](https://kutluyigitturk.github.io/enclose.moby)
[![Version](https://img.shields.io/badge/version-0.9-blue?style=for-the-badge)](https://github.com/kutluyigitturk/enclose.moby)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

<div align="center">

  <img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/screenshoots/enclosemobyv0_11.jpg" alt="enclose.moby gameplay — Desktop 1" width="600">
  <br>
  <em>Desktop - Playground</em>
  <br><br>

  <img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/screenshoots/enclosemobyv0_10_winning.jpg" alt="enclose.moby gameplay — Desktop 2" width="600">
  <br>
  <em>Desktop - Winning Animation</em>
  <br><br><br>

  <img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/screenshoots/enclosemobyv0_10_mobile.png" alt="enclose.moby gameplay — iPhone 13-Safari" width="280">
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/screenshoots/enclosemobyv0_10_mobile_winning.png" alt="enclose.moby gameplay — Mobile 2" width="280">
  <br>
  <em>iPhone 13 — Safari - Playground</em>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <em>iPhone 13 — Safari - Winning Animation</em>

<br> </div>

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
| [Base64](https://www.base64-image.de/) | Embedded sprites & assets |

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

## 📖 The Story Behind the Game

enclose.moby started as a single idea: what if you could trap Moby Dick using buoys? The first version had one level, basic click interactions, and almost no visual polish. But the core puzzle loop felt satisfying — and that was enough to keep building.

**The game needed to feel alive.** In the early versions, Moby Dick just sat there waiting. He had no personality, no reaction. So he got a voice. Hovering over him now reveals his escape route with a directional arrow — you can see exactly where he plans to go. He reacts to your moves through pixel-art speech bubbles, taunts you when he sees an opening, and goes quiet when he's cornered. He even sounds different every time. The goal was to make you feel like you're actually hunting something, not just clicking tiles.

**The game needed to be fair.** Puzzle games live and die by clarity. Players needed to understand why they won, and whether they could have done better. This is why the optimal solution preview exists — after winning, you can compare your enclosure against the mathematically best possible solution. If you already found the optimal answer, the game tells you. No ambiguity, no frustration. You either solved it perfectly or you have something to aim for.

**The game needed honest feedback.** When you run out of buoys, the counter shakes and flashes red. It sounds minor, but without it players assumed the game had a bug. Small signals matter enormously. The same thinking produced the ghost preview — a translucent buoy appears before you commit to placing it, removing uncertainty and making every move feel intentional rather than accidental.

**The game needed to speak your language.** Turkish and English are both fully supported, down to a custom-built font that includes the Turkish characters missing from the original typeface. The grid opacity, the sound, the language — all configurable, because different players want different things from the same game.

**The game needed a solid foundation.** At one point the entire codebase was a single 2000-line HTML file. It worked, but it was fragile. A full restructure split everything into nine dedicated JavaScript modules. Players never saw this change, but it made every subsequent improvement faster, safer, and cleaner. Good architecture is invisible until the moment you need it.

The game is still being built. Every version exists because something felt incomplete, something felt unfair, or something felt like it could be more beautiful. That's the only roadmap that matters.


<div align="center">

### Can you trap the Moby Dick?

Made with ❤️ by [Kutlu Yigitturk](https://github.com/kutluyigitturk)

<br>

[![GitHub](https://img.shields.io/badge/GitHub-kutluyigitturk-181717?style=flat-square&logo=github)](https://github.com/kutluyigitturk)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kutlu--yigitturk-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/kutlu-yigitturk/)
[![Twitter](https://img.shields.io/badge/Twitter-@KutluYigitturk-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/KutluYigitturk)

</div>
