'use client'

import React, { useState, useEffect } from 'react'
import {
  Bell,
  Search,
  Flame,
  Sun,
  Moon,
  Check,
  Zap,
} from 'lucide-react'
import { EagleMark } from '@/components/brand/eagle-mark'
import { initialUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface TopbarProps {
  onOpenSearch: () => void
}

export function Topbar({ onOpenSearch }: TopbarProps) {
  const [dark, setDark] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Initialize theme from document or localStorage
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDark(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const notifications = [
    {
      id: 'n1',
      title: 'Daily flight ready',
      time: '10m ago',
      desc: '23 cards in Cellular respiration are due for review.',
      read: false,
    },
    {
      id: 'n2',
      title: '12-Day Streak Achieved!',
      time: '2h ago',
      desc: '+100 bonus XP applied to your profile.',
      read: true,
    },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md md:px-8 lg:px-10">
      {/* Mobile Logo Mark */}
      <div className="lg:hidden">
        <EagleMark asLink href="/home" compact statusDot />
      </div>

      {/* Global Search Bar (⌘K Trigger) */}
      <button
        onClick={onOpenSearch}
        className="hidden h-10 w-80 items-center gap-3 rounded-xl border border-border bg-card px-3.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-card/80 hover:text-foreground md:flex"
        aria-label="Search decks, cards, and subjects"
      >
        <Search className="size-3.5 text-muted-foreground" />
        <span>Search decks, subjects, notes...</span>
        <kbd className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
          ⌘ K
        </kbd>
      </button>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2.5">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 rounded-full bg-ember/15 px-3 py-1.5 text-xs font-bold text-foreground ring-1 ring-ember/20">
          <Flame className="size-4 text-ember fill-ember" />
          <span>{initialUser.streak} days</span>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-transform active:scale-95 md:hidden"
          aria-label="Open search dialog"
        >
          <Search className="size-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/40 hover:text-primary active:scale-95"
          aria-label="Toggle theme color scheme"
        >
          {dark ? (
            <Sun className="size-4.5 text-ember" />
          ) : (
            <Moon className="size-4.5 text-foreground" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/40 active:scale-95"
            aria-label="Open notifications"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-background" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-3 shadow-[0_20px_50px_rgba(11,27,77,.15)] z-50">
              <div className="flex items-center justify-between border-b border-border pb-2 px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Notifications
                </span>
                <span className="text-[10px] font-semibold text-primary">
                  Mark all read
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl p-2.5 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
