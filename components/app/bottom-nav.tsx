'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Home, Library, Brain, Plus, MoreHorizontal } from 'lucide-react'
import { useFocusTools } from '@/lib/focus-context'
import { sounds } from '@/lib/sound-effects'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { openActionMenu, isActionMenuOpen, isWidgetOpen } = useFocusTools()


  // Focused study and modal sheets own the viewport. Keeping the global dock
  // mounted underneath them makes focus order and safe-area math ambiguous.
  if (pathname.endsWith('/study') || (pathname === '/play' && searchParams.has('room')) || isWidgetOpen) return null

  const items = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/decks', label: 'Study', icon: Library },
    { href: '/tutor', label: 'Tutor', icon: Brain },
    { href: '/more', label: 'More', icon: MoreHorizontal },
  ]

  return (
    <aside aria-label="Mobile Navigation" className="fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 mx-auto w-[calc(100%-1.5rem)] max-w-[440px] pointer-events-none lg:hidden">
      <nav className="pointer-events-auto flex items-center justify-between gap-1 rounded-[22px] border border-border/80 bg-card/95 p-1.5 shadow-[0_18px_44px_rgba(20,33,61,0.18)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <NavItem item={items[0]} active={pathname === items[0].href} />
        <NavItem item={items[1]} active={pathname === items[1].href || pathname.startsWith('/decks/')} />
        <button
          type="button"
          onClick={() => { sounds.playFlip(); openActionMenu() }}
          data-fetch-action-trigger="true"
          aria-expanded={isActionMenuOpen}
          aria-label="Create or start a quick action"
          className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(47,102,246,0.3)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isActionMenuOpen ? <span className="text-xl leading-none" aria-hidden="true">×</span> : <Plus className="size-5 stroke-[2.5]" />}
        </button>
        <NavItem item={items[2]} active={pathname === items[2].href} />
        <NavItem item={items[3]} active={pathname === items[3].href || pathname === '/explore' || pathname === '/play'} />
      </nav>
    </aside>
  )
}

function NavItem({ item, active }: { item: { href: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        'flex min-h-[46px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-1 py-1 text-[10px] font-bold tracking-tight transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={active ? 2.5 : 2} />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}
