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
  Settings,
  Plus,
} from 'lucide-react'
import { FetchMark } from '@/components/brand/fetch-mark'
import { useFocusTools } from '@/lib/focus-context'
import { sounds } from '@/lib/sound-effects'
import { initialUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onOpenSettings?: () => void
  onOpenRankModal?: () => void
}

export function Sidebar({ onOpenSettings, onOpenRankModal }: SidebarProps) {
  const pathname = usePathname()
  const { openActionMenu } = useFocusTools()

  const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    {
      href: '/decks',
      label: 'Study',
      icon: Library,
    },
    { href: '/create', label: 'Create', icon: Plus },
    { href: '/tutor', label: 'Tutor', icon: Brain },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/play', label: 'Play', icon: Swords },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex z-30 select-none">
      {/* Brand Header */}
      <div className="px-2">
        <FetchMark
          asLink
          href="/home"
          textClassName="text-sidebar-foreground"
        />
      </div>

      {/* Quick Action Button (Desktop Standalone Trigger) */}
      <div className="mt-7 px-1">
        <button
          type="button"
          onClick={() => {
            sounds.playFlip()
            openActionMenu()
          }}
          data-fetch-action-trigger="true"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-primary text-primary-foreground text-sm font-bold shadow-[0_8px_22px_rgba(47,102,246,0.24)] transition-all duration-150 ease-out hover:bg-primary/90 hover:shadow-md active:scale-[0.98] active:duration-75 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Quick action</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-7 flex flex-col gap-1.5" aria-label="App Navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-11 items-center gap-3 rounded-[14px] px-3.5 text-sm font-medium transition-all duration-150 ease-out active:scale-[0.98] active:duration-75 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                isActive
                  ? 'bg-primary text-white font-bold shadow-[0_8px_18px_rgba(47,102,246,0.24)]'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent'
              )}
            >
              <item.icon
                className={cn(
                  'size-[18px] shrink-0',
                    isActive ? 'text-white' : 'text-sidebar-foreground/60'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Today at a glance */}
      <div className="mt-7 border-t border-sidebar-border pt-6">
        <div className="flex items-center justify-between px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-foreground/45">
            Today
          </p>
          <span className="text-[10px] font-semibold text-sidebar-foreground/45">steady pace</span>
        </div>
        <div
          className="mt-2.5 rounded-[16px] border border-sidebar-border bg-sidebar-accent/50 p-3.5 text-sidebar-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sidebar-foreground">18 cards due</span>
            <span className="text-[11px] font-semibold text-sidebar-foreground/60">~9 min</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[42%] rounded-full bg-ember" /></div>
          <p className="mt-2 text-[11px] font-medium text-sidebar-foreground/60">One focused session is a good start.</p>
        </div>
      </div>

      {/* User Profile Card */}
      <button
        onClick={onOpenSettings}
        className="mt-auto flex items-center gap-3 rounded-2xl border border-transparent p-2.5 text-left transition-all duration-150 ease-out hover:bg-sidebar-accent hover:border-sidebar-border active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
