<div align="center">

# 🐋 enclose.moby

### *Enclose the Moby Dick in the biggest possible pen!*

[![Play Now](https://img.shields.io/badge/▶_PLAY_NOW-1a1a2e?style=for-the-badge&logo=github&logoColor=white)](https://kutluyigitturk.github.io/enclose.moby)
[![Version](https://img.shields.io/badge/version-0.1-blue?style=for-the-badge)](https://github.com/kutluyigitturk/enclose.moby)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<br>

<img src="https://raw.githubusercontent.com/kutluyigitturk/enclose.moby/main/screenshot.png" alt="enclose.moby gameplay" width="600">

*A strategic puzzle game where you trap the legendary white whale*

</div>

---

## 🎮 How to Play

**Objective:** Trap Moby Dick in the smallest possible area using buoys.

| Action | Control |
|--------|---------|
| Place buoy | `Left Click` on sea tile |
| Remove buoy | `Left Click` on placed buoy |
| Reset level | Click `Reset Level` button |

### 📋 Rules

- 🌊 Click on sea tiles to place buoys (walls)
- 🚫 You have limited buoys per level
- 🐋 Moby Dick cannot swim diagonally or over walls
- 📐 Smaller enclosure = Higher score
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
- **Animated Buoys** — Smooth 3-frame animation when placing buoys
- **Ghost Preview** — Semi-transparent preview shows where buoys will be placed

### 🖥️ User Interface
- **Integrated Scoreboard** — Score displayed as `Area: X` in the bottom-right corner
- **Custom Favicon** — Moby Dick icon in browser tab
- **Single File Architecture** — All assets embedded as Base64, no external dependencies

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
- [ ] Additional levels
- [ ] Mobile touch support
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
| v0.1 | 2025 | Initial release - Core mechanics, 1 level |

---

<div align="center">

### 🌊 Can you trap the legendary white whale? 🐋

Made with ❤️ by [Kutlu Yigitturk](https://github.com/kutluyigitturk)

<br>

[![GitHub](https://img.shields.io/badge/GitHub-kutluyigitturk-181717?style=flat-square&logo=github)](https://github.com/kutluyigitturk)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kutlu--yigitturk-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/kutlu-yigitturk/)
[![Twitter](https://img.shields.io/badge/Twitter-@KutluYigitturk-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/KutluYigitturk)

</div>
