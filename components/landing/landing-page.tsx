'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowRight,
  Camera,
  Check,
  Flame,
  Menu,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  Upload,
  X,
  CircleCheck,
  Zap,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import Image from 'next/image'
import { FetchMark } from '@/components/brand/fetch-mark'
import { RetentionRing } from '@/components/shared/retention-ring'
import { Button } from '@/components/ui/button'
import { StudySheet } from '@/components/shared/study-sheet'

function InteractiveHeroStudyCard({ onStartFullStudy }: { onStartFullStudy: () => void }) {
  const [flipped, setFlipped] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number | null>(2) // Good by default

  const ratings = [
    { label: 'Again', interval: '1m', sub: 'Reset' },
    { label: 'Hard', interval: '6m', sub: 'Difficult' },
    { label: 'Good', interval: '2d', sub: 'Optimal' },
    { label: 'Easy', interval: '5d', sub: 'Mastered' },
  ]

  return (
    <div className="relative rounded-[24px] border border-border bg-card p-5 sm:p-7 shadow-[0_22px_60px_rgba(11,27,77,.08)] transition-all hover:shadow-[0_26px_70px_rgba(11,27,77,.12)]">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          Biology · Card 18 of 32
        </span>
        <span className="rounded-md bg-secondary px-2 py-0.5 font-bold text-primary">
          56% Complete
        </span>
      </div>

      {/* Mini Progress */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: '56%' }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* 3D Flip Interactive Box */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="my-5 cursor-pointer [perspective:1000px]"
        role="button"
        tabIndex={0}
        aria-label="Click to flip interactive card preview"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative min-h-48 sm:min-h-52 w-full [transform-style:preserve-3d]"
        >
          {/* Front (Question) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-background/80 p-5 text-center border border-border/70 [backface-visibility:hidden]">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Image
                src="/illustrations/mitochondrion-fieldbook.png"
                alt=""
                width={40}
                height={40}
                className="size-9 rounded-xl object-cover ring-1 ring-primary/15"
                aria-hidden="true"
              />
              <span>Active Recall Question</span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-foreground">
              What is the primary purpose of the electron transport chain?
            </h3>
            <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
              <RotateCcw className="size-3" /> Tap to reveal answer
            </p>
          </div>

          {/* Back (Answer) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-deep p-5 text-center text-deep-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-ember">
              Verified Explanation
            </span>
            <p className="font-medium text-sm sm:text-base leading-relaxed text-deep-foreground">
              To establish a proton gradient across the mitochondrial membrane that powers ATP synthesis.
            </p>
            <p className="mt-3 text-xs text-deep-foreground/60">
              Tap again to return to question
            </p>
          </div>
        </motion.div>
      </div>

      {/* FSRS Rating Buttons */}
      <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 min-[390px]:grid-cols-4">
        {ratings.map((item, index) => {
          const isSelected = selectedRating === index
          return (
            <button
              type="button"
              key={item.label}
              onClick={() => setSelectedRating(index)}
              className={`min-h-11 rounded-xl px-2 py-2.5 text-center transition-all duration-150 active:scale-95 ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-primary hover:bg-secondary/80'
              }`}
            >
              <span className="block text-xs font-bold">{item.label}</span>
              <span
                className={`block text-[10px] ${
                  isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}
              >
                {item.interval}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
        <span>FSRS adaptive interval engine</span>
        <button
          onClick={onStartFullStudy}
          className="font-bold text-primary hover:underline flex items-center gap-1"
        >
          Try live study session <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

function RetentionVisual() {
  return (
    <div className="grid items-center gap-5 rounded-[24px] border border-border bg-card p-5 shadow-[0_22px_60px_rgba(11,27,77,.08)] sm:grid-cols-[0.8fr_1.2fr] sm:p-7">
      <div className="mx-auto flex flex-col items-center">
        <RetentionRing value={94} size={140} label="retention" />
      </div>
      <div className="rounded-[20px] bg-background p-5 border border-border/60">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Due today · Active recall
        </span>
        <p className="mt-2 font-display text-lg font-bold text-foreground">
          Mitochondrial membrane potential
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Fetch spaced this card forward after 3 consecutive confident recalls.
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-semibold">
          <span className="text-muted-foreground">Next scheduled review</span>
          <strong className="text-primary font-bold">in 5 days</strong>
        </div>
      </div>
    </div>
  )
}

function MomentumVisual() {
  const bars = [
    { day: 'M', val: 30 },
    { day: 'T', val: 52 },
    { day: 'W', val: 43 },
    { day: 'T', val: 72 },
    { day: 'F', val: 59 },
    { day: 'S', val: 88, highlight: true },
    { day: 'S', val: 68, active: true },
  ]

  return (
    <div className="rounded-[24px] border border-border bg-card p-6 shadow-[0_22px_60px_rgba(11,27,77,.08)] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Weekly recall quality
          </p>
          <p className="mt-1 font-display text-4xl font-extrabold text-foreground">
            78<span className="text-lg text-ember">%</span>
          </p>
        </div>
        <span className="rounded-xl bg-secondary px-3.5 py-2 text-xs font-bold text-primary">
          +12% this week
        </span>
      </div>

      <div
        className="mt-8 flex h-36 items-end gap-2.5 sm:gap-3.5"
        aria-label="Weekly recall quality chart"
      >
        {bars.map((item, i) => (
          <div
            key={i}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              className={`fetch-chart-bar w-full rounded-t-lg transition-all ${
                item.highlight
                  ? 'bg-ember'
                  : item.active
                  ? 'bg-primary'
                  : 'bg-primary/20'
              }`}
              style={
                {
                  '--bar-height': `${item.val}%`,
                  height: `${item.val}%`,
                  animationDelay: `${i * 60}ms`,
                } as React.CSSProperties
              }
            />
            <span className="text-xs font-medium text-muted-foreground">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UploadVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-[24px] border border-border bg-card p-6 shadow-[0_22px_60px_rgba(11,27,77,.08)] flex flex-col justify-between">
        <div>
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Upload className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-8 font-display text-xl font-bold text-foreground">
            Upload a PDF
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Turn slide decks and class syllabi into a clean active recall deck in seconds.
          </p>
        </div>
        <div className="mt-6 rounded-lg bg-muted p-2 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <CircleCheck className="size-3.5 text-primary" /> Auto-extracts key definitions
        </div>
      </div>

      <div className="rounded-[24px] bg-deep p-6 text-deep-foreground shadow-[0_22px_60px_rgba(11,27,77,.08)] flex flex-col justify-between">
        <div>
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ScanLine className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-8 font-display text-xl font-bold">
            Scan your notes
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-deep-foreground/70">
            Snap photos of handwritten pages and test yourself while lecture insights are fresh.
          </p>
        </div>
        <div className="mt-6 rounded-lg bg-white/10 p-2 text-xs font-medium text-deep-foreground/80 flex items-center gap-1.5">
          <Zap className="size-3.5 text-ember" /> OCR neural text processing
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [liveStudyOpen, setLiveStudyOpen] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(24 * 60 + 18)

  // Focus Timer toggler
  const toggleTimer = () => {
    setTimerRunning((prev) => !prev)
  }

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const showcases = [
    {
      eyebrow: 'Adaptive Review',
      title: 'Every card earns its next appearance.',
      body: 'Cards adapt to what you actually know — not what the deck assumes. Fetch keeps difficult ideas close and lets mastered material breathe.',
      visual: <RetentionVisual />,
    },
    {
      eyebrow: 'FSRS Scheduling',
      title: 'Spaced repetition, scientifically tuned.',
      body: 'A modern scheduler that models your brain’s forgetting curve, rather than using a static multiplier. One honest rating gives FSRS the exact calibration signal it needs.',
      visual: <InteractiveHeroStudyCard onStartFullStudy={() => setLiveStudyOpen(true)} />,
    },
    {
      eyebrow: 'Visible Momentum',
      title: 'Effort you can actually see and feel.',
      body: 'Recall quality and consistent practice make progress visible. The dashboard keeps the next useful action close without turning education into noisy distractions.',
      visual: <MomentumVisual />,
    },
    {
      eyebrow: 'Fast Deck Creation',
      title: 'From raw notes to ready deck in seconds.',
      body: 'Bring in a PDF lecture, paste notes, or photograph your binder. Start with your authentic class materials and get straight to active recall.',
      visual: <UploadVisual />,
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-secondary selection:text-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <nav
          className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8"
          aria-label="Main navigation"
        >
          <FetchMark asLink href="/" />

          <div className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex">
            <a
              className="flex min-h-11 items-center transition-colors hover:text-foreground"
              href="#features"
            >
              Features
            </a>
            <a
              className="flex min-h-11 items-center transition-colors hover:text-foreground"
              href="#how"
            >
              How it works
            </a>
            <a
              className="flex min-h-11 items-center transition-colors hover:text-foreground"
              href="#science"
            >
              Study science
            </a>
          </div>

          <div className="hidden items-center gap-3.5 md:flex">
            <Link
              href="/home"
              className="flex min-h-11 items-center px-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/home"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_rgba(37,71,224,.22)] transition-all hover:-translate-y-0.5 hover:bg-primary/95"
            >
              Start free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border bg-card px-5 py-4 md:hidden shadow-xl"
            >
              <div className="flex flex-col gap-2">
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-semibold text-foreground hover:bg-secondary"
                  href="#features"
                >
                  Features
                </a>
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-semibold text-foreground hover:bg-secondary"
                  href="#how"
                >
                  How it works
                </a>
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-semibold text-foreground hover:bg-secondary"
                  href="#science"
                >
                  Study science
                </a>
                <div className="my-2 border-t border-border pt-3 flex flex-col gap-2">
                  <Link
                    href="/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center rounded-xl border border-border bg-background text-base font-bold text-foreground"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-md"
                  >
                    Start free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section
        id="top"
        className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24"
      >
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-primary">
            <CircleCheck className="size-3.5" /> Free forever · No paywalled learning
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-[-0.055em] text-foreground">
            Fetch what you&apos;re<br />
            <span className="text-primary">about to forget.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Fetch turns studying into a system that actually works — adaptive flashcards, spaced repetition powered by FSRS, focused sessions, and a clear next step whenever you sit down.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/home"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_30px_rgba(37,71,224,.25)] transition-all hover:-translate-y-0.5 hover:bg-primary/95"
            >
              Start studying free <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href="#how"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              See how it works
            </a>
          </div>

          <div
            className="mt-8 flex flex-wrap gap-2"
            aria-label="Illustrative dashboard metrics"
          >
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
              <Flame className="mr-1 inline size-3.5 text-ember fill-ember" aria-hidden="true" />
              12-day rhythm
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
              <Zap className="mr-1 inline size-3.5 text-ember" />
              18 cards due
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
              <CheckCircle2 className="mr-1 inline size-3.5 text-success" />
              94% recall rate
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            An illustrative look at what your dashboard tracks.
          </p>
        </div>

        {/* Right Column: Interactive Hero Widgets */}
        <div className="relative min-w-0 lg:pl-6">
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 lg:mr-4">
            <div className="hidden sm:flex items-center gap-2.5 rounded-[20px] border border-border bg-card/80 px-3.5 py-2 shadow-xs backdrop-blur-sm">
              <Image
                src="/mascot/fetch-ball.png"
                alt="Fetch Pup"
                width={36}
                height={36}
                className="size-8 object-contain"
              />
              <span className="text-xs font-bold text-foreground">
                Good boy energy for your memory.
              </span>
            </div>

            {/* Focus Timer Mini Floating Bar */}
            <div className="flex w-full items-center justify-between rounded-[20px] bg-deep p-4 text-deep-foreground shadow-[0_22px_60px_rgba(11,27,77,.12)] sm:w-60">
              <button
                onClick={toggleTimer}
                className="flex size-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label={timerRunning ? 'Pause focus timer' : 'Start focus timer'}
              >
                {timerRunning ? (
                  <Pause className="size-4 text-ember" />
                ) : (
                  <Play className="size-4 text-white fill-white" />
                )}
              </button>
              <div className="text-right">
                <span className="block font-display text-xl font-bold tracking-tight">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-xs text-deep-foreground/70 font-medium">
                  {timerRunning ? 'Session active' : 'Focus session'}
                </span>
              </div>
            </div>
          </div>

          <div className="rotate-[1deg] transition-transform hover:rotate-0">
            <InteractiveHeroStudyCard onStartFullStudy={() => setLiveStudyOpen(true)} />
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="border-y border-border bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              Inside Fetch
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              What studying with Fetch actually looks like.
            </h2>
          </div>

          <div className="mt-16 flex flex-col gap-20 sm:gap-28">
            {showcases.map((item, index) => (
              <article
                key={item.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={index % 2 ? 'lg:order-2' : ''}>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 text-balance font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {item.body}
                  </p>
                </div>
                <div className={index % 2 ? 'lg:order-1' : ''}>{item.visual}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            A sustainable rhythm
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Your daily study cadence.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[24px] border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Upload className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                1. Build your deck
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Add cards yourself, import lecture slides via PDF, or scan handwriting already sitting on your desk.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                Explore deck creator <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </article>

          <article className="rounded-[24px] border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Play className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                2. Study your way
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Review with active recall, honest confidence ratings, and focus sessions that comfortably fit your study hours.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/decks"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                View sample decks <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </article>

          {/* Full Width Payoff Card */}
          <article className="overflow-hidden rounded-[28px] bg-deep p-7 text-deep-foreground lg:col-span-2 lg:mt-4 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14 lg:p-12 shadow-[0_25px_60px_rgba(11,27,77,.18)]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-ember">
                The Payoff
              </span>
              <h3 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Show up daily.
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-deep-foreground/75 text-sm sm:text-base">
                Keep the daily promise small. Fetch remembers the long arc — even when real life costs you a day with streak freeze protection.
              </p>
            </div>

            <div className="mt-8 lg:mt-0">
              <p className="text-xs font-bold uppercase tracking-wider text-deep-foreground/60 mb-3">
                3-Week Study Consistency Heatmap
              </p>
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                {Array.from({ length: 21 }).map((_, i) => {
                  const completed = [1, 2, 4, 7, 8, 9, 11, 14, 15, 16, 17, 18, 20].includes(i)
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg transition-transform hover:scale-105 flex items-center justify-center text-[10px] font-bold ${
                        completed
                          ? 'bg-ember text-deep shadow-sm'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {completed ? '✓' : ''}
                    </div>
                  )
                })}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Study Science Section */}
      <section id="science" className="mx-auto max-w-7xl px-5 pb-20 sm:pb-28 lg:px-8">
        <div className="rounded-[28px] bg-deep px-6 py-12 text-deep-foreground sm:px-12 sm:py-16 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-16 shadow-[0_25px_70px_rgba(11,27,77,.2)]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ember">
              Memory science, made usable
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
              Built on how memory actually works.
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-deep-foreground/75 text-sm sm:text-base">
              Active recall instead of passive re-reading. Spaced repetition instead of last-minute cramming. Confidence ratings feed an FSRS scheduler, so every card comes back exactly when you&apos;re about to forget it.
            </p>

            <div className="mt-8">
              <Link
                href="/home"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_10px_30px_rgba(37,71,224,.3)] transition-all hover:-translate-y-0.5 hover:bg-primary/95"
              >
                Start your first study session <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ul className="mt-10 flex flex-col gap-4 lg:mt-4">
            {[
              { title: 'FSRS spaced repetition on every card', desc: 'Mathematical forgetting curve calibration.' },
              { title: 'Active recall generation', desc: 'Produce-the-answer recall over simple visual recognition.' },
              { title: 'Streak freeze insurance', desc: 'Progress survives a missed day without breaking momentum.' },
              { title: 'Multiplayer Live Play arena', desc: 'Study together in real-time class game rooms.' },
            ].map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3.5 rounded-[20px] bg-white/5 border border-white/10 p-4"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
                  <Check className="size-3.5 stroke-[3]" aria-hidden="true" />
                </span>
                <div>
                  <span className="font-semibold text-sm sm:text-base leading-snug block">
                    {item.title}
                  </span>
                  <span className="text-xs text-deep-foreground/60 mt-0.5 block">
                    {item.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <FetchMark />
          <div className="flex flex-wrap gap-6 text-xs font-semibold text-muted-foreground">
            <Link href="/home" className="hover:text-foreground">App Dashboard</Link>
            <Link href="/decks" className="hover:text-foreground">Decks</Link>
            <Link href="/explore" className="hover:text-foreground">Explore</Link>
            <Link href="/tutor" className="hover:text-foreground">AI Tutor</Link>
          </div>
          <p className="max-w-md text-xs leading-5 text-muted-foreground sm:text-right">
            Free, forever, for every student. Never let a card go unretrieved.
          </p>
        </div>
      </footer>

      {/* Interactive Study Sheet Modal (Live trial from landing page) */}
      <StudySheet
        open={liveStudyOpen}
        onClose={() => setLiveStudyOpen(false)}
      />
    </main>
  )
}
