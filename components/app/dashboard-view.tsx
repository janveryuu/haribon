'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowRight, BookOpen, CalendarDays, Check, ChevronRight, Clock3, FileUp, FlaskConical, Leaf, Plus, Sigma, TrendingUp } from 'lucide-react'
import { initialDecks, initialQuests, initialUser, weeklyMomentumData, type Quest } from '@/lib/mock-data'
import { getSubjectTokens } from '@/lib/subject-colors'
import { sounds } from '@/lib/sound-effects'
import { cn } from '@/lib/utils'

interface DashboardViewProps {
  onStartStudy: (deckId?: string) => void
}

export function DashboardView({ onStartStudy }: DashboardViewProps) {
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const completedCount = quests.filter((quest) => quest.completed).length
  const studyDeck = initialDecks.find((deck) => deck.id === 'bio-respiration') ?? initialDecks[0]
  const totalCardsDue = useMemo(() => initialDecks.reduce((sum, deck) => sum + deck.due, 0), [])

  const toggleQuest = (id: string) => {
    setQuests((current) => current.map((quest) => {
      if (quest.id !== id) return quest
      const completed = !quest.completed
      if (completed) sounds.playQuestComplete()
      return { ...quest, completed }
    }))
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-[1320px] px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-14"
    >
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Tuesday, March 19</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl">
            Good afternoon, {initialUser.name.split(' ')[0]}
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">Ready when you are. One focused session is enough to move forward.</p>
        </div>
        <Link href="/create" className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Plus className="size-4" /> Create a deck
        </Link>
      </header>

      <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,.7fr)]">
        <article className="fetch-surface relative overflow-hidden rounded-[20px] p-5 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">Your next study session</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="size-2 rounded-full bg-ember" /> Due now <span className="text-border">→</span> Recall <span className="text-border">→</span> Master
              </div>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">{totalCardsDue} cards in queue</span>
          </div>

          <div className="mt-7 grid grid-cols-[minmax(112px,.82fr)_1.18fr] items-center gap-3 sm:gap-5 md:gap-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-accent sm:rounded-[24px]" aria-hidden="true">
              <Image
                src="/illustrations/mitochondrion-fieldbook.png"
                alt=""
                fill
                priority
                sizes="(max-width: 767px) 80vw, 280px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Biology · Cell Respiration</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-[-0.035em] text-foreground sm:text-3xl">{studyDeck.due} cards due</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4 text-primary" /> About 9 minutes</span>
                <span className="inline-flex items-center gap-1.5"><BookOpen className="size-4 text-success" /> Recall quality 82%</span>
              </div>
              <button type="button" onClick={() => { sounds.playFlip(); onStartStudy(studyDeck.id) }} className="group mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[14px] bg-primary px-3 text-xs font-bold text-primary-foreground shadow-[0_10px_24px_rgba(47,102,246,0.24)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:h-12 sm:w-auto sm:gap-2 sm:px-5 sm:text-sm">
                <span className="sm:hidden">Start study</span><span className="hidden sm:inline">Start focused study</span> <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </article>

        <aside className="relative overflow-hidden rounded-[20px] border border-primary/15 bg-secondary p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">A little encouragement</p>
              <p className="mt-3 max-w-[15rem] text-xl font-extrabold leading-tight tracking-[-0.03em] text-foreground">Small steps make big progress.</p>
            </div>
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[18px] border border-primary/10 bg-background/70 shadow-sm sm:h-24 sm:w-32">
              <Image
                src="/mascot/coach-wave.webp"
                alt="Fetch mascot waving encouragement"
                width={128}
                height={128}
                className="size-full object-contain p-2"
              />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-primary/15 pt-4 text-sm font-semibold text-primary"><span>Today’s momentum</span><span>{completedCount}/{quests.length} complete</span></div>
        </aside>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.25fr]">
        <div className="fetch-surface rounded-[20px] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-extrabold tracking-[-0.025em]">Weekly recall quality</h2><p className="mt-1 text-sm text-muted-foreground">Your answers are getting stronger.</p></div><div className="text-right"><p className="text-3xl font-extrabold tracking-[-0.04em] text-foreground">78%</p><p className="text-xs font-bold text-success">+12% this week</p></div></div>
          <div className="mt-6 flex h-36 items-end gap-2 sm:gap-3" aria-label="Recall quality from Monday to Sunday">
            {weeklyMomentumData.map((day) => (
              <div key={day.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="relative flex h-full w-full items-end"><div className={cn('w-full rounded-t-[10px] transition-transform duration-200 group-hover:scale-x-105', day.active ? 'bg-primary' : 'bg-primary/20')} style={{ height: `${Math.max(18, day.pct)}%` }} /></div>
                <span className={cn('text-[11px] font-bold', day.active ? 'text-primary' : 'text-muted-foreground')}>{day.short}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fetch-surface rounded-[20px] p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold tracking-[-0.025em]">Keep the rhythm</h2><p className="mt-1 text-sm text-muted-foreground">Quick paths back into your subjects.</p></div><TrendingUp className="size-5 text-success" /></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SubjectShortcut icon={FlaskConical} title="Chemistry" detail="6 cards due" tone="coral" href="/decks" />
            <SubjectShortcut icon={Sigma} title="Calculus" detail="Tomorrow" tone="blue" href="/decks" />
            <SubjectShortcut icon={CalendarDays} title="English" detail="4 cards due" tone="mint" href="/decks" />
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-extrabold tracking-[-0.03em]">Recent decks</h2><p className="mt-1 text-sm text-muted-foreground">Pick up where you left off.</p></div><Link href="/decks" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">View all <ChevronRight className="size-4" /></Link></div>
        <div className="fetch-surface mt-4 overflow-hidden rounded-[20px]">
          {initialDecks.slice(0, 5).map((deck, index) => <DeckRow key={deck.id} deck={deck} index={index} onStartStudy={onStartStudy} />)}
        </div>
      </section>

      <section className="mt-9 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="fetch-surface rounded-[20px] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold tracking-[-0.025em]">Today’s small wins</h2><p className="mt-1 text-sm text-muted-foreground">Keep them learning-authentic.</p></div><span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{completedCount}/{quests.length}</span></div><div className="mt-4 divide-y divide-border/70">{quests.slice(0, 3).map((quest) => <button key={quest.id} type="button" onClick={() => toggleQuest(quest.id)} className="flex w-full items-center gap-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border', quest.completed ? 'border-success bg-success text-white' : 'border-border text-muted-foreground')}>{quest.completed ? <Check className="size-4" /> : <span className="size-2 rounded-full bg-border" />}</span><span className={cn('flex-1 text-sm font-semibold', quest.completed && 'text-muted-foreground line-through')}>{quest.title}</span></button>)}</div></div>
        <div className="rounded-[20px] border border-primary/15 bg-primary p-5 text-primary-foreground shadow-[0_12px_32px_rgba(47,102,246,0.18)] sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/70">Make your next deck</p><h2 className="mt-2 max-w-md text-2xl font-extrabold tracking-[-0.035em]">Bring in notes, slides, or a PDF. We’ll help you make the questions.</h2></div><FileUp className="size-7 text-white/80" /></div><Link href="/create" className="mt-5 inline-flex h-11 items-center gap-2 rounded-[14px] bg-white px-4 text-sm font-bold text-primary transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">Create study material <ArrowRight className="size-4" /></Link></div>
      </section>
    </motion.main>
  )
}

function SubjectShortcut({ icon: Icon, title, detail, tone, href }: { icon: React.ComponentType<{ className?: string }>; title: string; detail: string; tone: 'coral' | 'blue' | 'mint'; href: string }) {
  const toneClass = { coral: 'bg-[#fff0ec] text-[#d85b48] dark:bg-[#43231f] dark:text-[#ff9a85]', blue: 'bg-[#edf3ff] text-[#2f66f6] dark:bg-[#1a2d4f] dark:text-[#9db7ff]', mint: 'bg-[#e8f8f2] text-[#128c73] dark:bg-[#173c3a] dark:text-[#7be6c9]' }[tone]
  return <Link href={href} className="group flex items-center gap-3 rounded-[16px] border border-border/70 bg-background/50 p-3 transition hover:-translate-y-0.5 hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><span className={cn('flex size-10 items-center justify-center rounded-[12px]', toneClass)}><Icon className="size-5" /></span><span className="min-w-0"><span className="block truncate text-sm font-bold text-foreground">{title}</span><span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{detail}</span></span><ChevronRight className="ml-auto size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" /></Link>
}

function DeckRow({ deck, index, onStartStudy }: { deck: typeof initialDecks[number]; index: number; onStartStudy: (id?: string) => void }) {
  const tokens = getSubjectTokens(deck.subject)
  return <button type="button" onClick={() => { sounds.playFlip(); onStartStudy(deck.id) }} className="group flex w-full items-center gap-3 border-b border-border/70 px-4 py-4 text-left last:border-b-0 transition hover:bg-secondary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-6"><span className={cn('flex size-9 items-center justify-center rounded-[12px]', tokens.accentMuted, tokens.accent)}>{index === 0 ? <Leaf className="size-4" /> : index === 1 ? <FlaskConical className="size-4" /> : <BookOpen className="size-4" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-foreground group-hover:text-primary">{deck.subject} · {deck.title}</span><span className="mt-1 block text-xs font-medium text-muted-foreground">{deck.cards} cards · studied {index + 1} day{index === 0 ? '' : 's'} ago</span></span><span className={cn('hidden rounded-full px-3 py-1 text-xs font-bold tabular-nums sm:inline-flex', deck.due > 0 ? 'bg-[#fff0ec] text-[#d85b48] dark:bg-[#43231f] dark:text-[#ff9a85]' : 'bg-accent text-accent-foreground')}>{deck.due > 0 ? `${deck.due} due` : 'On track'}</span><ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" /></button>
}
