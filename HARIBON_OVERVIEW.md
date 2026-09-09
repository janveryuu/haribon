# 🦅 Haribon (Agila) — Complete Product, UI/UX & Technical Overview

> **Context for Claude:**  
> You are reviewing **Haribon**, a modern active-recall and spaced repetition study platform tailored for students (specifically with high-school & collegiate context in the Philippines like STEM, Pre-Med, Law, etc.).  
> Below is the complete breakdown of the codebase, tech stack, design system, current frontend implementation, UI/UX structure (matching the live dashboard at `localhost:3000/home`), data models, and backend integration requirements. Use this context to provide targeted frontend UI/UX suggestions and backend architecture recommendations.

---

## 1. Product Identity & Core Concept
* **App Name:** **Haribon** (inspired by the Philippine Eagle / Agila, symbolizing sharp vision, endurance, and flight).
* **Core Philosophy:** Combines **Active Recall + FSRS (Free Spaced Repetition Scheduler) + Socratic AI Tutoring + Gamification (Flight Ranks, Momentum XP, Streaks, Live Arenas)**.
* **Taglines & Metaphors:**
  * *"Your memory has work ready."*
  * *"Raw notes in. Ready to study out."*
  * *"Flight Rank"* (levels & XP), *"Cards are fading"* (forgetting curve urgency).

---

## 2. Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Language** | TypeScript 5.7+ |
| **Styling** | Tailwind CSS v4, PostCSS, Custom CSS Variables |
| **Component Primitives** | Base UI (`@base-ui/react`), Shadcn UI structure |
| **Animations** | `motion/react` (Framer Motion v13), `tw-animate-css` |
| **Icons** | `lucide-react` |
| **Current Data Layer** | In-memory mock data (`lib/mock-data.ts`), Client-side state |

---

## 3. UI/UX Design System & Color Tokens

The app features a **Deep Slate / Electric Blue / Ember Gold** aesthetic with native Dark Mode support:

### Color Palette (`app/globals.css`):
* **Dark Mode (Default in Screenshot):**
  * `Background`: Deep Midnight Navy (`#08143d`)
  * `Cards / Surfaces`: Elevated Navy Slate (`#132355`, `#0b1b4d`)
  * `Primary Accent`: Vibrant Electric Indigo/Blue (`#6d88ff` dark / `#2547e0` light)
  * `Ember / Gold (Gamification)`: Warm Amber (`#f2a93b`) for XP, Streaks, Trophies, and Urgent Warnings.
  * `Success Emerald`: `#42bd8d` for mastered cards, high accuracy, and completed quests.
  * `Destructive Coral`: `#ee756e` / `#e15249` for "Again" / missed cards.
* **Typography:**
  * **Headings/Display:** Manrope (`font-display`) — bold, geometric, confident.
  * **Body/UI:** Inter (`font-sans`) — readable, clean tracking.
* **Border Radii:** Rounded cards (`rounded-[22px]` to `rounded-[28px]`), smooth pill buttons (`rounded-full` or `rounded-xl`).

---

## 4. Complete Map of Current Screens & Features

### 1. The Home Dashboard (`/home` — Screen in screenshot)
* **Left Navigation Sidebar (Desktop):**
  * Custom geometric Haribon Eagle SVG logo with amber live status dot.
  * Nav links: **Home** (active), **My decks** (badge count `4`), **Explore**, **AI tutor** (with `AI` badge), **Live play** (Swords icon).
  * **"Your Flight Rank" Widget:** Shows current tier (*Level 18*), progress bar (72%), and *"380 XP to Trailblazer"*.
  * **User Profile Anchor:** Avatar with initials (*"AM"*), Name (*Alex Mendoza*), Subtext (*Grade 12 · STEM*), and Settings gear.
* **Sticky Topbar:**
  * Quick-search button with `⌘ K` keyboard trigger.
  * Streak indicator badge: `🔥 12 days`.
  * Dark / Light mode toggle (Sun / Moon icon).
  * Notification center drawer (e.g., *"23 cards due in Cellular respiration"*).
* **Active Recall Hero Banner (Split Grid):**
  * **Left (Daily Urgent Queue):** High-contrast deep navy banner with an active pulsing amber beacon.
    * Headline: *"23 cards are fading."*
    * Subtext: *"A focused 12-minute active recall review will bring your retention score back above 90%."*
    * CTA button: *"Start smart review →"* (launches the flashcard sheet directly).
    * Circular animated SVG **Retention Ring** displaying `71% recall`.
  * **Right (Today's Momentum Tracker):**
    * Daily XP count (`640 XP`) with lightning bolt badge.
    * Weekly bar chart (Mon–Sun) showing relative study effort; active day dynamically highlighted.
* **"Pick up where you left off" (Urgency-sorted Decks):**
  * Grid of active decks displaying circular retention percentages, subject badges, card count, and due count.
  * Current mock decks:
    1. **Cellular respiration** (Biology, 78% retention, 12 due / 42 cards)
    2. **Philippine history & Katipunan** (History, 91% retention, 7 due / 68 cards)
    3. **Integral calculus & Series** (Math, 64% retention, 4 due / 35 cards)
    4. **Organic synthesis & Mechanisms** (Chemistry, 82% retention, 9 due / 54 cards)
* **Daily Quests & Creation Shortcuts (Bottom of Page):**
  * Interactive checklist: *"Review 20 cards today (+80 XP)"*, *"Keep 90% accuracy (+120 XP)"*, etc.
  * One-tap shortcuts: *"Upload a PDF"* (slides to cards) and *"Scan your notes"* (OCR handwritten notes).

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
* **Session Complete Screen:** Shows earned XP badge, updated streak, and review recap.

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
* Chat interface with conversational Socratic teaching.
* Instead of merely giving direct answers, the tutor explains concepts using analogies and automatically attaches an **Active Recall Multiple-Choice Check** right in the chat message to test comprehension.
* Quick starter prompts tailored to curriculum (e.g. Krebs cycle, Katipunan Kartilya, Integration techniques).

---

### 5. Multiplayer Live Play Arena (`/play` — `live-play-view.tsx`)
* Synchronous gamified study battle (Kahoot/Quizizz style).
* Features countdown timers, live leaderboard (ranking peers by score and streak), room codes, and instant correct/incorrect visual feedback.

---

### 6. Explore & Deck Library (`/explore`, `/decks`)
* Community public knowledge base with decks from UP Diliman, Ateneo, DLSU, and UST.
* Tag filtering, likes counter, and **1-click Clone to Library**.

---

## 5. Current Data Models (`lib/mock-data.ts`)

```typescript
export interface Flashcard {
  id: string
  deckId: string
  subject: string
  question: string
  answer: string
  hint?: string
  lastInterval?: string
  confidence?: 'again' | 'hard' | 'good' | 'easy'
}

export interface Deck {
  id: string
  title: string
  subject: string
  cards: number
  due: number
  retention: number
  color: string
  badgeBg?: string
  description?: string
  author?: string
  cardsList: Flashcard[]
}

export interface Quest {
  id: string
  title: string
  xp: number
  completed: boolean
  iconType: 'check' | 'timer' | 'flame' | 'sparkles'
}

export interface UserProfile {
  name: string
  initials: string
  grade: string
  level: number
  streak: number
  totalXp: number
  todayXp: number
  levelTitle: string
  xpToNextLevel: number
  aiUsesRemaining: number
}
```

---

## 6. Where the App Needs Suggestions & Next Steps

When advising on this project, please consider:

1. **Frontend & UI/UX Polish:**
   * Suggestions to make the card review experience even more tactile (sound effects, haptics, swipe gestures for mobile).
   * Micro-animations for XP gains, streak maintenance, and rank promotions.
   * UX improvements for the 4-mode deck creation flow (upload progress states, token cost display, batch card editing).
   * Mobile responsiveness refinement for bottom sheets and tables.

2. **Backend & Database Architecture:**
   * **Recommended Database:** Supabase (PostgreSQL) schema design for users, decks, flashcards, review logs, and quests.
   * **Spaced Repetition Engine:** Implementing real **FSRS v4/v5** or SM-2 scheduling algorithms (stability, difficulty, interval calculations).
   * **AI Pipeline:** Best practices for processing user PDFs/images (e.g. Claude 3.5 Sonnet / Vision or Gemini Flash for OCR + structured JSON output into cards).
   * **Realtime / Live Play:** Architecture for the multiplayer study arena using WebSockets or Supabase Realtime Channels.
   * **Auth & Offline Sync:** Recommendations for offline study session caching with PWA or LocalStorage sync.
