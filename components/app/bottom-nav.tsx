'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Library, Search, Brain, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const items = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/decks', label: 'Decks', icon: Library },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/tutor', label: 'AI Tutor', icon: Brain },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(64px+env(safe-area-inset-bottom))] items-center justify-around border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      {items.slice(0, 2).map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl py-1 text-[10px] font-bold transition-all active:scale-95',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon
              className="size-5 shrink-0"
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span>{item.label}</span>
          </Link>
        )
      })}

      {/* Center Floating Action Button for Create */}
      <Link
        href="/create"
        aria-label="Create Deck"
        className="-mt-5 flex size-13 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(37,71,224,.35)] transition-transform active:scale-90 hover:scale-105"
      >
        <Plus className="size-6 stroke-[2.5]" />
      </Link>

      {items.slice(2).map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl py-1 text-[10px] font-bold transition-all active:scale-95',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon
              className="size-5 shrink-0"
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
