'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X, Shield, Check, PawPrint, CircleDot, Zap, Compass, Search, Bone, Crown } from 'lucide-react'
import { packRankTiers, initialUser } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { motionTokens } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface PackRankModalProps {
  open: boolean
  onClose: () => void
}

export function PackRankModal({ open, onClose }: PackRankModalProps) {
  const reduceMotion = useReducedMotion()
  const tierIcons = { paw: PawPrint, ball: CircleDot, bolt: Zap, compass: Compass, search: Search, bone: Bone, crown: Crown } as const

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/60 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : motionTokens.durations.backdrop }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={reduceMotion ? { duration: 0 } : motionTokens.springs.modalSheet}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[28px] border border-black/[0.08] dark:border-white/[0.08] bg-card shadow-[0_25px_70px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-black/[0.06] dark:border-white/[0.07] px-6">
              <div className="flex items-center gap-2.5">
                <span className="relative flex size-7 shrink-0 items-center justify-center rounded-lg overflow-hidden shadow-xs ring-1 ring-black/5 dark:ring-white/10">
                  <Image
                    src="/brand/fetch-main-logo.png"
                    alt="Fetch Logo"
                    width={28}
                    height={28}
                    className="size-full object-contain"
                  />
                </span>
                <span className="font-display text-sm font-bold text-foreground">
                  Fetch Pack Rank Progression
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-90 transition-all duration-150 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Close rank breakdown"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Current Rank Spotlight */}
            <div className="border-b border-black/[0.06] dark:border-white/[0.07] bg-secondary/30 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20 overflow-hidden shrink-0">
                    <Image
                      src="/mascot/main-mascot.png"
                      alt="Fetch Pup"
                      width={56}
                      height={56}
                      className="size-12 object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-primary tabular-nums">
                        Rank {initialUser.level}
                      </span>
                      <h3 className="font-display text-lg font-extrabold text-foreground">
                        {initialUser.levelTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                      {initialUser.todayXp} XP today · {initialUser.totalXp} Lifetime XP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-card px-4 py-2.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.07]">
                  <Shield className="size-4 text-primary" />
                  <div className="text-xs">
                    <span className="font-bold text-foreground tabular-nums">
                      {initialUser.streakShields} Shields Active
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Streak freeze protection
                    </p>
                  </div>
                </div>
              </div>

              {/* Rank Progress Bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-muted-foreground text-[11px]">Ascent to Pack Leader</span>
                  <span className="text-foreground tabular-nums font-bold text-[11px]">
                    72% · {initialUser.xpToNextLevel} XP needed to Scent Tracker
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    transition={{ duration: reduceMotion ? 0 : motionTokens.durations.fill, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Rank Tiers List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Pack Hierarchy & Unlocked Perks
              </p>

              {packRankTiers.map((tier) => {
                const isCurrent =
                  initialUser.level >= tier.levelMin && initialUser.level <= tier.levelMax
                const isPassed = initialUser.level > tier.levelMax

                return (
                  <div
                    key={tier.title}
                    className={cn(
                      'rounded-2xl border p-4 transition-all',
                      isCurrent
                        ? 'border-primary/40 bg-primary/5 shadow-xs'
                        : isPassed
                        ? 'border-black/[0.06] dark:border-white/[0.07] bg-card opacity-80'
                        : 'border-black/[0.06] dark:border-white/[0.07] bg-card/60 opacity-60'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-xl bg-secondary text-primary" aria-hidden="true">
                          {React.createElement(tierIcons[tier.icon], { className: 'size-4' })}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-sm font-bold text-foreground">
                              {tier.title}
                            </h4>
                            <span
                              className={cn(
                                'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                                tier.badgeColor
                              )}
                            >
                              Levels {tier.levelMin}–{tier.levelMax}
                            </span>
                            {isCurrent && (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
                                Active Tier
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {tier.subtitle}
                          </p>
                        </div>
                      </div>

                      {isPassed && (
                        <div className="flex size-6 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-3 border-t border-black/[0.06] dark:border-white/[0.07]">
                      {tier.perks.map((perk) => (
                        <div
                          key={perk}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="size-1 rounded-full bg-primary/60 shrink-0" />
                          <span className="truncate">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-black/[0.06] dark:border-white/[0.07] bg-muted/20 px-6 py-3 text-xs">
              <span className="text-muted-foreground">
                Earn XP by completing daily review sessions & active recall.
              </span>
              <Button size="sm" onClick={onClose} className="font-bold">
                Got it
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
