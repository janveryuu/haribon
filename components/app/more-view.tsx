'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Compass, Gamepad2, Headphones, Moon, Settings, TimerReset, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFocusTools } from '@/lib/focus-context'

const groups = [
  {
    label: 'Discover',
    items: [
      { href: '/explore', title: 'Explore', detail: 'Find a useful starting point', icon: Compass, tone: 'blue' },
      { href: '/play', title: 'Play', detail: 'Keep practice social and optional', icon: Gamepad2, tone: 'coral' },
    ],
  },
  {
    label: 'Focus tools',
    items: [
      { href: '?focus=timer', title: 'Focus timer', detail: 'Start a calm study block', icon: TimerReset, tone: 'amber' },
      { href: '?focus=sounds', title: 'Study sounds', detail: 'Choose a background that fades out', icon: Headphones, tone: 'mint' },
    ],
  },
  {
    label: 'Fetch',
    items: [
      { href: '#account', title: 'Account', detail: 'Your profile and study rhythm', icon: UserRound, tone: 'blue' },
      { href: '#settings', title: 'Settings', detail: 'Preferences and notifications', icon: Settings, tone: 'slate' },
    ],
  },
] as const

export function MoreView() {
  const { openWidget } = useFocusTools()
  return <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-[760px] px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-14"><header><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">More from Fetch</p><h1 className="mt-2 max-w-[18ch] text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-5xl">Keep the useful things close.</h1><p className="mt-3 max-w-[54ch] text-base leading-relaxed text-muted-foreground">Find discovery, focus tools, and account controls without crowding the study loop.</p></header><div className="mt-8 space-y-7">{groups.map((group) => <section key={group.label}><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground">{group.label}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{group.items.map((item) => { const Icon = item.icon; const tone = item.tone === 'blue' ? 'bg-primary/10 text-primary' : item.tone === 'coral' ? 'bg-destructive/10 text-destructive' : item.tone === 'mint' ? 'bg-success/10 text-success' : item.tone === 'amber' ? 'bg-ember/12 text-ember' : 'bg-muted text-muted-foreground'; const content = <><span className={cn('flex size-11 shrink-0 items-center justify-center rounded-[14px]', tone)}><Icon className="size-5" aria-hidden="true" /></span><span className="min-w-0"><span className="block text-sm font-extrabold text-foreground">{item.title}</span><span className="mt-1 block text-xs leading-snug text-muted-foreground">{item.detail}</span></span><span className="ml-auto text-lg text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true">›</span></>; return item.href.startsWith('?') ? <button type="button" key={item.title} onClick={() => openWidget(item.href.includes('sounds') ? 'music' : 'timer')} className="group flex min-h-[82px] w-full items-center gap-3 rounded-[17px] border border-border bg-card p-4 text-left transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_12px_24px_rgba(20,33,61,.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{content}</button> : <Link key={item.title} href={item.href} className="group flex min-h-[82px] items-center gap-3 rounded-[17px] border border-border bg-card p-4 transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_12px_24px_rgba(20,33,61,.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{content}</Link> })}</div></section>)}</div><div className="mt-8 flex items-start gap-3 rounded-[18px] border border-primary/15 bg-secondary/55 p-4"><Moon className="mt-0.5 size-5 shrink-0 text-primary" /><p className="text-sm leading-relaxed text-muted-foreground"><strong className="font-extrabold text-foreground">Evening study is ready.</strong> Theme and sound preferences stay separate so the interface remains calm after dark.</p></div></motion.main>
}
