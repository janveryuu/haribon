'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Plus,
  ArrowRight,
  Zap,
  ChevronRight,
  Check,
  Timer,
  FileText,
  ScanLine,
  Flame,
  Sparkles,
} from 'lucide-react'
import { RetentionRing } from '@/components/shared/retention-ring'
import { initialDecks, initialQuests, weeklyMomentumData, Quest } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface DashboardViewProps {
  onStartStudy: (deckId?: string) => void
}

export function DashboardView({ onStartStudy }: DashboardViewProps) {
  const [quests, setQuests] = useState<Quest[]>(initialQuests)

  const toggleQuest = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q))
    )
  }

  const completedCount = quests.filter((q) => q.completed).length

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-6 md:px-8 md:pt-8 lg:px-10"
    >
      {/* Top Welcome & Create Action */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
            Active Recall Dashboard
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-balance">
            Your memory has<br className="hidden sm:block" /> work ready, Alex.
          </h1>
        </div>

        <Link
          href="/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_rgba(37,71,224,.22)] transition-all hover:-translate-y-0.5 hover:bg-primary/95 active:scale-95"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Create a deck</span>
        </Link>
      </div>

      {/* Top Banner Grid: Smart Review + Momentum */}
      <section className="mt-8 grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
        {/* Daily Urgent Review Card */}
        <div className="relative overflow-hidden rounded-[26px] bg-deep p-6 text-deep-foreground md:p-8 shadow-[0_20px_50px_rgba(11,27,77,.15)]">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06] [background:repeating-linear-gradient(125deg,transparent,transparent_14px,currentColor_14px,currentColor_15px)] pointer-events-none" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-md">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-deep-foreground/60">
                <span className="size-2 rounded-full bg-ember animate-pulse" />
                <span>Daily Review Queue</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-deep-foreground">
                23 cards are fading.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-deep-foreground/75">
                A focused 12-minute active recall review will bring your retention score back above 90%.
              </p>
              <button
                onClick={() => onStartStudy('bio-respiration')}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-foreground px-5 text-sm font-bold text-deep shadow-md transition-all hover:-translate-y-0.5 hover:bg-white active:scale-95"
              >
                Start smart review <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="sm:pr-4 flex flex-col items-center">
              <RetentionRing
                value={71}
                size={120}
                label="recall"
                color="text-ember"
              />
            </div>
          </div>
        </div>

        {/* Weekly Momentum Tracker Card */}
        <div className="rounded-[26px] border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Today&apos;s Momentum
              </p>
              <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-foreground">
                640 <span className="text-base text-muted-foreground font-semibold">XP</span>
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-ember/15">
              <Zap className="size-5 text-ember fill-ember" />
            </div>
          </div>

          <div className="mt-6 flex h-24 items-end gap-2.5">
            {weeklyMomentumData.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={cn(
                    'w-full max-w-4 rounded-full transition-all',
                    d.active ? 'bg-primary' : 'bg-primary/20'
                  )}
                />
                <span className="text-[10px] font-bold text-muted-foreground">
                  {d.short}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pick Up Where You Left Off (Active Decks Grid) */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Pick up where you left off
            </h2>
            <p className="text-xs text-muted-foreground">
              Sorted by memory urgency and forgetting curve calculations.
            </p>
          </div>
          <Link
            href="/decks"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            All decks ({initialDecks.length}) <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {initialDecks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => onStartStudy(deck.id)}
              className="group flex items-center gap-4 rounded-[22px] border border-border bg-card p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_30px_rgba(11,27,77,.06)] active:scale-[0.99]"
            >
              <RetentionRing value={deck.retention} size={70} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className={cn('size-2 rounded-full shrink-0', deck.color)} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    {deck.subject}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {deck.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {deck.due} due · {deck.cards} cards
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Quests & Creation Tools */}
      <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Daily Quests Card */}
        <div>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Daily quests
            </h2>
            <span className="text-xs font-bold text-primary bg-secondary px-2.5 py-0.5 rounded-full">
              {completedCount} of {quests.length} Completed
            </span>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-xs">
            {quests.map((q) => (
              <div
                key={q.id}
                onClick={() => toggleQuest(q.id)}
                className="flex items-center gap-3.5 border-b border-border p-4 last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full transition-all',
                    q.completed
                      ? 'bg-success text-white'
                      : 'border border-border text-muted-foreground'
                  )}
                >
                  {q.completed ? (
                    <Check className="size-4 stroke-[3]" />
                  ) : (
                    <Timer className="size-3.5" />
                  )}
                </div>
                <p
                  className={cn(
                    'flex-1 text-xs font-semibold',
                    q.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  )}
                >
                  {q.title}
                </p>
                <span className="text-xs font-bold text-ember">
                  +{q.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Deck Creation Shortcuts */}
        <div>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Make study material
            </h2>
            <span className="text-xs font-semibold text-muted-foreground">
              18 AI uses remaining
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Link
              href="/create"
              className="flex min-h-32 flex-col justify-between rounded-[22px] bg-secondary p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-secondary/80 active:scale-95 group"
            >
              <FileText className="size-5 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-foreground">Upload a PDF</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Turn slides into cards
                </p>
              </div>
            </Link>

            <Link
              href="/create"
              className="flex min-h-32 flex-col justify-between rounded-[22px] border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 active:scale-95 group"
            >
              <ScanLine className="size-5 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-foreground">Scan your notes</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Clean handwritten pages
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </motion.main>
  )
}
