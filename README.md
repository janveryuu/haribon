# 🦅 Haribon

> **Active Recall & Spaced Repetition Study Platform**  
> Designed for deep retention, high-yield learning, and student mastery.

---

## 📖 Overview

**Haribon** (inspired by the majestic Philippine Eagle) is an intelligent study platform that combines cognitive science with modern interface design to help students master challenging academic topics.

Key learning pillars:
- **Active Recall Engine:** Stimulate memory retrieval rather than passive recognition.
- **FSRS-Guided Scheduling:** Dynamic review intervals calculated from forgetting curves.
- **Socratic AI Tutor:** An AI study companion that breaks down complex concepts and tests comprehension on the spot.
- **Multiplayer Study Arena:** Timed live battles with peer leaderboards and streak tracking.
- **Multi-Source Material Ingestion:** Rapid conversion of lecture slides, handwritten notes, and outlines into flashcard decks.

---

## ⚡ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Base UI](https://base-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Motion (Framer Motion)](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- pnpm (recommended) or npm / yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/janveryuu/haribon.git
   cd haribon
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/home](http://localhost:3000/home).

---

## 📂 Project Structure

```text
├── app/
│   ├── layout.tsx         # Root layout with typography and metadata
│   ├── globals.css        # Tailwind v4 theme variables (Dark & Light tokens)
│   ├── page.tsx           # Interactive landing page
│   ├── home/              # Active Recall Dashboard
│   ├── decks/             # Deck library with subject filters
│   ├── create/            # AI Deck Builder (PDF, Notes, Paste, Topic)
│   ├── tutor/             # Socratic AI Tutor with inline recall checks
│   └── play/              # Multiplayer study arena with live leaderboards
├── components/
│   ├── app/               # Main application view components
│   │   ├── app-shell.tsx  # Responsive desktop sidebar & mobile navigation
│   │   ├── sidebar.tsx    # Desktop navigation & Flight Rank widget
│   │   ├── topbar.tsx     # ⌘K Search trigger, streak, theme switcher
│   │   ├── dashboard-view.tsx
│   │   ├── deck-creator-view.tsx
│   │   ├── deck-list-view.tsx
│   │   ├── explore-view.tsx
│   │   └── live-play-view.tsx
│   ├── brand/             # Haribon eagle logo mark and badges
│   ├── shared/            # Retention rings, 3D flip study sheet, command palette
│   └── ui/                # Accessible design system primitives
├── lib/
│   ├── mock-data.ts       # Structured type definitions & initial study data
│   └── utils.ts           # Class merging utilities
└── public/                # Static assets & icons
```

---

## 📝 Available Scripts

- `pnpm dev` — Start Next.js development server
- `pnpm build` — Build production application
- `pnpm start` — Run production server

---

## 📄 License

Private & proprietary. Built with ❤️ for students.
