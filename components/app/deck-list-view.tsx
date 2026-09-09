'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Library,
  Plus,
  Search,
  BookOpen,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { initialDecks, Deck } from '@/lib/mock-data'
import { RetentionRing } from '@/components/shared/retention-ring'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DeckListViewProps {
  onStartStudy: (deckId: string) => void
}

export function DeckListView({ onStartStudy }: DeckListViewProps) {
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')

  const subjects = ['All', 'Biology', 'History', 'Mathematics', 'Chemistry']

  const filtered = useMemo(() => {
    return initialDecks.filter((deck) => {
      const matchSubject =
        selectedSubject === 'All' || deck.subject === selectedSubject
      const matchSearch =
        deck.title.toLowerCase().includes(search.toLowerCase()) ||
        deck.subject.toLowerCase().includes(search.toLowerCase())
      return matchSubject && matchSearch
    })
  }, [search, selectedSubject])

  return (
    <motion.main
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1240px] px-4 pb-28 pt-6 md:px-8 md:pt-8 lg:px-10"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Deck Library
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Every subject, one memory system.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your decks are dynamically ordered by what requires your attention first.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-transform active:scale-95"
        >
          <Plus className="size-4" />
          <span>New Deck</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={cn(
                'rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap',
                selectedSubject === sub
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your decks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Decks Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((deck) => (
          <div
            key={deck.id}
            className="flex flex-col justify-between rounded-[24px] border border-border bg-card p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {deck.subject}
                </span>
                <span className="text-xs font-bold text-primary">
                  {deck.due} Due Today
                </span>
              </div>

              <h2 className="mt-4 font-display text-lg font-bold text-foreground">
                {deck.title}
              </h2>
              {deck.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {deck.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-3">
                <RetentionRing value={deck.retention} size={48} label="" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {deck.cards} Cards
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {deck.retention}% Recall
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => onStartStudy(deck.id)}
                className="gap-1.5 shadow-none"
              >
                <Play className="size-3.5 fill-current" /> Study
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.main>
  )
}
