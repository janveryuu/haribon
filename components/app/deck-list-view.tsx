'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, BookOpen, Check, ChevronRight, Filter, Play, Plus, Search, SlidersHorizontal, TrendingUp } from 'lucide-react'
import { initialDecks } from '@/lib/mock-data'
import { RetentionRing } from '@/components/shared/retention-ring'
import { getSubjectTokens } from '@/lib/subject-colors'
import { cn } from '@/lib/utils'

interface DeckListViewProps {
  onStartStudy: (deckId: string) => void
}

const subjects = ['All', 'Biology', 'History', 'Mathematics', 'Chemistry']

export function DeckListView({ onStartStudy }: DeckListViewProps) {
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [sort, setSort] = useState<'due' | 'recent'>('due')

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem('fetch-deck-library-filters')
      if (!saved) return
      const parsed = JSON.parse(saved)
      setSearch(parsed.search ?? '')
      setSelectedSubject(parsed.selectedSubject ?? 'All')
      setSort(parsed.sort ?? 'due')
    } catch {}
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem('fetch-deck-library-filters', JSON.stringify({ search, selectedSubject, sort }))
  }, [search, selectedSubject, sort])

  const filtered = useMemo(() => {
    const next = initialDecks.filter((deck) => {
      const matchesSubject = selectedSubject === 'All' || deck.subject === selectedSubject
      const needle = search.trim().toLowerCase()
      return matchesSubject && (!needle || deck.title.toLowerCase().includes(needle) || deck.subject.toLowerCase().includes(needle))
    })
    return [...next].sort((a, b) => sort === 'due' ? b.due - a.due : a.title.localeCompare(b.title))
  }, [search, selectedSubject, sort])

  const dueCount = initialDecks.reduce((total, deck) => total + deck.due, 0)

  return (
    <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-[1320px] px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-14">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="max-w-2xl"><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Study library</p><h1 className="mt-2 max-w-[19ch] text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-5xl">Pick up the next useful review.</h1><p className="mt-3 max-w-[58ch] text-base leading-relaxed text-muted-foreground">Your decks are sorted by what needs attention first, so you can start before you have to plan.</p></div>
        <Link href="/create" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-[13px] bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-[0_8px_18px_rgba(47,102,246,.2)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><Plus className="size-4" /> New deck</Link>
      </header>

      <section className="mt-7 grid gap-3 sm:grid-cols-3"><QueueSummary label="Due today" value={dueCount} detail="cards ready for recall" tone="primary" /><QueueSummary label="Next up" value="3" detail="decks scheduled soon" tone="mint" /><QueueSummary label="Best rhythm" value="78%" detail="weekly recall quality" tone="amber" /></section>

      <section className="mt-7 fetch-surface rounded-[20px] p-3 sm:p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><label htmlFor="deck-search" className="sr-only">Search your decks</label><input id="deck-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search decks, subjects, or topics" className="h-11 w-full rounded-[12px] border border-input bg-background pl-10 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div><div className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-muted-foreground" /><label htmlFor="deck-sort" className="sr-only">Sort decks</label><select id="deck-sort" value={sort} onChange={(event) => setSort(event.target.value as 'due' | 'recent')} className="h-11 rounded-[12px] border border-input bg-background px-3 text-xs font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"><option value="due">Due first</option><option value="recent">Name</option></select></div></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{subjects.map((subject) => { const active = selectedSubject === subject; const tokens = subject === 'All' ? null : getSubjectTokens(subject); return <button type="button" key={subject} aria-pressed={active} onClick={() => setSelectedSubject(subject)} className={cn('min-h-10 shrink-0 rounded-[11px] border px-3 text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', active ? subject === 'All' ? 'border-primary bg-primary/10 text-primary' : tokens?.pillActive : 'border-border bg-card text-muted-foreground hover:text-foreground')}>{subject}</button> })}</div></section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">Your queue</p><h2 className="mt-1 text-xl font-extrabold text-foreground">{filtered.length ? `${filtered.length} deck${filtered.length === 1 ? '' : 's'} to choose from` : 'Nothing matches yet'}</h2></div><Filter className="size-5 text-muted-foreground" /></div><div className="mt-4 space-y-3">{filtered.map((deck) => <DeckRow key={deck.id} deck={deck} onStartStudy={onStartStudy} />)}</div>{filtered.length === 0 && <div className="fetch-surface mt-4 flex flex-col items-center rounded-[20px] border-dashed p-10 text-center"><Image src="/mascot/coach-wave.webp" alt="Fetch mascot waving" width={84} height={84} className="size-20 object-contain" /><p className="mt-3 font-display text-base font-extrabold text-foreground">Try a different filter</p><p className="mt-1 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">Clear the search or choose another subject to find the deck you need.</p><button type="button" onClick={() => { setSearch(''); setSelectedSubject('All') }} className="mt-4 min-h-10 rounded-[11px] border border-border bg-card px-3 text-xs font-extrabold text-foreground hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear filters</button></div>}</div>
        <aside className="hidden h-fit rounded-[20px] border border-primary/15 bg-secondary/55 p-5 lg:block"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">Library note</p><h2 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-foreground">Start with the deck that asks for you.</h2></div><Image src="/mascot/coach-study.webp" alt="Fetch studying" width={72} height={72} className="size-16 object-contain" /></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Due cards are kept close to the top. When you finish a review, Fetch keeps your place so returning feels easy.</p><div className="mt-5 flex items-center gap-3 border-t border-primary/15 pt-4"><BookOpen className="size-5 text-primary" /><span className="text-xs font-bold text-muted-foreground">{dueCount} cards ready today</span></div></aside>
      </section>
    </motion.main>
  )
}

function QueueSummary({ label, value, detail, tone }: { label: string; value: string | number; detail: string; tone: 'primary' | 'mint' | 'amber' }) {
  const toneClass = tone === 'primary' ? 'text-primary bg-primary/8' : tone === 'mint' ? 'text-success bg-success/8' : 'text-ember bg-ember/10'
  return <div className="fetch-surface rounded-[17px] p-4"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-extrabold text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-foreground tabular-nums">{value}</p></div><span className={cn('flex size-9 items-center justify-center rounded-[11px]', toneClass)} aria-hidden="true">{tone === 'primary' ? <ArrowRight className="size-4" /> : tone === 'mint' ? <Check className="size-4" /> : <TrendingUp className="size-4" />}</span></div><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div>
}

function DeckRow({ deck, onStartStudy }: { deck: typeof initialDecks[number]; onStartStudy: (deckId: string) => void }) {
  const tokens = getSubjectTokens(deck.subject)
  return <article className="group relative overflow-hidden rounded-[18px] border border-border bg-card p-4 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_14px_30px_rgba(20,33,61,.08)] sm:p-5"><span className={cn('absolute inset-y-0 left-0 w-1', tokens.cardBar)} aria-hidden="true" /><div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={tokens.eyebrow}>{deck.subject}</span><span className="text-xs text-muted-foreground">·</span><span className="text-xs font-bold text-muted-foreground">{deck.due > 0 ? `${deck.due} due today` : 'On track'}</span></div><h3 className="mt-2 truncate font-display text-lg font-extrabold tracking-[-0.025em] text-foreground">{deck.title}</h3><p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{deck.description || 'Keep the concepts close with a focused recall set.'}</p><div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground"><span>{deck.cards} cards</span><span>{deck.due > 0 ? 'Next review in 4h' : 'Reviewed recently'}</span></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><RetentionRing value={deck.retention} size={54} label="" color={tokens.ring} /><button type="button" onClick={() => onStartStudy(deck.id)} className="inline-flex min-h-11 items-center gap-2 rounded-[12px] bg-primary px-3.5 text-xs font-extrabold text-primary-foreground transition-transform hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><Play className="size-3.5 fill-current" /> Study</button><ChevronRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" /></div></div></article>
}
