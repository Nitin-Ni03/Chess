# ♟️ Grandmaster Chess - Modern Web Application

A premium modern Chess Game web application with a classic wooden aesthetic and advanced modern features, built using **React 19, Vite, Tailwind CSS v4, Chess.js**, and modern web APIs.

---

## 🌟 Key Features

### 🎨 Design & UI
- **Realistic 3D Wooden Board Effect**: Dynamic CSS transforms, soft ambient shadows, beveled wood edging, and tactile piece rendering.
- **6 Hand-Crafted Board Themes**:
  - 🪵 **Classic Wood** (FIDE tournament walnut & maple)
  - 🏛️ **Marble** (Polished slate & Carrara marble)
  - 👑 **Royal Gold** (Imperial burnished gold & antique brass)
  - 🌌 **Dark Modern** (Stealth obsidian & sleek slate)
  - ⚡ **Cyberpunk** (Neon cyan & hyper magenta)
  - 🍃 **Neon Emerald** (Vibrant mint & forest emerald)
- **Glassmorphism HUD**: Translucent frosted panels, micro-animations, and fluid responsive layouts for desktop, tablet, and mobile.
- **Audio Synthesis Engine**: Realistic Web Audio API acoustic soundscapes for piece moves, crisp captures, castling, check warnings, and victory fanfare.

### ⚔️ Game Modes
1. **Player vs Player (Local)**: Pass-and-play with auto board rotation or fixed orientation.
2. **Player vs Computer (AI)**:
   - **Easy**: Fast play with dynamic variance.
   - **Medium**: Positional play using piece-square evaluation.
   - **Hard**: Minimax engine with Alpha-Beta pruning, mobility scoring, king safety, and quiescence capture resolution.
3. **Online Multiplayer**: Peer-to-peer room creation, 6-character room codes, shareable invite links, and real-time move synchronization.
4. **Spectator Mode**: Live view of ongoing peer games.

### ⏱️ Clocks & Tournament Formats
- **Bullet (1+0)**
- **Blitz (3+0, 5+0)**
- **Rapid (10+0)**
- **Unlimited**

### 🧠 Game Assistance & Analysis
- Legal move markers, capture targets, and king check pulsing indicators.
- Live position evaluation bar (-10 to +10 advantage score).
- Smart move suggestion & hints.
- Real-time threat detection (flags undefended/attacked pieces).
- Captured pieces tray with material differential counter (+1, +3, +5).

### 📜 Move Tracking & PGN/FEN
- Interactive SAN move history with jump-to-move, step-backward, and step-forward.
- PGN export & download.
- PGN import & replay.
- Live FEN string generator & clipboard copy.

### 📊 Statistics & ELO Rating
- Player profile with simulated ELO progression.
- Win/loss/draw counters, win streaks, and recent match archive.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure
```
frontend/src/
 ├── ai/           # Minimax engine, Alpha-Beta pruning, evaluation tables
 ├── components/   # Modular React UI components (Board, HUD, Clocks, Panels)
 ├── context/      # Chess state & settings Context providers
 ├── hooks/        # Custom React hooks (game logic, timers, audio)
 ├── multiplayer/  # P2P & BroadcastChannel real-time room synchronization
 ├── services/     # Web Audio API sound engine
 ├── styles/       # Tailwind CSS v4 stylesheets and 3D transforms
 ├── utils/        # Chess helpers, PGN/FEN utilities, localStorage
 ├── App.jsx       # Root dashboard & navigation orchestrator
 └── main.jsx      # Vite React root mounting
```
