'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Swords,
  Users,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  LogIn,
  RotateCcw,
  Clock3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSubjectTokens } from '@/lib/subject-colors'
import { sounds } from '@/lib/sound-effects'
import { cn } from '@/lib/utils'

interface ArenaQuestion {
  subject: string
  q: string
  options: string[]
  correct: number
}

const arenaQuestions: ArenaQuestion[] = [
  {
    subject: 'Biology',
    q: 'Which organelle contains its own circular DNA and 70S ribosomes?',
    options: ['Golgi Apparatus', 'Mitochondria', 'Endoplasmic Reticulum', 'Lysosome'],
    correct: 1,
  },
  {
    subject: 'Biology',
    q: 'During glycolysis, which enzyme catalyzes the phosphorylation of glucose to glucose-6-phosphate?',
    options: ['Hexokinase', 'Phosphofructokinase', 'Pyruvate kinase', 'Aldolase'],
    correct: 0,
  },
  {
    subject: 'Biology',
    q: 'Which phase of the eukaryotic cell cycle is characterized by active DNA replication?',
    options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
    correct: 1,
  },
  {
    subject: 'Biology',
    q: 'What is the primary function of the nucleolus in eukaryotic cell nuclei?',
    options: ['Lipid synthesis', 'Ribosomal RNA synthesis & assembly', 'ATP production', 'Protein degradation'],
    correct: 1,
  },
  {
    subject: 'Biology',
    q: 'Which transport mechanism moves ions against their electrochemical gradient using ATP?',
    options: ['Facilitated diffusion', 'Osmosis', 'Primary active transport', 'Simple diffusion'],
    correct: 2,
  },
]

export function LivePlayView({ roomCode: initialRoomCode = 'FETCH-88', onExit }: { roomCode?: string; onExit?: () => void }) {
  const [roomCode, setRoomCode] = useState(initialRoomCode)
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(640)
  const [userStreak, setUserStreak] = useState(6)
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null)
  const [isRoundComplete, setIsRoundComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [hadThermalBoost, setHadThermalBoost] = useState(false)

  const subjectTokens = getSubjectTokens('Biology')
  const currentQuestion = arenaQuestions[qIndex]

  // Countdown timer per question
  useEffect(() => {
    if (isRoundComplete || answeredIndex !== null) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Timeout counts as Again
          sounds.playRating('again')
          setAnsweredIndex(999) // timed out
          setUserStreak(0)
          return 0
        }
        if (prev <= 4) {
          sounds.playTick(true)
        } else {
          sounds.playTick(false)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRoundComplete, answeredIndex, qIndex])

  const leaderboard = [
    { rank: 1, name: 'Bea Ramos', school: 'Study room', score: 940, streak: 8 },
    { rank: 2, name: 'Alex Mendoza (You)', school: 'Study room', score: score, streak: userStreak, isYou: true },
    { rank: 3, name: 'Carlo Santos', school: 'Study room', score: 480, streak: 4 },
    { rank: 4, name: 'Maria Dela Cruz', school: 'Study room', score: 390, streak: 3 },
  ]

  const handleAnswer = useCallback(
    (index: number) => {
      if (answeredIndex !== null || isRoundComplete) return
      setAnsweredIndex(index)
      const isCorrect = index === currentQuestion.correct
      const isRapid = timeLeft >= 7 // Answered within 3 seconds!

      if (isCorrect) {
        sounds.playRating('easy')
        const boostMultiplier = isRapid ? 2.0 : 1.0
        const earned = Math.round(120 * boostMultiplier)
        setHadThermalBoost(isRapid)
        setScore((prev) => prev + earned)
        setUserStreak((prev) => prev + 1)
      } else {
        sounds.playRating('again')
        setHadThermalBoost(false)
        setUserStreak(0)
      }
    },
    [answeredIndex, isRoundComplete, currentQuestion.correct, timeLeft]
  )

  const handleNextQuestion = useCallback(() => {
    if (qIndex < arenaQuestions.length - 1) {
      setQIndex((prev) => prev + 1)
      setAnsweredIndex(null)
      setTimeLeft(10)
      setHadThermalBoost(false)
      sounds.playFlip()
    } else {
      setIsRoundComplete(true)
      sounds.playFanfare()
    }
  }, [qIndex])

  const handleRestartRound = useCallback(() => {
    setQIndex(0)
    setAnsweredIndex(null)
    setScore(640)
    setUserStreak(6)
    setTimeLeft(10)
    setHadThermalBoost(false)
    setIsRoundComplete(false)
    sounds.playFlip()
  }, [])

  // Global Keyboard listener: 1-4 and A-D for answers, Enter/Space for next question or restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      const key = e.key.toUpperCase()

      // When round is complete, Enter or Space restarts
      if (isRoundComplete) {
        if (key === 'ENTER' || key === ' ') {
          e.preventDefault()
          handleRestartRound()
        }
        return
      }

      // If question is already answered, Enter or Space advances
      if (answeredIndex !== null) {
        if (key === 'ENTER' || key === ' ') {
          e.preventDefault()
          handleNextQuestion()
        }
        return
      }

      // Answer selection keys (1-4 or A-D)
      if (key === '1' || key === 'A') {
        e.preventDefault()
        handleAnswer(0)
      } else if (key === '2' || key === 'B') {
        e.preventDefault()
        handleAnswer(1)
      } else if (key === '3' || key === 'C') {
        e.preventDefault()
        handleAnswer(2)
      } else if (key === '4' || key === 'D') {
        e.preventDefault()
        handleAnswer(3)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleAnswer, handleNextQuestion, handleRestartRound, answeredIndex, isRoundComplete])

  const keybindLabels = ['1', '2', '3', '4']

  return (
    <motion.main
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className="mx-auto max-w-[1240px] px-3.5 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6 md:pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Multiplayer Study Arena
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Study together. Get loud.
          </h1>
        <p className="mt-2 text-sm text-muted-foreground">
            A contained social lane for quick recall rounds with classmates and friends.
          </p>
        </div>
        {onExit && <button type="button" onClick={onExit} className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-border bg-card px-3 text-xs font-extrabold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Leave room</button>}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        {/* Game Arena Panel */}
        <div className="min-w-0 flex flex-col justify-between rounded-[20px] bg-deep p-5 sm:p-8 text-deep-foreground shadow-[0_22px_60px_rgba(20,33,61,.18)] min-h-[440px] border border-white/10">
          {!isRoundComplete ? (
            <>
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-ember animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-ember">
                      Room preview / {roomCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hadThermalBoost && (
                      <span className="flex items-center gap-1 rounded-full bg-ember px-2.5 py-0.5 text-[10px] font-black text-black animate-pulse shadow-md">
                        <Flame className="size-3 fill-black" /> Rapid recall bonus
                      </span>
                    )}
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-bold tabular-nums border transition-colors',
                        timeLeft <= 3
                          ? 'bg-destructive text-white border-destructive animate-pulse'
                          : 'bg-white/10 border-white/10 text-white'
                      )}
                    >
                      <Clock3 className="mr-1 inline size-3.5" aria-hidden="true" /> {timeLeft}s left
                    </span>
                  </div>
                </div>

                <div className="my-8 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3.5 py-1 mb-3">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-deep-foreground/90">
                      Question {qIndex + 1} of {arenaQuestions.length} / <span className={subjectTokens.accent}>Biology round</span>
                    </span>
                  </div>
                  <h2 className="mt-2 max-w-full break-words font-display text-xl sm:text-2xl font-bold leading-snug text-white text-balance">
                    {currentQuestion.q}
                  </h2>
                </div>
              </div>

              {/* Answer Options Grid with Persistent Keybinds & Spring Motion */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected = answeredIndex === i
                    const isCorrect = i === currentQuestion.correct
                    const hasAnswered = answeredIndex !== null

                    return (
                      <motion.button
                        key={opt}
                        type="button"
                        whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
                        animate={{ scale: isSelected ? 1.02 : 1 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        onClick={() => handleAnswer(i)}
                        className={cn(
                          'group relative rounded-2xl p-4 text-left text-sm font-bold transition-all duration-150 flex items-center justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050f32]',
                          !hasAnswered
                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm active:scale-[0.98] active:duration-75'
                            : isCorrect
                            ? 'bg-success text-white ring-2 ring-success shadow-md'
                            : isSelected
                            ? 'bg-destructive text-white shadow-md'
                            : 'bg-white/5 text-white/35 border border-white/5 opacity-50 cursor-not-allowed'
                        )}
                        aria-label={`Answer ${keybindLabels[i]}: ${opt}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Typographic Keybind Chip */}
                          <span
                            className={cn(
                              'inline-flex size-6 shrink-0 items-center justify-center rounded-lg border text-xs font-black select-none transition-colors',
                              !hasAnswered
                                ? 'border-white/20 bg-white/10 text-white/90 group-hover:bg-white/20'
                                : isCorrect || isSelected
                                ? 'border-white/40 bg-white/25 text-white'
                                : 'border-white/10 bg-white/5 text-white/30'
                            )}
                          >
                            {keybindLabels[i]}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>

                        {hasAnswered && isCorrect && (
                          <CheckCircle2 className="size-4 shrink-0 text-white animate-in zoom-in-75 duration-150" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="size-4 shrink-0 text-white animate-in zoom-in-75 duration-150" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Keyboard round progression prompt */}
                {answeredIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between pt-2 text-xs"
                  >
                    <span className="text-white/80 font-semibold">
                      {answeredIndex === currentQuestion.correct ? (
                        hadThermalBoost ? (
                          <span className="text-amber-400 font-bold">Rapid recall bonus / 2x points</span>
                        ) : (
                          <span className="text-success font-bold">Correct / points added</span>
                        )
                      ) : (
                        <span className="text-destructive font-semibold">Missed. Review the highlighted answer.</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-[#050f32] shadow-sm hover:bg-white/90 active:scale-95 active:duration-75 transition-all duration-150 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050f32]"
                    >
                      <span>{qIndex < arenaQuestions.length - 1 ? 'Next Question' : 'Finish Round'}</span>
                      <kbd className="rounded bg-black/10 px-1 py-0.5 text-[10px] font-extrabold uppercase">
                        ↵ Enter
                      </kbd>
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            /* Round Complete Screen */
            <div className="flex my-auto flex-col items-center text-center py-8">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-white mb-4 ring-1 ring-white/20">
                <Trophy className="size-8 text-amber-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                Round Complete
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                Final score: <span className="tabular-nums text-amber-400">{score}</span>
              </h2>
              <p className="mt-2 text-sm text-white/75 max-w-sm">
                You placed 2nd in this Biology room preview. Connect a backend to invite a real study circle.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRestartRound}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#050f32] shadow-md hover:bg-white/95 active:scale-95 active:duration-75 transition-all duration-150 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050f32]"
                >
                  <RotateCcw className="size-4" />
                  <span>Play Again</span>
                  <kbd className="ml-1 rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-extrabold">
                    ↵ Enter
                  </kbd>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Leaderboard */}
        <div className="fetch-surface min-w-0 rounded-[20px] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-ember" />
                <h3 className="font-display text-base font-bold text-foreground">
                  Room leaderboard
                </h3>
              </div>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 tabular-nums">
                <Users className="size-3.5" /> Demo roster
              </span>
            </div>

            {/* Unified Circular Rank Badges */}
            <div className="mt-4 space-y-2.5">
              {leaderboard.map((player) => {
                const getRankBadge = (rank: number) => {
                  switch (rank) {
                    case 1:
                      return 'bg-amber-400 text-amber-950 font-black shadow-xs'
                    case 2:
                      return 'bg-slate-200 text-slate-900 dark:bg-slate-300 dark:text-slate-950 font-black shadow-xs'
                    case 3:
                      return 'bg-amber-700 text-amber-50 dark:bg-amber-600 font-black shadow-xs'
                    default:
                      return 'bg-muted text-muted-foreground border border-border font-bold'
                  }
                }

                return (
                  <div
                    key={player.rank}
                    className={cn(
                      'flex items-center justify-between rounded-xl p-3 text-xs transition-colors',
                      player.isYou
                        ? 'bg-secondary/70 border border-primary/40 font-bold text-foreground ring-1 ring-primary/20'
                        : 'hover:bg-muted/50 text-foreground border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          'flex size-7 shrink-0 items-center justify-center rounded-full text-xs tabular-nums',
                          getRankBadge(player.rank)
                        )}
                      >
                        {player.rank}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold truncate text-foreground flex items-center gap-1.5">
                          <span>{player.name}</span>
                          {player.isYou && (
                            <span className="rounded-md bg-primary/10 text-primary px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wide">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {player.school}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display font-extrabold text-sm tabular-nums text-foreground">
                        {player.score} pts
                      </span>
                      <span className="flex items-center justify-end gap-1 text-[10px] text-ember font-bold tabular-nums">
                        <Flame className="size-3 fill-ember text-ember shrink-0" />
                        <span>{player.streak} streak</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Join Room Section (Concentric radius and clear visual separation) */}
          <div className="mt-6 rounded-[18px] border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Join another room
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                Multiplayer PIN
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                aria-label="Room code"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground outline-none transition-all duration-150 focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/40"
                placeholder="ROOM CODE"
              />
              <Button
                size="sm"
                onClick={() => {
                  setAnsweredIndex(null)
                  setQIndex(0)
                  setIsRoundComplete(false)
                }}
                className="rounded-xl px-4 font-bold shadow-none"
              >
                <LogIn className="size-3.5 mr-1" /> Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
