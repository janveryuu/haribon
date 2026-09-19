/**
 * Fetch Subject Color System
 * Single source of truth for subject color identity across dark and light mode.
 * Follows the 60/30/10 rule: subject color is strictly identity signal
 * (card accent bar, eyebrow text, filter pill, retention ring),
 * never whole-card decorative background wash.
 * Structured as semantic tokens, not raw hex.
 */

export interface SubjectColorTokens {
  name: string
  // SVG retention ring stroke class
  ring: string
  // Text accent class
  accent: string
  // Muted accent background for badges
  accentMuted: string
  // Full badge styling (bg + text + border) - clean flat tag without dot
  badge: string
  // Eyebrow label styling (uppercase tracking-wider colored text, no dot)
  eyebrow: string
  // Full-height 3.5px curved left accent bar background
  cardBar: string
  // Filter pill inactive (flat tinted background + full readable text tint)
  pill: string
  // Filter pill active (saturated fill + contrast text)
  pillActive: string
  // Active filter button styling (kept for backward compatibility)
  activeFilter: string
  // Border accent
  border: string
}

export const subjects: Record<string, SubjectColorTokens> = {
  biology: {
    name: 'Biology',
    ring: 'text-emerald-600 dark:text-emerald-400',
    accent: 'text-emerald-700 dark:text-emerald-400',
    accentMuted: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badge: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30',
    eyebrow: 'text-emerald-700 dark:text-emerald-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-emerald-500 dark:bg-emerald-400',
    pill: 'bg-emerald-500/12 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25',
    pillActive: 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-[#08143d] font-bold border border-emerald-600 dark:border-emerald-500 shadow-xs',
    activeFilter: 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-[#08143d] font-bold border border-emerald-600 dark:border-emerald-500 shadow-xs',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
  },
  history: {
    name: 'History',
    ring: 'text-amber-600 dark:text-amber-400',
    accent: 'text-amber-700 dark:text-amber-400',
    accentMuted: 'bg-amber-500/10 dark:bg-amber-500/15',
    badge: 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30',
    eyebrow: 'text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-amber-500 dark:bg-amber-400',
    pill: 'bg-amber-500/12 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30 hover:bg-amber-500/20 dark:hover:bg-amber-500/25',
    pillActive: 'bg-amber-600 dark:bg-amber-500 text-white dark:text-[#08143d] font-bold border border-amber-600 dark:border-amber-500 shadow-xs',
    activeFilter: 'bg-amber-600 dark:bg-amber-500 text-white dark:text-[#08143d] font-bold border border-amber-600 dark:border-amber-500 shadow-xs',
    border: 'border-amber-500/30 dark:border-amber-500/40',
  },
  mathematics: {
    name: 'Mathematics',
    ring: 'text-cyan-600 dark:text-cyan-400',
    accent: 'text-cyan-700 dark:text-cyan-400',
    accentMuted: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    badge: 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-500/30',
    eyebrow: 'text-cyan-700 dark:text-cyan-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-cyan-500 dark:bg-cyan-400',
    pill: 'bg-cyan-500/12 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-500/30 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25',
    pillActive: 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-[#08143d] font-bold border border-cyan-600 dark:border-cyan-500 shadow-xs',
    activeFilter: 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-[#08143d] font-bold border border-cyan-600 dark:border-cyan-500 shadow-xs',
    border: 'border-cyan-500/30 dark:border-cyan-500/40',
  },
  chemistry: {
    name: 'Chemistry',
    ring: 'text-purple-600 dark:text-purple-400',
    accent: 'text-purple-700 dark:text-purple-400',
    accentMuted: 'bg-purple-500/10 dark:bg-purple-500/15',
    badge: 'bg-purple-500/10 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/30',
    eyebrow: 'text-purple-700 dark:text-purple-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-purple-500 dark:bg-purple-400',
    pill: 'bg-purple-500/12 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/30 hover:bg-purple-500/20 dark:hover:bg-purple-500/25',
    pillActive: 'bg-purple-600 dark:bg-purple-500 text-white dark:text-[#08143d] font-bold border border-purple-600 dark:border-purple-500 shadow-xs',
    activeFilter: 'bg-purple-600 dark:bg-purple-500 text-white dark:text-[#08143d] font-bold border border-purple-600 dark:border-purple-500 shadow-xs',
    border: 'border-purple-500/30 dark:border-purple-500/40',
  },
  medicine: {
    name: 'Medicine',
    ring: 'text-rose-600 dark:text-rose-400',
    accent: 'text-rose-700 dark:text-rose-400',
    accentMuted: 'bg-rose-500/10 dark:bg-rose-500/15',
    badge: 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/20 dark:border-rose-500/30',
    eyebrow: 'text-rose-700 dark:text-rose-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-rose-500 dark:bg-rose-400',
    pill: 'bg-rose-500/12 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/20 dark:border-rose-500/30 hover:bg-rose-500/20 dark:hover:bg-rose-500/25',
    pillActive: 'bg-rose-600 dark:bg-rose-500 text-white dark:text-[#08143d] font-bold border border-rose-600 dark:border-rose-500 shadow-xs',
    activeFilter: 'bg-rose-600 dark:bg-rose-500 text-white dark:text-[#08143d] font-bold border border-rose-600 dark:border-rose-500 shadow-xs',
    border: 'border-rose-500/30 dark:border-rose-500/40',
  },
  law: {
    name: 'Law',
    ring: 'text-sky-600 dark:text-sky-400',
    accent: 'text-sky-700 dark:text-sky-400',
    accentMuted: 'bg-sky-500/10 dark:bg-sky-500/15',
    badge: 'bg-sky-500/10 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/20 dark:border-sky-500/30',
    eyebrow: 'text-sky-700 dark:text-sky-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-sky-500 dark:bg-sky-400',
    pill: 'bg-sky-500/12 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/20 dark:border-sky-500/30 hover:bg-sky-500/20 dark:hover:bg-sky-500/25',
    pillActive: 'bg-sky-600 dark:bg-sky-500 text-white dark:text-[#08143d] font-bold border border-sky-600 dark:border-sky-500 shadow-xs',
    activeFilter: 'bg-sky-600 dark:bg-sky-500 text-white dark:text-[#08143d] font-bold border border-sky-600 dark:border-sky-500 shadow-xs',
    border: 'border-sky-500/30 dark:border-sky-500/40',
  },
  'computer science': {
    name: 'Computer Science',
    ring: 'text-teal-600 dark:text-teal-400',
    accent: 'text-teal-700 dark:text-teal-400',
    accentMuted: 'bg-teal-500/10 dark:bg-teal-500/15',
    badge: 'bg-teal-500/10 dark:bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/20 dark:border-teal-500/30',
    eyebrow: 'text-teal-700 dark:text-teal-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-teal-500 dark:bg-teal-400',
    pill: 'bg-teal-500/12 dark:bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/20 dark:border-teal-500/30 hover:bg-teal-500/20 dark:hover:bg-teal-500/25',
    pillActive: 'bg-teal-600 dark:bg-teal-500 text-white dark:text-[#08143d] font-bold border border-teal-600 dark:border-teal-500 shadow-xs',
    activeFilter: 'bg-teal-600 dark:bg-teal-500 text-white dark:text-[#08143d] font-bold border border-teal-600 dark:border-teal-500 shadow-xs',
    border: 'border-teal-500/30 dark:border-teal-500/40',
  },
  economics: {
    name: 'Economics',
    ring: 'text-orange-600 dark:text-orange-400',
    accent: 'text-orange-700 dark:text-orange-400',
    accentMuted: 'bg-orange-500/10 dark:bg-orange-500/15',
    badge: 'bg-orange-500/10 dark:bg-orange-500/15 text-orange-800 dark:text-orange-300 border border-orange-500/20 dark:border-orange-500/30',
    eyebrow: 'text-orange-700 dark:text-orange-400 font-semibold tracking-wider uppercase text-[11px]',
    cardBar: 'bg-orange-500 dark:bg-orange-400',
    pill: 'bg-orange-500/12 dark:bg-orange-500/15 text-orange-800 dark:text-orange-300 border border-orange-500/20 dark:border-orange-500/30 hover:bg-orange-500/20 dark:hover:bg-orange-500/25',
    pillActive: 'bg-orange-600 dark:bg-orange-500 text-white dark:text-[#08143d] font-bold border border-orange-600 dark:border-orange-500 shadow-xs',
    activeFilter: 'bg-orange-600 dark:bg-orange-500 text-white dark:text-[#08143d] font-bold border border-orange-600 dark:border-orange-500 shadow-xs',
    border: 'border-orange-500/30 dark:border-orange-500/40',
  },
}

// Backwards compatibility
export const SUBJECT_COLOR_MAP = subjects

// Fallback tokens for any unmapped or dynamic subject
const DEFAULT_SUBJECT_TOKENS: SubjectColorTokens = {
  name: 'General',
  ring: 'text-primary',
  accent: 'text-primary',
  accentMuted: 'bg-primary/10',
  badge: 'bg-primary/10 text-primary border border-primary/20',
  eyebrow: 'text-muted-foreground font-semibold tracking-wider uppercase text-[11px]',
  cardBar: 'bg-primary/60',
  pill: 'bg-muted/70 text-muted-foreground border border-border/80 hover:bg-muted hover:text-foreground',
  pillActive: 'bg-primary text-primary-foreground font-bold shadow-xs',
  activeFilter: 'bg-primary text-primary-foreground font-bold shadow-xs',
  border: 'border-primary/30',
}

/**
 * Returns the semantic color tokens for a given subject name.
 * Normalizes string keys and gracefully falls back to default tokens.
 */
export function getSubjectTokens(subject?: string): SubjectColorTokens {
  if (!subject) return DEFAULT_SUBJECT_TOKENS
  const key = subject.trim().toLowerCase()
  return subjects[key] || DEFAULT_SUBJECT_TOKENS
}
