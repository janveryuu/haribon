# 🎨 Antigravity Frontend & UI/UX Skills Guide (For Claude)

> **Instructions for Claude:**  
> These are the exact **Frontend, UI/UX, and Design Skills & Rules** installed in Antigravity.  
> Whenever you suggest or write frontend code, audit interfaces, design components, or build layouts, adhere strictly to the rules, anti-slop guidelines, typography laws, and composition patterns outlined below.

---

## 1. `impeccable` — Award-Winning Design Director Standard

### Core Philosophy
* Approach every design task as an award-winning design director with impeccable craft: production-grade code, peak creativity, a clear point-of-view, deep user empathy, and zero shortcuts.
* **Refinement preserves; redesign replaces.** Never split the difference into mediocre polish on a discarded look.
* **The brief wins.** Honor pinned aesthetics, materials, and palettes even when they conflict with generic patterns.

### Surface Modes
* **Persuade:** Visitor decides and acts (Landing pages, marketing, pricing). Design is the hero.
* **Operate:** Visitor completes a task (App UI, dashboards, study sheets, editors). Scanability, consistency, visual hierarchy, and speed outrank decoration. Brand lives in precise details.
* **Read:** Visitor understands something (Docs, articles, guides). Structured for comprehension.
* **Experience:** Visitor is inside the work (Portfolios, showcases). The artifact leads; the interface recedes.

### Design Directive Actions
* `shape`: Plan UX/UI and information architecture before writing code.
* `polish`: Final quality pass (spacing, micro-interactions, contrast, typography rhythm).
* `bolder`: Amplify safe or bland designs with high-conviction visual choices.
* `quieter`: Tone down aggressive or overstimulating interfaces.
* `distill`: Strip away unnecessary clutter, cards-in-cards, and visual noise.
* `harden`: Ensure production readiness (empty states, errors, extreme text lengths, i18n, mobile edge cases).
* `onboard`: Design activation flows, first-run empty states, and frictionless onboarding.
* `animate`: Add purposeful motion that answers user actions (never gratuitous loops).
* `typeset`: Elevate typographic hierarchy, tracking, line-height, and tabular numerals.
* `adapt`: Optimize responsive behavior for all viewport sizes (desktop, tablet, mobile).

---

## 2. `taste` — Anti-Slop & High-Craft Design Floor

### Strictly Banned "AI Slop" Clichés
1. **NO decorative background blur blobs:** Strictly ban random glowing purple/cyan gradient blur circles (`bg-purple-500/20 blur-3xl`).
2. **NO generic icon badges:** Stop placing an icon inside a low-opacity colored circle on top of every card.
3. **NO harsh solid borders:** Replace 1px solid high-contrast borders with subtle alpha borders (`rgba(255, 255, 255, 0.07)` on dark, `rgba(0, 0, 0, 0.06)` on light).
4. **NO muddy drop shadows:** Use crisp, multi-layered shadows with low opacity or rely solely on surface-tone shifts.

### Typographic Discipline
* **Display Tracking:** Apply tight tracking (`tracking-tight` / `-0.02em`) to large display headers.
* **Label Tracking:** Apply expanded tracking (`tracking-wider` / `+0.05em`) to small uppercase metadata labels.
* **Tabular Figures:** Always apply `tabular-nums` (`font-variant-numeric: tabular-nums`) to metrics, counters, percentages, and timers to prevent layout jitter.
* **Tone Over Scale:** Differentiate information using font weight and muted opacity before reaching for giant font sizes.

### Spacing & Concentric Geometry
* **Concentric Radius Formula:**  
  $$\text{Outer Radius} = \text{Inner Radius} + \text{Padding}$$  
  *(e.g. If an inner button has `radius: 12px` and container padding is `16px`, outer card radius must be `28px`).*
* **Intentional Negative Space:** Give key metrics and primary content room to breathe; eliminate decorative filler.

### Color Restraint (60/30/10 Rule)
* **60% Neutral Surface:** Canvas, cards, background.
* **30% Structural Hierarchy:** Text, borders, subtle dividers.
* **Max 10% Semantic Accent:** Emerald (success), Amber (urgency/momentum), Blue (primary action). Strictly reserved for meaning—never as decorative wallpaper.

---

## 3. `design-taste-frontend` — Landing, Portfolio & Visual Dials

### The Three Configuration Dials
* **`DESIGN_VARIANCE` (1 to 10):** `1` = rigid symmetry, `10` = artistic/experimental. (Default: `7–8`).
* **`MOTION_INTENSITY` (1 to 10):** `1` = static, `10` = cinematic physics. (Default: `6`).
* **`VISUAL_DENSITY` (1 to 10):** `1` = spacious gallery, `10` = dense cockpit/data table. (Default: `3–4`).

### Anti-Default Discipline
Do not default to:
* Centered hero over dark mesh.
* Three identical feature cards in a row.
* Monospace font applied aimlessly to regular text.
* Inter + slate-900 on everything.
* Hand-rolled SVG icons (use official icon libraries with consistent `strokeWidth`).

### Stack Conventions
* **React Server Components (RSC) Safety:** Keep interactive leaf components marked with `'use client'`. Never put continuous animation loops in parent server trees.
* **No `useState` for Continuous Physics:** Use Motion's `useMotionValue`, `useTransform`, or CSS scroll-driven animations instead of React state for mouse/scroll tracking to avoid rerender thrashing.

---

## 4. `frontend-design` — Distinctive Point of View & Intentional Copy

### Grounding in Subject Matter
* Every interface must feel tailored to its domain (e.g. Fetch’s loyal pup motif, tactile card physics, active-recall pack ranks, forgetting curves) rather than a generic SaaS template.
* Spend boldness in **one place**: let one hero element or focal interaction be memorable; keep the rest quiet, disciplined, and supportive.

### Copywriting as Design Content
* **User Perspective:** Label controls by what the user understands, not by internal database or code structures.
* **Active CTAs:** Use specific action verbs ("Start smart review", "Create deck", "Save changes") instead of generic terms ("Submit", "Click here").
* **Emptiness & Errors:** Empty states must invite immediate action with clear prompts; error messages should guide recovery without apologetic filler.
* **Line Length:** Maintain comfortable reading measure (max 65–80 characters per line for body copy).

---

## 5. `web-design-guidelines` — Accessibility & Polish Audit

* **Keyboard Navigation:** Full accessibility via `Tab`, `Space`, `Enter`, `Escape`, and arrow keys.
* **Focus Rings:** Visible, high-contrast focus rings (`focus-visible:outline-2 focus-visible:outline-offset-2`).
* **Color Contrast:** WCAG AA/AAA compliance for text against background surfaces in both light and dark modes.
* **Touch Targets:** Minimum 44×44px interactive area for all mobile tap targets.
* **Reduced Motion:** Always respect `@media (prefers-reduced-motion: reduce)`.

---

## 6. `vercel-react-best-practices` — High-Performance React & Next.js

* **Eliminating Waterfalls (CRITICAL):**
  * Use `Promise.all()` for independent asynchronous operations.
  * Start fetch promises early, await late.
  * Use React Suspense boundaries for non-blocking UI streaming.
* **Bundle Size Optimization (CRITICAL):**
  * Avoid barrel file re-exports; import modules directly.
  * Use `next/dynamic` for heavy client modals and charts.
* **Re-render Optimization:**
  * Do not subscribe to global state inside components that only need it in event callbacks.
  * Derive state during render instead of in `useEffect`.
  * Pass initialization functions to `useState(() => expensiveCompute())`.
  * Use `React.useTransition` for non-blocking search/filter updates.

---

## 7. `vercel-composition-patterns` — Scalable Component APIs

* **Avoid Boolean Prop Proliferation:** Replace `isLoading`, `isCompact`, `isCard`, `hasBadge` with compound components (`<Card.Header>`, `<Card.Body>`, `<Card.Action>`) or explicit variants.
* **Children Over Render Props:** Favor flexible `children` composition.
* **React 19 Readiness:** Use `React.use()` instead of nested context consumers; avoid `forwardRef` in React 19+.

---

## 8. `vercel-react-view-transitions` — Native Page & Route Motion

* Use the browser View Transitions API (`startViewTransition` or React 19 `<ViewTransition>`) for smooth shared-element morphing (e.g. expanding a deck card into the full study sheet).
* Directional navigation (forward/back slide) without third-party heavy dependencies.

---

## 9. `theme-factory` — Cohesive Font & Color Palettes

* **Curated Themes:**
  1. *Modern Minimalist:* Clean grayscale, high contrast.
  2. *Ocean Depths / Midnight Galaxy:* Deep navies, obsidian, electric cyan/indigo (matches Fetch).
  3. *Golden Hour / Sunset:* Warm ambers, terracotta, rich twilight accents.
  4. *Tech Innovation:* High-precision monochrome with vibrant focal neon.
* **Contrast Discipline:** Proper luminance balance across surfaces, borders, and typography.

---

## 10. `generative_ui` & `web-artifacts-builder` — Interactive Widget Standards

* **Semantic CSS Variables:** Always use variables (`bg-[var(--card)]`, `text-[var(--foreground)]`) rather than hardcoded colors so widgets adapt automatically to user themes.
* **Card Elevation:** Wrap inline interactive widgets in clean, elevated containers with subtle borders.
