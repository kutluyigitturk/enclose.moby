<div align="center">

# enclose.moby

### *Enclose the Moby Dick in the biggest possible pen!*

[![Play Now](https://img.shields.io/badge/▶_PLAY_NOW-1a1a2e?style=for-the-badge&logo=github&logoColor=white)](https://kutluyigitturk.github.io/enclose.moby)
[![Version](https://img.shields.io/badge/version-0.4-blue?style=for-the-badge)](https://github.com/kutluyigitturk/enclose.moby)
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
- 📏 Smaller enclosure = Higher score
- ✨ The game auto-detects when Moby is trapped

---

## ⚡ Features

### 🧠 Smart Game Mechanics
- **Auto-Detection System** — BFS algorithm instantly calculates if Moby Dick is trapped after each buoy placement
- **Area-Based Scoring** — Score is determined by how small the enclosed area is, not by buoys used
- **Non-Blocking Gameplay** — No annoying pop-ups; continue playing even after winning

### 🎨 Visual Design
- **Dynamic Wave System** — Intense waves outside the play area, calm waters inside
- **Detailed Islands** — 4 different land tile variations with borders and textures
- **Layered Rendering** — Win effects render below Moby Dick, grid lines above all elements
- **Animated Buoys** — Smooth 4-frame spawn animation when placing buoys
- **Ghost Preview** — Semi-transparent preview shows where buoys will be placed

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
| Vanilla JavaScript | Game logic & BFS pathfinding |
| CSS3 | UI styling & animations |
| Base64 | Embedded sprites & assets |

---

## 🗺️ Roadmap

- [x] Core gameplay mechanics
- [x] BFS pathfinding algorithm
- [x] Dynamic wave animations
- [x] Area-based scoring system
- [x] Mobile touch support
- [ ] Additional levels
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

| Version | Date | Changes |
|---------|------|---------|
| v0.1 | 2025-01-29 | Initial release - Core mechanics, 1 level |
| v0.2 | 2025-01-29 | Bug Fixes, Change font family, 1 level |
| v0.3 | 2025-01-31 | Responsive design, dynamic scaling, UI improvements |
| v0.4 | 2025-02-01 | Mobile support, buoy sprite fix, touch controls |

---

## 📋 Changelog

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
