'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  Search,
  BookOpen,
  Heart,
  Download,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { exploreDecks } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ExploreView() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Medicine', 'Law', 'Computer Science', 'Economics']

  const handleImport = (title: string) => {
    setCopiedId(title)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <motion.main
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1240px] px-4 pb-28 pt-6 md:px-8 md:pt-8 lg:px-10"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Public Knowledge Base
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Find something worth mastering.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Teacher-reviewed and high-yield student decks from academic communities across the Philippines.
        </p>
      </div>

      {/* Categories */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap',
              filter === cat
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Explore Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {exploreDecks
          .filter((d) => filter === 'All' || d.subject === filter)
          .map((deck) => (
            <div
              key={deck.title}
              className="flex flex-col justify-between rounded-[24px] border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {deck.subject}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="size-3.5 text-ember fill-ember" />
                    <span>{deck.likes}</span>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                  {deck.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Curated by {deck.author}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {deck.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-bold text-muted-foreground">
                  {deck.cards} Flashcards · {deck.retention}% Avg Recall
                </span>

                <Button
                  size="sm"
                  variant={copiedId === deck.title ? 'secondary' : 'default'}
                  onClick={() => handleImport(deck.title)}
                  className="gap-1.5"
                >
                  {copiedId === deck.title ? (
                    <>
                      <Check className="size-3.5 text-success" /> Added to Library
                    </>
                  ) : (
                    <>
                      <Download className="size-3.5" /> Clone Deck
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </motion.main>
  )
}
