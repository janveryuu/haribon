'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  Swords,
  Users,
  Trophy,
  Flame,
  Zap,
  Play,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LivePlayView() {
  const [roomCode, setRoomCode] = useState('HARIBON-88')
  const [inGame, setInGame] = useState(false)
  const [score, setScore] = useState(320)
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null)

  const leaderboard = [
    { rank: 1, name: 'Bea Ramos', school: 'Ateneo De Manila', score: 940, streak: 8 },
    { rank: 2, name: 'Alex Mendoza (You)', school: 'UST', score: score, streak: 6, isYou: true },
    { rank: 3, name: 'Carlo Santos', school: 'DLSU', score: 480, streak: 4 },
    { rank: 4, name: 'Maria Dela Cruz', school: 'UP Diliman', score: 390, streak: 3 },
  ]

  const liveQuestion = {
    q: 'Which organelle contains its own circular DNA and 70S ribosomes?',
    options: ['Golgi Apparatus', 'Mitochondria', 'Endoplasmic Reticulum', 'Lysosome'],
    correct: 1,
  }

  const handleAnswer = (index: number) => {
    setAnsweredIndex(index)
    if (index === liveQuestion.correct) {
      setScore((prev) => prev + 120)
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1240px] px-4 pb-28 pt-6 md:px-8 md:pt-8 lg:px-10"
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
            Join a live class session, answer before the countdown ends, and climb the board.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        {/* Game Arena Panel */}
        <div className="flex flex-col justify-between rounded-[28px] bg-deep p-6 sm:p-8 text-deep-foreground shadow-[0_22px_60px_rgba(11,27,77,.18)] min-h-[420px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-ember animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-ember">
                  Live Match · Room {roomCode}
                </span>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                ⏱️ 8s left
              </span>
            </div>

            <div className="my-8 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-deep-foreground/60">
                Question 4 of 10 · Biology Arena
              </span>
              <h2 className="mt-3 font-display text-xl sm:text-2xl font-bold leading-snug">
                {liveQuestion.q}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {liveQuestion.options.map((opt, i) => {
              const isSelected = answeredIndex === i
              const isCorrect = i === liveQuestion.correct
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(i)}
                  className={cn(
                    'rounded-2xl p-4 text-left text-sm font-bold transition-all active:scale-95 flex items-center justify-between',
                    answeredIndex === null
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                      : isCorrect
                      ? 'bg-success text-white ring-2 ring-success'
                      : isSelected
                      ? 'bg-destructive text-white'
                      : 'bg-white/5 text-white/40'
                  )}
                >
                  <span>{opt}</span>
                  {answeredIndex !== null && isCorrect && (
                    <CheckCircle2 className="size-4 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Leaderboard */}
        <div className="rounded-[28px] border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-ember" />
                <h3 className="font-display text-base font-bold text-foreground">
                  Live Class Leaderboard
                </h3>
              </div>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Users className="size-3.5" /> 24 Students
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={cn(
                    'flex items-center justify-between rounded-xl p-3 text-xs transition-colors',
                    player.isYou
                      ? 'bg-secondary border border-primary/30 font-bold text-primary'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-full text-[11px] font-bold',
                        player.rank === 1
                          ? 'bg-ember text-deep font-extrabold'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {player.rank}
                    </span>
                    <div>
                      <p className="font-bold truncate">{player.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {player.school}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-extrabold text-sm">
                      {player.score} XP
                    </span>
                    <span className="block text-[10px] text-ember font-semibold">
                      🔥 {player.streak} streak
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-4 flex gap-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-xl border border-border bg-background px-3 text-xs font-bold uppercase tracking-wider text-foreground outline-none"
              placeholder="ROOM CODE"
            />
            <Button size="sm" onClick={() => setAnsweredIndex(null)}>
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
