'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  Bell,
  Search,
  Flame,
  Sun,
  Moon,
  Check,
  Zap,
  Inbox,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { sounds } from '@/lib/sound-effects'
import { useFocusTools } from '@/lib/focus-context'
import { FetchMark } from '@/components/brand/fetch-mark'
import { initialUser } from '@/lib/mock-data'
import { getSubjectTokens } from '@/lib/subject-colors'
import { motionTokens } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { ContextualFocusPill } from '@/components/focus/focus-tools-widget'

interface TopbarProps {
  onOpenSearch: () => void
}

interface NotificationItem {
  id: string
  title: string
  subject?: string
  time: string
  desc: string
  read: boolean
}

export function Topbar({ onOpenSearch }: TopbarProps) {
  const { openActionMenu } = useFocusTools()
  const reduceMotion = useReducedMotion()
  const [dark, setDark] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationButtonRef = useRef<HTMLButtonElement>(null)
  const notificationPanelRef = useRef<HTMLDivElement>(null)
  const [notificationPosition, setNotificationPosition] = useState({ top: 76, left: 12, right: 12 })

  // Track sound effects mute state
  useEffect(() => {
    setIsMuted(sounds.isMuted())
    const unsub = sounds.subscribe((muted) => setIsMuted(muted))
    return unsub
  }, [])

  // Keyboard shortcut M for sound toggle, + or = for quick actions menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }
      if (e.key === 'm' || e.key === 'M') {
        sounds.toggleMute()
      } else if ((e.key === '+' || e.key === '=') && !e.metaKey && !e.ctrlKey) {
        sounds.playFlip()
        openActionMenu()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openActionMenu])
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Cards ready to fetch',
      subject: 'Biology',
      time: '10m ago',
      desc: '23 cards in Cellular respiration are ready for retrieval.',
      read: false,
    },
    {
      id: 'n2',
      title: 'Study rhythm maintained',
      time: '2h ago',
      desc: 'A little practice today keeps tomorrow easier.',
      read: true,
    },
  ])

  // Fetch opens in its calm light theme. A manual choice is remembered locally;
  // we intentionally do not inherit the OS theme so the study surfaces stay
  // predictable across shared devices and classroom screens.
  useEffect(() => {
    const isDark = window.localStorage.getItem('fetch-theme') === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    window.localStorage.setItem('fetch-theme', nextDark ? 'dark' : 'light')
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!showNotifications) return

    const updatePosition = () => {
      const button = notificationButtonRef.current
      if (!button) return
      const rect = button.getBoundingClientRect()
      const isSmallScreen = window.innerWidth < 640
      if (isSmallScreen) {
        setNotificationPosition({ top: rect.bottom + 10, left: 12, right: 12 })
      } else {
        const panelWidth = Math.min(360, window.innerWidth - 32)
        setNotificationPosition({
          top: rect.bottom + 10,
          left: 0,
          right: Math.max(16, window.innerWidth - rect.right - panelWidth),
        })
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!notificationButtonRef.current?.contains(target) && !notificationPanelRef.current?.contains(target)) {
        setShowNotifications(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setShowNotifications(false)
        notificationButtonRef.current?.focus()
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showNotifications])

  const notificationPanel = typeof document !== 'undefined' && showNotifications
    ? createPortal(
        <AnimatePresence>
          <motion.div
            ref={notificationPanelRef}
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={reduceMotion ? { duration: 0 } : motionTokens.springs.dropdown}
            style={{
              top: notificationPosition.top,
              ...(typeof window !== 'undefined' && window.innerWidth < 640
                ? { left: notificationPosition.left, right: notificationPosition.right }
                : { right: notificationPosition.right, width: 'min(360px, calc(100vw - 2rem))' }),
            }}
            className="fixed z-[80] w-auto min-w-0 max-w-[360px] origin-top-right rounded-2xl border border-border bg-card p-3 shadow-[0_24px_64px_rgba(20,33,61,.2)] sm:w-[360px]"
          >
            <div className="flex items-center justify-between border-b border-border pb-2 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="rounded text-[10px] font-semibold text-primary transition-opacity hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  Mark all read
                </button>
              )}
            </div>
            <div className="mt-2 max-h-[min(70vh,520px)] space-y-1.5 overflow-y-auto">
              {notifications.length > 0 ? notifications.map((n) => {
                const tokens = n.subject ? getSubjectTokens(n.subject) : null
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => toggleNotificationRead(n.id)}
                    className={cn('block w-full rounded-xl p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40', !n.read ? 'bg-secondary/60 hover:bg-secondary' : 'hover:bg-secondary/40')}
                    aria-pressed={n.read}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        {tokens && <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider', tokens.badge)}>{n.subject}</span>}
                        <span className="truncate text-xs font-bold text-foreground">{n.title}</span>
                      </span>
                      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{n.time}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">{n.desc}</span>
                  </button>
                )
              }) : (
                <div className="flex flex-col items-center gap-1.5 py-6 text-center text-xs text-muted-foreground"><Inbox className="size-5 text-muted-foreground/60" /><span>No notifications</span></div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-background/92 px-3 sm:px-6 md:px-8 lg:px-10 backdrop-blur-md max-w-full">
      {/* Mobile Logo Mark */}
      <div className="lg:hidden shrink-0">
        <FetchMark asLink href="/home" compact />
      </div>

      {/* Global Search Bar (⌘K Trigger) with smooth hover/focus expansion */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden h-10 w-60 hover:w-72 focus-visible:w-80 items-center gap-3 rounded-[14px] border border-border bg-card px-3.5 text-xs text-muted-foreground transition-[width,border-color,background-color,transform] duration-200 ease-out hover:border-primary/40 hover:bg-card/80 hover:text-foreground active:scale-[0.98] active:duration-75 md:flex outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        aria-label="Search decks, cards, and subjects"
      >
        <Search className="size-3.5 text-muted-foreground shrink-0" />
        <span className="truncate">Search decks, subjects, notes...</span>
        <kbd className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground shrink-0">
          ⌘ K
        </kbd>
      </button>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Streak Pill */}
        <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-accent px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-accent-foreground shrink-0">
          <Flame className="size-3.5 sm:size-4 text-ember fill-ember" />
          <span className="tabular-nums">{initialUser.streak} day rhythm</span>
        </div>

        <ContextualFocusPill />

        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex size-9 sm:size-10 items-center justify-center rounded-[14px] border border-border bg-card text-foreground transition-all duration-150 active:scale-90 active:duration-75 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          aria-label="Open search dialog"
        >
          <Search className="size-4" />
        </button>

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={() => sounds.toggleMute()}
          className="flex size-9 sm:size-10 items-center justify-center rounded-[14px] border border-border bg-card text-foreground transition-all duration-150 hover:border-primary/40 hover:text-primary active:scale-90 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          title={isMuted ? 'Unmute tactile sound effects (M)' : 'Mute tactile sound effects (M)'}
          aria-label={isMuted ? 'Unmute tactile sound effects' : 'Mute tactile sound effects'}
        >
          {isMuted ? (
            <VolumeX className="size-4 sm:size-4.5 text-muted-foreground/60" />
          ) : (
            <Volume2 className="size-4 sm:size-4.5 text-primary" />
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex size-9 sm:size-10 items-center justify-center rounded-[14px] border border-border bg-card text-foreground transition-all duration-150 hover:border-primary/40 hover:text-primary active:scale-90 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          aria-label="Toggle theme color scheme"
        >
          {dark ? (
            <Sun className="size-4 sm:size-4.5 text-ember" />
          ) : (
            <Moon className="size-4 sm:size-4.5 text-foreground" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            ref={notificationButtonRef}
            onClick={() => setShowNotifications((open) => !open)}
            className="relative flex size-9 sm:size-10 items-center justify-center rounded-[14px] border border-border bg-card text-foreground transition-all duration-150 hover:border-primary/40 active:scale-90 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            aria-label={`Open notifications (${unreadCount} unread)`}
          >
            <Bell className="size-4 sm:size-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-extrabold tabular-nums text-primary-foreground ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
      {notificationPanel}
    </header>
  )
}
