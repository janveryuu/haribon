'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useTransform, useReducedMotion } from 'motion/react'
import {
  X,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Undo2,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Deck, Flashcard, initialDecks } from '@/lib/mock-data'
import { getSubjectTokens } from '@/lib/subject-colors'
import { Button } from '@/components/ui/button'
import { sounds } from '@/lib/sound-effects'
import { motionTokens } from '@/lib/motion'
import { ContextualFocusPill } from '@/components/focus/focus-tools-widget'

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
            'Active recall stimulates memory retrieval during learning, creating stronger neural pathways than passive review.',
          hint: 'Retrieval vs. Recognition',
          stability: 4.5,
          difficulty: 3.2,
        },
      ]

  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionXp, setSessionXp] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [history, setHistory] = useState<Array<{ cardId: string; rating: 'again' | 'hard' | 'good' | 'easy'; xpGain: number }>>([])
  const [zenMode, setZenMode] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const reduceMotion = useReducedMotion()

  // Drag physics for mobile swipe
  const dragX = useMotionValue(0)
  const cardRotate = useTransform(dragX, [-200, 200], [-10, 10])
  const againOpacity = useTransform(dragX, [-140, -40], [1, 0])
  const goodOpacity = useTransform(dragX, [40, 140], [0, 1])

  const currentCard = cards[cardIndex] || cards[0]
  const progressPercent = Math.round(((cardIndex) / cards.length) * 100)
  const sessionStorageKey = `fetch-study-session:${currentDeck.id}`
  const recallQuality = history.length > 0
    ? Math.round(
        (history.reduce((sum, item) => sum + ({ again: 25, hard: 55, good: 80, easy: 95 }[item.rating]), 0) /
          history.length)
      )
    : 0

  // Sync mute state
  useEffect(() => {
    setIsMuted(sounds.isMuted())
    const unsub = sounds.subscribe((muted) => setIsMuted(muted))
    return unsub
  }, [])

  // Restore an in-progress review when the student leaves and returns or reloads.
  useEffect(() => {
    if (!open) return

    const saved = window.sessionStorage.getItem(sessionStorageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          cardIndex?: number
          flipped?: boolean
          sessionXp?: number
          history?: Array<{ cardId: string; rating: 'again' | 'hard' | 'good' | 'easy'; xpGain: number }>
        }
        setCardIndex(Math.min(Math.max(parsed.cardIndex ?? 0, 0), Math.max(cards.length - 1, 0)))
        setFlipped(Boolean(parsed.flipped))
        setSessionXp(Math.max(parsed.sessionXp ?? 0, 0))
        setHistory(Array.isArray(parsed.history) ? parsed.history : [])
        setIsCompleted(false)
      } catch {
        window.sessionStorage.removeItem(sessionStorageKey)
      }
    } else {
      setCardIndex(0)
      setFlipped(false)
      setSessionXp(0)
      setIsCompleted(false)
      setHistory([])
    }
    dragX.set(0)
  }, [open, sessionStorageKey, cards.length, dragX])

  // The study surface owns the viewport while active. This prevents the page
  // underneath from drifting when a student swipes or scrolls on mobile.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open || isCompleted) return
    window.sessionStorage.setItem(
      sessionStorageKey,
      JSON.stringify({ cardIndex, flipped, sessionXp, history })
    )
  }, [open, isCompleted, sessionStorageKey, cardIndex, flipped, sessionXp, history])

  const handleFlip = useCallback(() => {
    sounds.playFlip()
    setFlipped((prev) => !prev)
  }, [])

  const handleRate = useCallback(
    (rating: 'again' | 'hard' | 'good' | 'easy') => {
      const xpGains = { again: 5, hard: 10, good: 20, easy: 25 }
      const gain = xpGains[rating]

      sounds.playRating(rating)
      setSessionXp((prev) => prev + gain)
      setHistory((prev) => [...prev, { cardId: currentCard.id, rating, xpGain: gain }])
      dragX.set(0)

      if (cardIndex + 1 < cards.length) {
        setFlipped(false)
        setCardIndex((prev) => prev + 1)
      } else {
        setIsCompleted(true)
        window.sessionStorage.removeItem(sessionStorageKey)
        sounds.playFanfare()
        if (onComplete) {
          onComplete(sessionXp + gain)
        }
      }
    },
    [cardIndex, cards.length, currentCard.id, sessionXp, onComplete, dragX, sessionStorageKey]
  )

  const handleUndo = useCallback(() => {
    if (history.length === 0 || cardIndex === 0) return
    const lastItem = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))
    setSessionXp((prev) => Math.max(0, prev - lastItem.xpGain))
    setCardIndex((prev) => Math.max(0, prev - 1))
    setFlipped(false)
    sounds.playFlip()
  }, [history, cardIndex])

  // Keyboard navigation: Space, Enter, 1-4, Z (undo), M (mute), F (zen)
  useEffect(() => {
    if (!open || isCompleted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleFlip()
      } else if (e.key === 'z' || e.key === 'Z') {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault()
          handleUndo()
        }
      } else if (e.key === 'm' || e.key === 'M') {
        sounds.toggleMute()
      } else if (e.key === 'f' || e.key === 'F') {
        setZenMode((prev) => !prev)
      } else if (flipped) {
        if (e.key === '1') handleRate('again')
        if (e.key === '2') handleRate('hard')
        if (e.key === '3') handleRate('good')
        if (e.key === '4') handleRate('easy')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isCompleted, flipped, handleFlip, handleRate, handleUndo, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-deep/80 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : motionTokens.durations.fast, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ y: '100%', scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.96 }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : motionTokens.springs.modalSheet
            }
            className={cn(
              'flex w-full flex-col rounded-t-[24px] border border-border bg-background shadow-[0_30px_90px_rgba(20,33,61,0.28)] sm:rounded-[24px] overflow-hidden transition-all duration-300',
              zenMode
                ? 'h-[98vh] max-w-4xl sm:h-[94vh]'
                : 'h-[92vh] max-w-3xl sm:h-[86vh]'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="study-session-title"
          >
            {/* Header with Zen Toggle, Audio Toggle, and Undo */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 px-4 sm:px-7">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-[transform,background-color,color] duration-100 ease-out active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40 select-none cursor-pointer"
                  aria-label="End review session"
                >
                  <X className="size-4" />
                  <span className="hidden sm:inline">End review</span>
                </button>

                {history.length > 0 && !isCompleted && (
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-[transform,background-color,color] duration-100 ease-out active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40 select-none cursor-pointer"
                    title="Undo last card (Z)"
                  >
                    <Undo2 className="size-3.5" />
                    <span className="hidden sm:inline">Undo (Z)</span>
                  </button>
                )}
              </div>

              {/* Title & Card Counter */}
              <div className="text-center">
                <p id="study-session-title" className="font-display text-sm font-bold text-foreground">
                  {currentDeck.title}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {isCompleted
                    ? 'Session complete'
                    : `Card ${cardIndex + 1} of ${cards.length}`}
                </p>
              </div>

              {/* Controls: Focus Tools Pill + Sound + Zen Mode */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ContextualFocusPill />

                <button
                  type="button"
                  onClick={() => sounds.toggleMute()}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-[transform,background-color,color] duration-100 ease-out active:scale-90 focus-visible:ring-2 focus-visible:ring-primary/40 select-none cursor-pointer"
                  title={isMuted ? 'Unmute audio (M)' : 'Mute audio (M)'}
                  aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
                >
                  {isMuted ? (
                    <VolumeX className="size-4 text-muted-foreground/60" />
                  ) : (
                    <Volume2 className="size-4 text-primary" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setZenMode(!zenMode)}
                  className="hidden sm:flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-[transform,background-color,color] duration-100 ease-out active:scale-90 focus-visible:ring-2 focus-visible:ring-primary/40 select-none cursor-pointer"
                  title={zenMode ? 'Exit Zen Mode (F)' : 'Zen Focus Mode (F)'}
                  aria-label={zenMode ? 'Exit Zen focus mode' : 'Enter Zen focus mode'}
                >
                  {zenMode ? (
                    <Minimize2 className="size-4 text-primary" />
                  ) : (
                    <Maximize2 className="size-4" />
                  )}
                </button>

                <div className="hidden items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary sm:flex">
                  <span className="tabular-nums">{Math.round(progressPercent)}% complete</span>
                </div>
              </div>
            </header>

            {/* Scientific FSRS Retention Progress Bar */}
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
                  <div className="mb-3 flex items-center justify-between w-full text-xs text-muted-foreground">
                    <span className="font-bold uppercase tracking-[0.14em] text-[10px] text-primary">
                      {flipped ? 'Active recall answer' : 'Tap card or space to flip'}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/80">
                      <span>Hotkey:</span>
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">Space</kbd>
                    </span>
                  </div>

                  {/* 3D Flip Card with Drag Physics on Mobile */}
                  <motion.div
                    style={{ x: dragX, rotate: cardRotate }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.45}
                    onDragEnd={(_, info) => {
                      if (flipped) {
                        if (info.offset.x < -100) handleRate('again')
                        else if (info.offset.x > 100) handleRate('good')
                      }
                    }}
                    onClick={handleFlip}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleFlip()
                      }
                    }}
                    className="relative w-full cursor-pointer [perspective:1200px] select-none"
                    role="button"
                    tabIndex={0}
                    aria-expanded={flipped}
                    aria-label={flipped ? 'Flip back to question' : 'Flip to answer'}
                  >
                    {/* Swipe Visual Feedback Overlays */}
                    {flipped && (
                      <>
                        <motion.div
                          style={{ opacity: againOpacity }}
                        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-start rounded-[20px] border-2 border-destructive bg-destructive/10 pl-8"
                        >
                          <span className="font-display text-lg font-black text-destructive uppercase tracking-wider">
                            Again (&lt;1m)
                          </span>
                        </motion.div>
                        <motion.div
                          style={{ opacity: goodOpacity }}
                        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-end rounded-[20px] border-2 border-primary bg-primary/10 pr-8"
                        >
                          <span className="font-display text-lg font-black text-primary uppercase tracking-wider">
                            Good (+2d)
                          </span>
                        </motion.div>
                      </>
                    )}

                    <motion.div
                      animate={{ rotateY: flipped ? 180 : 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : motionTokens.springs.cardFlip
                      }
                      className="relative min-h-[320px] sm:min-h-[360px] w-full [transform-style:preserve-3d] will-change-transform"
                    >
                      {/* FRONT OF CARD (Question) */}
                      <div aria-hidden={flipped} className="absolute inset-0 flex flex-col justify-between rounded-[20px] border border-primary/15 bg-card p-6 shadow-[0_18px_45px_rgba(20,33,61,.08)] [backface-visibility:hidden] sm:p-8">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {(() => {
                            const tokens = getSubjectTokens(currentCard.subject)
                            return (
                              <span className={cn(tokens.eyebrow, 'text-primary')}>
                                {currentCard.subject}
                              </span>
                            )
                          })()}
                          <div className="flex items-center gap-2">
                            {currentCard.stability && (
                              <span className="text-[10px] text-muted-foreground tabular-nums font-semibold">
                                FSRS S: {currentCard.stability}d
                              </span>
                            )}
                            <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-primary">
                              Prompt
                            </span>
                          </div>
                        </div>

                        <div className="my-auto py-4 text-center">
                          <h3 className="font-display text-xl sm:text-2xl font-bold leading-relaxed tracking-tight text-foreground">
                            {currentCard.question}
                          </h3>
                          {currentCard.hint && (
                              <p className="mt-4 text-xs font-medium text-muted-foreground">
                              Hint: {currentCard.hint}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
                          <span className="text-[11px]">Press Space to reveal</span>
                          <span className="flex items-center gap-1 text-primary font-medium text-[11px]">
                            Tap to flip <RotateCcw className="size-3" />
                          </span>
                        </div>
                      </div>

                      {/* BACK OF CARD (Answer & FSRS Telemetry) */}
                      <div aria-hidden={!flipped} className="absolute inset-0 flex flex-col justify-between rounded-[20px] border border-success/20 bg-accent p-6 text-accent-foreground shadow-[0_22px_60px_rgba(25,185,145,.14)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8">
                        <div className="flex items-center justify-between text-xs text-accent-foreground/70">
                          <span className="font-bold uppercase tracking-wider text-success text-[10px]">
                            Key Answer
                          </span>
                          <span className="rounded-full bg-white/60 px-2.5 py-1 font-semibold text-accent-foreground text-[11px] dark:bg-black/10">
                            FSRS Review
                          </span>
                        </div>

                        <div className="my-auto py-4 text-center">
                          <p className="text-base font-medium leading-relaxed text-accent-foreground sm:text-lg">
                            {currentCard.answer}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-accent-foreground/15 pt-4 text-xs text-accent-foreground/70">
                          <span className="text-[11px]">Rate honestly (1–4 keys)</span>
                          <span className="text-ember font-semibold text-[11px] sm:hidden">
                            ← Swipe Again | Good →
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

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
                            onClick={handleFlip}
                            size="lg"
                            className="w-full sm:w-auto min-w-[220px] shadow-[0_10px_30px_rgba(37,71,224,.25)] font-bold"
                          >
                            Show answer <RotateCcw className="size-4 ml-1.5" />
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
                            {
                              label: 'Again',
                              keyNum: '1',
                              interval: '< 1m',
                              stability: 'Reset S',
                              color: 'border-destructive/40 hover:bg-destructive/10 text-destructive',
                              key: 'again' as const,
                            },
                            {
                              label: 'Hard',
                              keyNum: '2',
                              interval: '6m',
                              stability: 'S: 3.5d',
                              color: 'border-ember/40 hover:bg-ember/10 text-foreground',
                              key: 'hard' as const,
                            },
                            {
                              label: 'Good',
                              keyNum: '3',
                              interval: '2d',
                              stability: 'S: 7.8d',
                              color: 'border-primary/40 bg-secondary hover:bg-secondary/80 text-primary font-bold',
                              key: 'good' as const,
                            },
                            {
                              label: 'Easy',
                              keyNum: '4',
                              interval: '5d',
                              stability: 'S: 14.5d',
                              color: 'border-success/40 bg-success/10 hover:bg-success/20 text-success font-bold',
                              key: 'easy' as const,
                            },
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => handleRate(item.key)}
                              className={cn(
                                'group flex min-h-[76px] flex-col items-center justify-center rounded-[14px] border bg-card p-2 text-center transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.97] active:duration-75 select-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm cursor-pointer sm:p-3',
                                item.color
                              )}
                            >
                              <div className="flex items-center gap-1">
                                <span className="text-xs sm:text-sm font-bold">
                                  {item.label}
                                </span>
                                <kbd className="hidden sm:inline rounded bg-muted px-1 text-[9px] font-bold text-muted-foreground">
                                  {item.keyNum}
                                </kbd>
                              </div>
                              <span className="text-[10px] font-semibold text-muted-foreground mt-0.5 tabular-nums">
                                {item.interval}
                              </span>
                              <span className="text-[9px] text-muted-foreground/70 hidden sm:block tabular-nums">
                                {item.stability}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Session complete view: celebrate the effort, then point to the next review. */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative flex flex-col items-center text-center max-w-md py-6"
                >
                  {/* Celebratory Particles */}
                  <div className="pointer-events-none absolute -inset-8 overflow-hidden">
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 0.8,
                        }}
                        animate={{
                          x: (i % 2 === 0 ? 1 : -1) * (60 + (i * 14)),
                          y: -80 - (i * 12),
                          opacity: 0,
                          scale: 1.4,
                          rotate: i * 45,
                        }}
                        transition={{
                          duration: 1.2 + (i * 0.05),
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={cn(
                          'absolute left-1/2 top-1/2 size-2 rounded-full',
                          i % 3 === 0 ? 'bg-ember' : i % 3 === 1 ? 'bg-primary' : 'bg-success'
                        )}
                      />
                    ))}
                  </div>

                  <div className="relative mb-3 flex size-28 items-center justify-center">
                    <Image
                      src="/mascot/fetch-celebrate.png"
                      alt="Celebratory Fetch Pup"
                      width={112}
                      height={112}
                      className="size-28 object-contain drop-shadow-md"
                    />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Session complete · next review scheduled
                  </span>
                  <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                    You finished this review.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    You retrieved all {cards.length} cards in {currentDeck.title}. FSRS
                    has rescheduled your memory intervals and updated your forgetting curves.
                  </p>

                  {/* Stat summary badge */}
                  <div className="my-6 grid grid-cols-2 gap-3 w-full">
                    <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                        Recall quality
                      </p>
                      <p className="mt-1 font-display text-2xl font-extrabold text-ember tabular-nums">
                        {recallQuality}%
                      </p>
                    </div>
                    <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                        Cards retrieved
                      </p>
                      <p className="mt-1 flex items-center justify-center gap-1 font-display text-2xl font-extrabold text-foreground tabular-nums">
                        <CheckCircle2 className="size-5 text-success" /> {history.length} / {cards.length}
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
                        setHistory([])
                        setSessionXp(0)
                        window.sessionStorage.removeItem(sessionStorageKey)
                      }}
                      className="flex-1 font-bold"
                    >
                      <RotateCcw className="size-4 mr-1.5" /> Review Again
                    </Button>
                    <Button onClick={onClose} className="flex-1 font-bold">
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
