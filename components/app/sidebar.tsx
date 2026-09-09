'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Library,
  Search,
  Brain,
  Swords,
  Trophy,
  Settings,
  Sparkles,
} from 'lucide-react'
import { EagleMark } from '@/components/brand/eagle-mark'
import { cn } from '@/lib/utils'
import { initialUser, initialDecks } from '@/lib/mock-data'

interface SidebarProps {
  onOpenSettings?: () => void
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    {
      href: '/decks',
      label: 'My decks',
      icon: Library,
      badge: initialDecks.length.toString(),
    },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/tutor', label: 'AI tutor', icon: Brain, isAi: true },
    { href: '/play', label: 'Live play', icon: Swords },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[240px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground lg:flex z-30 select-none">
      {/* Brand Header */}
      <div className="px-2">
        <EagleMark asLink href="/home" statusDot />
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 flex flex-col gap-1.5" aria-label="App Navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-all duration-150 active:scale-[0.98]',
                isActive
                  ? 'bg-sidebar-accent text-primary font-bold shadow-xs'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'size-[18px] shrink-0',
                  isActive ? 'text-primary' : 'text-sidebar-foreground/60'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
              {item.isAi && (
                <span className="ml-auto text-[10px] font-bold text-ember bg-ember/15 px-1.5 py-0.5 rounded-md">
                  AI
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Gamification Progress Widget */}
      <div className="mt-6 border-t border-sidebar-border pt-5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-foreground/45">
          Your flight rank
        </p>
        <div className="mt-2.5 rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Level {initialUser.level}</span>
            <Trophy className="size-4 text-ember fill-ember" />
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-foreground/20">
            <div
              className="h-full rounded-full bg-ember transition-all duration-500"
              style={{ width: '72%' }}
            />
          </div>
          <p className="mt-2 text-[11px] font-medium text-primary-foreground/80">
            {initialUser.xpToNextLevel} XP to {initialUser.levelTitle}
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <button
        onClick={onOpenSettings}
        className="mt-auto flex items-center gap-3 rounded-2xl border border-transparent p-2.5 text-left transition-colors hover:bg-sidebar-accent hover:border-sidebar-border"
        aria-label="User profile settings"
      >
        <div className="flex size-9 items-center justify-center rounded-full bg-secondary font-display text-xs font-bold text-primary ring-2 ring-primary/20">
          {initialUser.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-sidebar-foreground">
            {initialUser.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {initialUser.grade}
          </p>
        </div>
        <Settings className="size-4 text-muted-foreground/80" />
      </button>
    </aside>
  )
}
