'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  RotateCcw,
  Zap,
  CheckCircle2,
  Sparkles,
  Trophy,
  ArrowRight,
  Flame,
  Volume2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Deck, Flashcard, initialDecks } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

interface StudySheetProps {
  open: boolean
  deckId?: string
  onClose: () => void
  onComplete?: (earnedXp: number) => void
}

export function StudySheet({
  open,
  deckId,
  onClose,
  onComplete,
}: StudySheetProps) {
  const currentDeck: Deck =
    initialDecks.find((d) => d.id === deckId) || initialDecks[0]
  const cards: Flashcard[] = currentDeck.cardsList.length > 0
    ? currentDeck.cardsList
    : [
        {
          id: 'def1',
          deckId: 'default',
          subject: currentDeck.subject,
          question: 'What is the primary purpose of active recall?',
          answer:
            'Active recall stimulates memory retrieval during the learning process, creating stronger neural pathways than passive review.',
          hint: 'Retrieval vs. Recognition',
        },
      ]

  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionXp, setSessionXp] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [history, setHistory] = useState<Array<{ cardId: string; rating: string }>>([])

  const currentCard = cards[cardIndex] || cards[0]
  const progressPercent = Math.round(((cardIndex) / cards.length) * 100)

  // Reset state when opening modal
  useEffect(() => {
    if (open) {
      setCardIndex(0)
      setFlipped(false)
      setSessionXp(0)
      setIsCompleted(false)
      setHistory([])
    }
  }, [open, deckId])

  const handleRate = useCallback(
    (rating: 'again' | 'hard' | 'good' | 'easy') => {
      const xpGains = { again: 5, hard: 10, good: 20, easy: 25 }
      const gain = xpGains[rating]
      setSessionXp((prev) => prev + gain)
      setHistory((prev) => [...prev, { cardId: currentCard.id, rating }])

      if (cardIndex + 1 < cards.length) {
        setFlipped(false)
        setCardIndex((prev) => prev + 1)
      } else {
        setIsCompleted(true)
        if (onComplete) {
          onComplete(sessionXp + gain)
        }
      }
    },
    [cardIndex, cards.length, currentCard.id, sessionXp, onComplete]
  )

  // Keyboard navigation
  useEffect(() => {
    if (!open || isCompleted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((prev) => !prev)
      } else if (flipped) {
        if (e.key === '1') handleRate('again')
        if (e.key === '2') handleRate('hard')
        if (e.key === '3') handleRate('good')
        if (e.key === '4') handleRate('easy')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isCompleted, flipped, handleRate, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-deep/60 backdrop-blur-md sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ y: '100%', scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.96 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 320,
              mass: 0.8,
            }}
            className="flex h-[92vh] w-full max-w-3xl flex-col rounded-t-[28px] border border-border bg-background shadow-[0_25px_70px_rgba(11,27,77,.25)] sm:h-[84vh] sm:rounded-[28px] overflow-hidden"
          >
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5 sm:px-7">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="End review session"
              >
                <X className="size-4.5" />
                <span className="hidden sm:inline">End review</span>
              </button>

              <div className="text-center">
                <p className="font-display text-sm font-bold text-foreground">
                  {currentDeck.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isCompleted
                    ? 'Session complete'
                    : `Card ${cardIndex + 1} of ${cards.length}`}
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-ember/15 px-3 py-1 text-xs font-bold text-foreground">
                <Zap className="size-3.5 fill-ember text-ember" />
                <span>+{sessionXp} XP</span>
              </div>
            </header>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: isCompleted ? '100%' : `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Session Body */}
            <div className="relative flex flex-1 flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
              {!isCompleted ? (
                <div className="flex w-full max-w-xl flex-col items-center">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {flipped ? 'Active recall answer' : 'Tap card or space to flip'}
                  </p>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => setFlipped(!flipped)}
                    className="w-full cursor-pointer [perspective:1200px]"
                    role="button"
                    tabIndex={0}
                    aria-label={flipped ? 'Flip back to question' : 'Flip to answer'}
                  >
                    <motion.div
                      animate={{ rotateY: flipped ? 180 : 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 24,
                      }}
                      className="relative min-h-[320px] sm:min-h-[360px] w-full [transform-style:preserve-3d]"
                    >
                      {/* FRONT OF CARD (Question) */}
                      <div className="absolute inset-0 flex flex-col justify-between rounded-[24px] border border-border bg-card p-6 sm:p-8 shadow-[0_18px_45px_rgba(11,27,77,.06)] [backface-visibility:hidden]">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-bold uppercase tracking-wider text-primary">
                            {currentCard.subject}
                          </span>
                          <span className="rounded-md bg-secondary px-2 py-0.5 font-semibold text-primary">
                            Prompt
                          </span>
                        </div>

                        <div className="my-auto py-4 text-center">
                          <h3 className="font-display text-xl sm:text-2xl font-bold leading-relaxed tracking-tight text-foreground">
                            {currentCard.question}
                          </h3>
                          {currentCard.hint && (
                            <p className="mt-4 text-xs italic text-muted-foreground">
                              💡 Hint: {currentCard.hint}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                          <span>Press Space to reveal</span>
                          <span className="flex items-center gap-1 text-primary font-medium">
                            Tap to flip <RotateCcw className="size-3" />
                          </span>
                        </div>
                      </div>

                      {/* BACK OF CARD (Answer) */}
                      <div className="absolute inset-0 flex flex-col justify-between rounded-[24px] bg-deep p-6 sm:p-8 text-deep-foreground shadow-[0_22px_60px_rgba(11,27,77,.18)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div className="flex items-center justify-between text-xs text-deep-foreground/70">
                          <span className="font-bold uppercase tracking-wider text-ember">
                            Key Answer
                          </span>
                          <span className="rounded-md bg-white/10 px-2 py-0.5 font-semibold text-white">
                            FSRS Review
                          </span>
                        </div>

                        <div className="my-auto py-4 text-center">
                          <p className="text-base sm:text-lg font-medium leading-relaxed text-deep-foreground">
                            {currentCard.answer}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-deep-foreground/60 pt-4 border-t border-white/10">
                          <span>Rate your recall honestly</span>
                          <span className="text-ember font-semibold">1-4 keys</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Rating / Control buttons */}
                  <div className="mt-6 w-full max-w-xl">
                    <AnimatePresence mode="wait">
                      {!flipped ? (
                        <motion.div
                          key="show-btn"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex justify-center"
                        >
                          <Button
                            onClick={() => setFlipped(true)}
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px] shadow-[0_10px_30px_rgba(37,71,224,.25)]"
                          >
                            Show answer <RotateCcw className="size-4 ml-1" />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="rating-grid"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="grid grid-cols-4 gap-2 sm:gap-3"
                        >
                          {[
                            { label: 'Again', time: '< 1m', color: 'border-destructive/40 hover:bg-destructive/10 text-destructive', key: 'again' as const },
                            { label: 'Hard', time: '6m', color: 'border-ember/40 hover:bg-ember/10 text-foreground', key: 'hard' as const },
                            { label: 'Good', time: '2d', color: 'border-primary/40 bg-secondary hover:bg-secondary/80 text-primary font-bold', key: 'good' as const },
                            { label: 'Easy', time: '5d', color: 'border-success/40 bg-success/10 hover:bg-success/20 text-success font-bold', key: 'easy' as const },
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => handleRate(item.key)}
                              className={cn(
                                'flex flex-col items-center justify-center rounded-xl border bg-card p-2.5 sm:p-3 text-center transition-all duration-150 active:scale-95 shadow-sm',
                                item.color
                              )}
                            >
                              <span className="text-xs sm:text-sm font-bold">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-0.5">
                                {item.time}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Session Complete View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center max-w-md py-6"
                >
                  <div className="relative mb-5 flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <Trophy className="size-10 text-ember" />
                    <Sparkles className="absolute -top-1 -right-1 size-5 text-ember animate-bounce" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Flight Completed
                  </span>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
                    Deck Cleared!
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    You reviewed {cards.length} cards in {currentDeck.title}. FSRS
                    has recalculated your memory intervals.
                  </p>

                  {/* Stat summary badge */}
                  <div className="my-6 grid grid-cols-2 gap-3 w-full">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs font-bold uppercase text-muted-foreground">
                        Earned XP
                      </p>
                      <p className="mt-1 font-display text-2xl font-extrabold text-ember">
                        +{sessionXp} XP
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs font-bold uppercase text-muted-foreground">
                        Streak Status
                      </p>
                      <p className="mt-1 flex items-center justify-center gap-1 font-display text-2xl font-extrabold text-foreground">
                        <Flame className="size-5 text-ember fill-ember" /> 12 Days
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCardIndex(0)
                        setFlipped(false)
                        setIsCompleted(false)
                      }}
                      className="flex-1"
                    >
                      <RotateCcw className="size-4 mr-1.5" /> Review Again
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                      Done <ArrowRight className="size-4 ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
