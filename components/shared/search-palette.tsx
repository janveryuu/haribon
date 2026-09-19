'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import {
  Search,
  BookOpen,
  Library,
  Brain,
  Swords,
  Plus,
  Home,
  X,
  ChevronRight,
  Flame,
} from 'lucide-react'
import { initialDecks, exploreDecks } from '@/lib/mock-data'
import { getSubjectTokens } from '@/lib/subject-colors'
import { motionTokens } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SearchPaletteProps {
  open: boolean
  onClose: () => void
  onSelectDeck?: (deckId: string) => void
}

export function SearchPalette({
  open,
  onClose,
  onSelectDeck,
}: SearchPaletteProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
        else {
          // handled by parent or toggle
        }
      } else if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setQuery('')
    }
  }, [open])

  const quickNav = [
    { label: 'Dashboard Home', href: '/home', icon: Home, badge: 'Overview' },
    { label: 'My Decks Library', href: '/decks', icon: Library, badge: '8 Decks' },
    { label: 'Community Explore', href: '/explore', icon: Search, badge: 'Public' },
    { label: 'AI Study Tutor', href: '/tutor', icon: Brain, badge: '18 Uses' },
    { label: 'Live Play Arena', href: '/play', icon: Swords, badge: 'Multiplayer' },
    { label: 'Create New Deck', href: '/create', icon: Plus, badge: 'AI Builder' },
  ]

  const filteredDecks = useMemo(() => {
    if (!query.trim()) return initialDecks
    const q = query.toLowerCase()
    return initialDecks.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.cardsList.some(
          (c) =>
            c.question.toLowerCase().includes(q) ||
            c.answer.toLowerCase().includes(q)
        )
    )
  }, [query])

  const filteredExplore = useMemo(() => {
    if (!query.trim()) return exploreDecks
    const q = query.toLowerCase()
    return exploreDecks.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [query])

  const handleNavigate = (href: string) => {
    onClose()
    router.push(href)
  }

  const handleDeckClick = (deckId: string) => {
    onClose()
    if (onSelectDeck) {
      onSelectDeck(deckId)
    } else {
      router.push('/home')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-deep/50 p-4 pt-16 sm:pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : motionTokens.durations.backdrop }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={reduceMotion ? { duration: 0 } : motionTokens.springs.dropdown}
            className="flex max-h-[80vh] w-full max-w-xl flex-col rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-card shadow-[0_25px_60px_rgba(11,27,77,.2)] overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex h-14 items-center gap-3 border-b border-black/[0.06] dark:border-white/[0.07] px-4">
              <Search className="size-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search decks, subjects, cards, or commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-90 transition-all duration-150 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <X className="size-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
              {/* Quick Navigation */}
              {!query && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Quick Navigation
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {quickNav.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavigate(item.href)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-secondary active:scale-[0.98] transition-all duration-150 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <item.icon className="size-4 text-primary shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* My Decks */}
              <div>
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Your Decks ({filteredDecks.length})
                </p>
                <div className="space-y-1">
                  {filteredDecks.map((deck) => {
                    const tokens = getSubjectTokens(deck.subject)
                    return (
                      <button
                        key={deck.id}
                        onClick={() => handleDeckClick(deck.id)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary active:scale-[0.99] transition-all duration-150 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={cn('w-1 self-stretch rounded-full shrink-0', tokens.cardBar)}
                            aria-hidden="true"
                          />
                          <div className="min-w-0 pl-1">
                            <p className="font-display font-bold text-foreground truncate">
                              {deck.title}
                            </p>
                            <p className="text-xs text-muted-foreground tabular-nums">
                              <span className={cn('font-semibold', tokens.accent)}>{deck.subject}</span> · {deck.cards} cards ({deck.due} due)
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Study <ChevronRight className="size-3.5" />
                        </span>
                      </button>
                    )
                  })}
                  {filteredDecks.length === 0 && (
                    <p className="px-3 py-2 text-xs text-muted-foreground italic">
                      No matching personal decks.
                    </p>
                  )}
                </div>
              </div>

              {/* Explore Decks */}
              {filteredExplore.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Community & Subjects
                  </p>
                  <div className="space-y-1">
                    {filteredExplore.map((deck) => {
                      const tokens = getSubjectTokens(deck.subject)
                      return (
                        <button
                          key={deck.title}
                          onClick={() => handleNavigate('/explore')}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary active:scale-[0.99] transition-all duration-150 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs truncate">
                              {deck.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground tabular-nums">
                              {deck.author} · {deck.cards} cards
                            </p>
                          </div>
                          <span
                            className={cn(
                              'inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider',
                              tokens.badge
                            )}
                          >
                            {deck.subject}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-black/[0.06] dark:border-white/[0.07] bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
              <span>Use arrow keys or click to select</span>
              <span className="flex items-center gap-1 font-semibold text-primary">
                Fetch Search
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
