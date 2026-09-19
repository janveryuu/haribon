'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BookPlus, Headphones, Swords, TimerReset, X } from 'lucide-react'
import { useFocusTools } from '@/lib/focus-context'
import { motionTokens } from '@/lib/motion'
import { sounds } from '@/lib/sound-effects'
import { cn } from '@/lib/utils'

interface ActionPlusSheetProps {
  open: boolean
  onClose: () => void
}

const actions = [
  { id: 'create', label: 'Create deck', detail: 'Turn notes into recall cards', icon: BookPlus, tone: 'blue' },
  { id: 'focus', label: 'Start focus', detail: 'Begin a 25-minute session', icon: TimerReset, tone: 'amber' },
  { id: 'sounds', label: 'Study sounds', detail: 'Choose a calm background', icon: Headphones, tone: 'mint' },
  { id: 'play', label: 'Open Play', detail: 'Practice with a quick challenge', icon: Swords, tone: 'coral' },
] as const

export function ActionPlusSheet({ open, onClose }: ActionPlusSheetProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const firstActionRef = useRef<HTMLButtonElement>(null)
  const { startFocus, openWidget, playMusic, settings } = useFocusTools()

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => firstActionRef.current?.focus(), 40)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const closeAndRestore = () => {
    onClose()
    window.setTimeout(() => {
      document.querySelector<HTMLElement>('[data-fetch-action-trigger="true"]')?.focus()
    }, 40)
  }

  const handleAction = (id: (typeof actions)[number]['id']) => {
    sounds.playFlip()
    if (id === 'create') {
      closeAndRestore()
      router.push('/create')
      return
    }
    if (id === 'focus') {
      startFocus()
      openWidget('timer')
      closeAndRestore()
      return
    }
    if (id === 'sounds') {
      playMusic()
      openWidget('music')
      closeAndRestore()
      return
    }
    closeAndRestore()
    router.push('/play')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close quick actions"
            className="fixed inset-0 z-40 cursor-default bg-deep/18 backdrop-blur-[1px] lg:bg-transparent lg:backdrop-blur-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
            onClick={closeAndRestore}
          />

          <motion.section
            aria-label="Quick actions"
            className={cn(
              'fixed z-50 w-[calc(100%-2rem)] max-w-[380px] rounded-[24px] border border-border bg-card/98 p-3 shadow-[0_24px_70px_rgba(20,33,61,.20)] dark:shadow-[0_24px_70px_rgba(0,0,0,.52)]',
              'bottom-[calc(5.9rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2',
              'lg:bottom-8 lg:left-[268px] lg:translate-x-0',
            )}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0.01 } : motionTokens.springs.dropdown}
            role="dialog"
            aria-modal="false"
            aria-labelledby="quick-actions-title"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border/70 px-2 pb-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">Make a move</p>
                <h2 id="quick-actions-title" className="mt-1 font-display text-base font-extrabold tracking-[-0.02em] text-foreground">
                  What are you working on?
                </h2>
              </div>
              <button type="button" onClick={closeAndRestore} className="flex size-10 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Close quick actions">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {actions.map((action, index) => {
                const Icon = action.icon
                const tone = {
                  blue: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
                  amber: 'bg-ember/12 text-ember group-hover:bg-ember group-hover:text-white',
                  mint: 'bg-success/12 text-success group-hover:bg-success group-hover:text-white',
                  coral: 'bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white',
                }[action.tone]

                return (
                  <button
                    key={action.id}
                    ref={index === 0 ? firstActionRef : undefined}
                    type="button"
                    onClick={() => handleAction(action.id)}
                    className="group min-h-[112px] rounded-[18px] border border-border/80 bg-background/60 p-3 text-left transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-[0_10px_24px_rgba(20,33,61,.08)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className={cn('flex size-10 items-center justify-center rounded-[13px] transition-colors duration-200', tone)}>
                      <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="mt-3 block text-sm font-extrabold text-foreground">{action.label}</span>
                    <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                      {action.id === 'focus' ? action.detail.replace('25', String(settings.focusMinutes)) : action.detail}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  )
}
