# COVEQUIZ — Next-Generation Mathematics Gaming & Classroom Intelligence Platform
*Working product name: MathQuest Classroom • Configurable for CoveIQ Kashmir*

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/vitest-44%20passed-success)
![Games](https://img.shields.io/badge/games-160%20Quests%20%2B%20100%20GUI%20Games-blue)
![GUI Engine](https://img.shields.io/badge/GUI%20Engine-3000%20Stages%20(Levels%201--5)-success)
![Curriculum](https://img.shields.io/badge/curriculum-NEP%202020%20%7C%20NCF--SE%202023-purple)
![AI Engine](https://img.shields.io/badge/AI%20Coach-Groq%20%7C%20Zero%20PII%20Fallback-orange)

---

## 🌟 Executive Summary

**COVEQUIZ** is an interactive mathematics gaming and classroom intelligence platform engineered for school students across **Levels 1 to 8**. It moves beyond multiple-choice cards into a deep, playable mathematics gaming ecosystem that students genuinely enjoy using and teachers can seamlessly integrate into classroom teaching.

### Core Non-Negotiables Built:
- **Levels 1–8 Quests (160 Games)**: Exactly 20 distinct, fully playable games per level for Levels 1–8.
- **Dedicated GUI Arcade Engine (100 Games, Levels 1–5)**: 20 distinct GUI-based mechanics per level, each with **30 playable stages** (3,000 stages total).
  - Easy: Stages 1–10 (Foundations)
  - Intermediate: Stages 11–20 (Mastery)
  - Advanced: Stages 21–30 (Grand Challenge)
- **Custom Question Count & Distribution**:
  - Presets (5, 10, 15, 20, 30) or custom count (3–100).
  - Quick Challenge difficulty progression: ~30% Easy, ~40% Intermediate, ~30% Advanced (e.g. 10 Qs = 3 Easy, 4 Inter, 3 Adv; 5 Qs = 2 Easy, 2 Inter, 1 Adv; 15 Qs = 5 Easy, 6 Inter, 4 Adv).
  - Stage Journey mode: choose any of the 30 stages with custom question counts.
- **Zero-Friction Student Access**: No login, no password, no email, and no registration required. Students select an avatar and nickname and play immediately.
- **NEP 2020 & NCF-SE 2023 Alignment**: Comprehensive mapping across developmental stages, mathematical domains, competencies, cognitive demands, and learning outcomes.
- **Signature 6-Stage Thinking Engine**: Guides students through *Understand → Represent → Strategise → Solve → Verify → Generalise*.
- **Authoritative Classroom Battles & Teams**: Teacher-launched sessions with 6-character room codes (`CQ-XXXX`), automatic team balancing (Red Falcons vs. Blue Titans), and live scoring.
- **Classroom Projector Mode**: Full-screen, high-contrast display designed for classroom projectors and smartboards.
- **Groq AI Mathematics Coach**: Server-side proxy with configurable models (`llama-3.3-70b-versatile`), zero-PII protection, and automatic 100% deterministic pedagogical fallback if offline.
- **Web Audio API Synthesizer**: Procedural audio chimes, streak chords, and mute toggles with zero external audio assets.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+ / v22+)
- npm (v9+)

### Installation
```bash
git clone <repo-url>
cd "MathQuiz Game"
npm install
```

### Running Locally

#### 1. Start the Frontend (Vite)
```bash
npm run dev
```
*Frontend runs at: `http://localhost:5174` (or `5173`)*

#### 2. Start the Backend & WebSocket Server
```bash
npm run server
```
*Backend API and WebSocket engine run at: `http://localhost:3001`*

#### 3. Run Automated Tests
```bash
npm test
```
*Executes all 22 unit and integration test suites via Vitest.*

#### 4. Production Build
```bash
npm run build
```

---

## 🎮 Game Architecture (160 Games across 8 Levels)

| Level | Developmental Stage | Core Focus Areas | Published Quests | GUI Arcade Games (30 Stages Each) |
| :--- | :--- | :--- | :---: | :---: |
| **Level 1** | Foundational (Prep/L1) | 1-to-1 Counting, Bonds to 10, Number Lines, Comparisons, 2D Shapes, Patterns | **20** | **20 Games (600 Stages)** |
| **Level 2** | Preparatory (L2) | Base-10 Blocks, 2-Digit Regrouping, Arrays, Fair Sharing, Pizza Fractions, Rupee Money, Clocks | **20** | **20 Games (600 Stages)** |
| **Level 3** | Preparatory (L3) | 3-Digit Operations, Times Tables Speedway, Remainders, Fraction Bars, Perimeter, Elapsed Time | **20** | **20 Games (600 Stages)** |
| **Level 4** | Middle Stage (L4) | Multi-digit Fluency, Factor Trees, Divisibility Rules, Protractor Angles, Area vs Perimeter | **20** | **20 Games (600 Stages)** |
| **Level 5** | Middle Stage (L5) | Sieve of Eratosthenes, Unlike Fractions, Decimals, Percentages, Ratios, Quadrant I Coordinates | **20** | **20 Games (600 Stages)** |
| **Level 6** | Middle Stage (L6) | Directed Integers, Rational Numbers, One-Step Equations, Exponents, Parallel Lines, Histograms | **20** | — |
| **Level 7** | Secondary Foundations (L7) | Signed Expressions, Two-Step Equations, Simple Interest, Circle Area & Pi, Triangle Congruence | **20** | — |
| **Level 8** | Secondary Foundations (L8) | Negative Exponents, Pythagorean Theorem, Algebraic Identities, Cylinders, Arithmetic Progressions | **20** | — |
| **TOTAL** | **Levels 1 to 8** | **All Key Mathematical Competencies** | **160 Quests** | **100 Games (3,000 Stages)** |

### The 20 GUI-Based Game Mechanics (Levels 1–5):
1. **Mathematics Tug of War**: Arena rope pull battle with animated ribbon marker and teams.
2. **Number Rocket Launch**: Fuel tanks, boosters, altitude meters, and planetary trajectory.
3. **Math Tower Builder**: Stacking blocks to construct architectural towers with balance stability.
4. **Mathematics Maze Escape**: Dungeon labyrinth grid navigation with keys and locked doors.
5. **Math Treasure Hunt**: Island waypoints, pirate chests, and coordinate compass.
6. **Number Ninja**: Dojo slicing field with falling mathematical targets.
7. **Math Basketball Challenge**: Court, hoop, and physics trajectory aiming.
8. **Arithmetic Racing**: Speed circuit with turbo checkpoints and speedometers.
9. **Balloon Pop Mathematics**: Floating balloons with numbers and expressions satisfying criteria.
10. **Number Bridge Builder**: Canyon chasm suspension bridge with structural trusses.
11. **Math Robot Factory**: Automation grid with directional robot coding commands.
12. **Fraction Pizza Workshop**: Chef wooden board with fractional slice partitions and toppings.
13. **Shape & Geometry Builder**: Blueprint polygon snapping and composite silhouettes.
14. **Number Line Adventure**: Platformer hopping along continuous real lines.
15. **Math Memory Match**: Card-flipping grid matching expressions with values.
16. **Code Breaker Mathematics**: Titanium safe vault with 3 rotary dial pins.
17. **Math Factory Conveyor**: Moving conveyor belt with roller gears and sorting bins.
18. **Target Number Challenge**: Countdown-style bullseye with number tiles and operators.
19. **Logic Grid Detective**: Deductive notepad with 3x3 elimination matrix.
20. **Ultimate Mathematics Arena**: Multi-phase championship boss battle with shields and strategy.

---

## 🧠 The Signature 6-Stage Thinking Engine

Every challenge allows students to trigger the Signature Thinking Engine to understand **WHY** a solution works:
1. **Understand**: Identify known values and the target unknown.
2. **Represent**: Visualize using number lines, 10-frames, fraction strips, balance scales, or coordinate planes.
3. **Strategise**: Select efficient strategies (make-10, decomposition, inverse operations).
4. **Solve**: Execute precision calculations step-by-step.
5. **Verify**: Check result using inverse operations and estimation benchmarks.
6. **Generalise**: Extract underlying mathematical patterns and invariants.

---

## 🏫 Real-Time Classroom Multiplayer & Teacher Desk

1. **Teacher Launches Session**:
   - Selects target level, game, duration (5, 10, 15 min), and mode (*Individual*, *Cooperative*, *Competitive*).
   - Generates a unique 6-character room code (e.g. `CQ-8421`).
2. **Students Join Registration-Free**:
   - Enter `CQ-8421`, pick a math avatar and codename, and join their assigned team immediately.
3. **Projector Mode**:
   - Opens a dedicated, high-contrast full-screen view for classroom smartboards showing live team standings, member cards, and animated score progression.
4. **Class Analytics & Export**:
   - Diagnostic insights into frequent misconceptions and skill accuracy.
   - Downloadable class session report (JSON).

---

## 🤖 Groq AI Mathematics Coach & Security Policy

- **Server-Side Proxy**: Calls Groq via `/api/ai/coach`. API keys are stored strictly in server environment variables and **never** exposed in client bundles.
- **Zero-PII Compliance**: Student names, emails, and identifiers are never transmitted to LLM providers.
- **Deterministic Offline Fallback**: If `GROQ_API_KEY` is not provided or the network is disconnected, the platform continues seamlessly using built-in deterministic pedagogical explanation rules and 3-tier hint ladders.

---

## 🧪 Testing Verification

Run `npm test` to verify:
- Automated curriculum coverage check verifying exactly 20 published games per level and 160 published games overall.
- Exact rational arithmetic, fraction calculations, prime factorization, GCD, and LCM.
- Deterministic question generation, 3-tier hints, and worked solution pipelines.
- Authoritative session store, room code generation, team balance, and scoring algorithms.

---

## 📄 License & Attribution
Designed and built for **CoveIQ Kashmir** and school systems worldwide following NEP 2020 & NCF-SE 2023 educational guidelines.
