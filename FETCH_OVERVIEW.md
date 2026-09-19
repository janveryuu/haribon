# 🐾 Fetch — Complete Product, UI/UX & Technical Overview

> Backend handoff: read [FETCH_BACKEND_HANDOFF.md](./FETCH_BACKEND_HANDOFF.md) for the current V2.2 route map, backend boundaries, schema proposal, API contract, realtime plan, and migration order. This document remains the broader product/design reference.

> **Context:**  
> You are reviewing **Fetch**, an active-recall and spaced repetition study platform tailored for students (STEM, Pre-Med, Law, etc.).  
> Below is the complete breakdown of the codebase, tech stack, design system, frontend implementation, UI/UX structure, data models, and mascot brand architecture.

---

## 1. Product Identity & Core Concept
* **App Name:** **Fetch**
* **Brand Metaphor:** A loyal, energetic puppy who fetches what your memory is about to drop.
* **Mascot:** Pixel-art German-shepherd-style puppy with blue cap and t-shirt (white paw print). Warm brown fur, big expressive eyes, playful and encouraging.
* **Core Philosophy:** Combines **Active Recall + FSRS (Free Spaced Repetition Scheduler) + Socratic AI Companion + Gamification (Pack Ranks, Momentum XP, Streaks, Live Arenas)**.
* **Taglines & Metaphors:**
  * *"Fetch what you're about to forget."*
  * *"Good boy energy for your memory."*
  * *"Your memory has work ready."*
  * *"Pack Rank"* (levels & XP from New Pup to Pack Leader), *"Cards are fading"* (forgetting curve urgency).

---

## 2. Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Language** | TypeScript 5.7+ |
| **Styling** | Tailwind CSS v4, PostCSS, Custom CSS Variables |
| **Component Primitives** | Base UI (`@base-ui/react`), Shadcn UI structure |
| **Animations** | `motion/react` (Framer Motion v13), `tw-animate-css` |
| **Icons** | `lucide-react`, Official Fetch Mascot Logo (`components/brand/fetch-mark.tsx`) |
| **Audio** | Zero-dependency synthesized Web Audio API sound effects (`lib/sound-effects.ts`) |
| **Current Data Layer** | In-memory mock data (`lib/mock-data.ts`), Client-side state |

---

## 3. UI/UX Design System & Color Tokens

The app features a **Deep Slate / Electric Blue / Ember Gold** aesthetic with native Dark Mode support:

### Color Palette (`app/globals.css`):
* **Dark Mode (Default):**
  * `Background`: Deep Midnight Navy (`#08143d`)
  * `Cards / Surfaces`: Elevated Navy Slate (`#132355`, `#0b1b4d`)
  * `Primary Accent`: Electric Blue (`#2F6BFF` / `#6d88ff`)
  * `Ember / Gold (Gamification)`: Warm Amber (`#f2a93b`) for XP, Streaks, Trophies, and Urgent Warnings.
  * `Success Emerald`: `#42bd8d` for mastered cards, high accuracy, and completed quests.
  * `Destructive Coral`: `#ee756e` / `#e15249` for "Again" / missed cards.
* **Typography:**
  * **Headings/Display:** Geist Sans (`font-display`) — crisp, contemporary, and calm.
  * **Body/UI:** Geist Sans (`font-sans`) — readable with a compact study-app rhythm.
  * **Measurements:** Geist Mono (`font-mono`) for timers, room codes, and tabular metrics.
* **Border Radii:** Rounded cards (`rounded-[22px]` to `rounded-[28px]`), smooth pill buttons (`rounded-full` or `rounded-xl`).

---

## 4. Complete Map of Current Screens & Features

### 1. The Home Dashboard (`/home`)
* **Left Navigation Sidebar (Desktop):**
  * Official Fetch Mascot Logo with amber live status dot.
  * Nav links: **Home** (active), **My decks** (badge count `4`), **Explore**, **AI tutor** (with `AI` badge), **Live play** (Swords icon).
  * **"Your Pack Rank" Widget:** Shows current tier (*Level 18 · Trail Sniffer*), progress bar (72%), and *"380 XP to Scent Tracker"*.
  * **User Profile Anchor:** Avatar with initials (*"AM"*), Name (*Alex Mendoza*), Subtext (*Grade 12 · STEM*), and Settings gear.
* **Sticky Topbar:**
  * Quick-search button with `⌘ K` keyboard trigger.
  * Streak indicator badge: `🔥 12 days`.
  * Dark / Light mode toggle (Sun / Moon icon).
  * Notification center drawer (e.g., *"23 cards due in Cellular respiration"*).
* **Active Recall Hero Banner (Split Grid):**
  * **Left (Daily Urgent Queue):** High-contrast deep navy banner with an active pulsing amber beacon.
    * Headline: *"23 cards are fading."*
    * Subtext: *"A focused 12-minute active recall review will shift your stability factor and bring retention above 90%."*
    * CTA button: *"Start smart review →"* (launches the flashcard sheet directly).
    * Circular animated SVG **Retention Ring** displaying `71% recall`.
  * **Right (Today's Momentum Tracker):**
    * Daily XP count (`640 XP`) with lightning bolt badge.
    * Weekly bar chart (Mon–Sun) showing relative study effort; active day dynamically highlighted.
* **"Pick up where you left off" (Urgency-sorted Decks):**
  * Grid of active decks displaying circular retention percentages, subject badges, card count, and due count.
* **Daily Quests & Creation Shortcuts (Bottom of Page):**
  * Interactive checklist: *"Review 20 cards today (+80 XP)"*, *"Keep 90% accuracy (+120 XP)"*, etc.
  * One-tap shortcuts: *"Upload a PDF"* and *"Scan your notes"*.

---

### 2. Global Study Sheet Modal (`components/shared/study-sheet.tsx`)
* Slide-up modal overlay designed for distraction-free focus.
* **3D Flip Card Animation** using `motion/react` with `[perspective: 1200px]`:
  * **Front:** Subject badge, Question prompt, Optional hint trigger, *"Press Space to reveal"*.
  * **Back:** Detailed verified answer, FSRS review note.
* **FSRS Spaced Repetition Rating Buttons:**
  * `1: Again (<1m)` — Destructive Red
  * `2: Hard (6m)` — Ember
  * `3: Good (2d)` — Primary Blue
  * `4: Easy (5d)` — Success Emerald
* **Session Complete Screen:** Shows jumping celebratory puppy mascot (`fetch-celebrate.png`), *"Session Fetched · Memory Locked"*, earned XP badge, updated streak, and review recap.

---

### 3. Deck Creator View (`/create` — `deck-creator-view.tsx`)
* **Input Modes:**
  1. *PDF or Slides* (Drag & drop PDF syllabus or lecture slides)
  2. *Photo of Notes* (OCR for notebook pages)
  3. *Paste Text* (Raw notes/transcripts)
  4. *Topic & AI Prompt* (Generates complete deck from a topic query)
* **Card Staging & Live Editor:**
  * Preview generated question/answer pairs before saving.
  * Inline card deletion, manual card addition, and title/subject editing.

---

### 4. AI Socratic Tutor (`/tutor` — `ai-tutor-view.tsx`)
* Conversational Socratic study companion featuring Fetch puppy mascot avatar.
* Instead of merely giving direct answers, the tutor explains concepts using analogies and automatically attaches an **Active Recall Multiple-Choice Check** right in the chat message to test comprehension.
* Quick starter prompts tailored to curriculum (e.g. Krebs cycle, Katipunan Kartilya, Integration techniques).

---

### 5. Multiplayer Live Play Arena (`/play` — `live-play-view.tsx`)
* Synchronous gamified study battle with room codes (e.g., `FETCH-88`).
* Features countdown timers, live leaderboard (ranking peers by score and streak), and instant tactile visual feedback.

---

### 6. Explore & Deck Library (`/explore`, `/decks`)
* Community public knowledge base with decks from UP Diliman, Ateneo, DLSU, and UST.
* Empty search states feature the friendly waving mascot (`fetch-wave.png`).
* Tag filtering, likes counter, and **1-click Clone to Library**.

---

## 5. Mascot Asset Map (`public/mascot/`)

V2.2 adds the canonical pose set from the supplied mascot pack. See `public/mascot/manifest.json` and `FETCH_BACKEND_HANDOFF.md` for semantic usage. The older filenames below remain for compatibility with existing screens.

| Asset Path | Character Pose | Intended Placement |
| :--- | :--- | :--- |
| `/mascot/main-mascot.png` | Sitting attentively, cap & tee | Pack Rank Modal current-tier spotlight, AI Tutor welcome hero |
| `/mascot/fetch-ball.png` | Fetch pose with tennis ball in mouth | Landing page hero companion |
| `/mascot/fetch-celebrate.png` | Jumping celebration with stars | Study session complete modal (`study-sheet.tsx`) |
| `/mascot/fetch-wave.png` | Friendly waving paw | Empty search states in Decks and Explore |
| `/mascot/fetch-logo.png` | Square icon avatar | AI Tutor message bubble avatar, square app icons |
