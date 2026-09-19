'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Copy, Gamepad2, Globe2, LockKeyhole, Plus, Radio, Sparkles, Users, UserRound } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { LivePlayView } from '@/components/app/live-play-view'
import { cn } from '@/lib/utils'

const rooms = [
  { code: 'BIO-214', title: 'Cell biology sprint', subject: 'Biology', players: 18, max: 24, pace: 'Starting soon', tone: 'mint' },
  { code: 'HIS-702', title: 'Revolution review', subject: 'History', players: 9, max: 16, pace: 'In progress', tone: 'amber' },
  { code: 'CALC-41', title: 'Integration warm-up', subject: 'Mathematics', players: 5, max: 12, pace: 'Open room', tone: 'blue' },
] as const

const friends = [
  { name: 'Bea Ramos', detail: 'Reviewing Cell biology', status: 'Focused now', pose: '/mascot/coach-study.webp' },
  { name: 'Carlo Santos', detail: 'Finished 22 cards', status: 'Just finished', pose: '/mascot/coach-thumbs-up.webp' },
  { name: 'Maria Dela Cruz', detail: 'Building a History deck', status: 'Creating', pose: '/mascot/coach-idea.webp' },
]

export function PlayRouteClient() {
  const params = useSearchParams()
  const router = useRouter()
  const room = params.get('room')
  if (room) return <LivePlayView roomCode={room} onExit={() => router.replace('/play')} />
  return <PlayHub />
}

function PlayHub() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [notice, setNotice] = useState('')
  const [circleTab, setCircleTab] = useState<'rooms' | 'circle'>('rooms')
  const [demoCode, setDemoCode] = useState('FETCH-88')

  const createRoom = () => {
    const nextCode = `FETCH-${String((Date.now() % 90) + 10)}`
    setDemoCode(nextCode)
    setNotice(`Room ${nextCode} is ready. Share the code with your study circle.`)
    router.push(`/play?room=${nextCode}`)
  }

  const joinRoom = (event: FormEvent) => {
    event.preventDefault()
    const normalized = roomCode.trim().toUpperCase()
    if (!normalized) {
      setNotice('Enter a room code to join a study round.')
      return
    }
    router.push(`/play?room=${encodeURIComponent(normalized)}`)
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="mx-auto w-full max-w-[1240px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-14">
      <header className="flex flex-col gap-6 rounded-[24px] border border-border bg-card p-5 shadow-[0_18px_50px_rgba(20,33,61,.06)] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[620px]">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary"><Gamepad2 className="size-4" /> Study circle</div>
          <h1 className="mt-3 max-w-[15ch] font-display text-3xl font-extrabold tracking-[-0.045em] text-foreground sm:text-5xl">Study together, at your pace.</h1>
          <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted-foreground sm:text-base">Open a small recall room, invite a friend, and keep the energy where it belongs: on remembering well.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-muted-foreground"><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"><Radio className="size-3.5 text-success" /> Live-ready rooms</span><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"><LockKeyhole className="size-3.5 text-primary" /> Private by default</span></div>
        </div>
        <div className="relative flex min-h-[160px] items-end justify-between overflow-hidden rounded-[20px] bg-[#eaf3ff] px-5 pt-4 dark:bg-[#16294b] sm:min-w-[280px] sm:px-7">
          <Image src="/mascot/coach-celebrate.webp" alt="Fetch celebrating a study win" width={180} height={180} className="absolute bottom-[-24px] left-3 size-44 object-contain" />
          <div className="relative ml-auto max-w-[130px] pb-4 text-right text-sm font-extrabold leading-snug text-[#173466] dark:text-blue-50">A good room makes recall feel lighter.</div>
        </div>
      </header>

      <section className="mt-7 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[22px] border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-xl font-extrabold text-foreground">Start a room</h2><p className="mt-1 text-sm text-muted-foreground">Choose a deck in the next step, then invite your circle.</p></div><span className="flex size-10 items-center justify-center rounded-[13px] bg-primary/10 text-primary"><Plus className="size-5" /></span></div>
          <Button type="button" onClick={createRoom} className="mt-6 min-h-12 w-full justify-between rounded-[14px] px-4 text-sm font-extrabold"><span className="flex items-center gap-2"><Plus className="size-4" /> Create a private room</span><ArrowRight className="size-4" /></Button>
          <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><span>or join with a code</span><span className="h-px flex-1 bg-border" /></div>
          <form onSubmit={joinRoom} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="room-code">Room code</label><input id="room-code" value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase())} placeholder="FETCH-88" className="min-h-11 min-w-0 flex-1 rounded-[13px] border border-input bg-background px-3 text-sm font-bold uppercase tracking-[0.12em] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" /><Button type="submit" variant="outline" className="min-h-11 rounded-[13px] px-4 font-extrabold">Join</Button></form>
          {notice && <p role="status" className="mt-3 text-xs font-semibold text-primary">{notice}</p>}
        </div>

    <div className="rounded-[22px] border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-xl font-extrabold text-foreground">Your study circle</h2><p className="mt-1 text-sm text-muted-foreground">See who is learning alongside you.</p></div><UserRound className="size-5 text-muted-foreground" /></div><div className="mt-5 flex rounded-[12px] bg-muted p-1" role="tablist" aria-label="Play hub sections"><button type="button" onClick={() => setCircleTab('rooms')} className={cn('flex-1 rounded-[9px] px-3 py-2 text-xs font-extrabold transition-colors', circleTab === 'rooms' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>Open rooms</button><button type="button" onClick={() => setCircleTab('circle')} className={cn('flex-1 rounded-[9px] px-3 py-2 text-xs font-extrabold transition-colors', circleTab === 'circle' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>Friends</button></div>{circleTab === 'rooms' ? <div className="mt-4 space-y-2">{rooms.map((item) => <button key={item.code} type="button" onClick={() => router.push(`/play?room=${item.code}`)} className="group flex w-full items-center gap-3 rounded-[14px] border border-border p-3 text-left transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><span className={cn('flex size-9 shrink-0 items-center justify-center rounded-[11px]', item.tone === 'mint' ? 'bg-success/12 text-success' : item.tone === 'amber' ? 'bg-ember/12 text-ember' : 'bg-primary/10 text-primary')}><Users className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-extrabold text-foreground">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.subject} · {item.players}/{item.max} students · {item.pace}</span></span><ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></button>)}</div> : <div className="mt-4 space-y-2">{friends.map((friend) => { const slug = friend.name.toLowerCase().replaceAll(' ', '-'); return <Link href={`/profile/${slug}`} key={friend.name} className="flex items-center gap-3 rounded-[14px] border border-border p-3 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Image src={friend.pose} alt="" width={40} height={40} className="size-10 rounded-[12px] bg-secondary object-contain" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-foreground">{friend.name}</p><p className="truncate text-xs text-muted-foreground">{friend.detail}</p></div><span className="shrink-0 text-[10px] font-bold text-success">{friend.status}</span></Link> })}</div>}</div>
      </section>

      <section className="mt-5 rounded-[22px] border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-xl font-extrabold text-foreground">Play with intention</h2><p className="mt-1 text-sm text-muted-foreground">Points reward accurate, timely recall. Nothing here affects your core due queue.</p></div><Sparkles className="size-5 text-ember" /></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Principle title="Recall first" detail="Answer from memory before the room reveals feedback." /><Principle title="Small rooms" detail="Keep rounds focused with people you recognize." /><Principle title="No pressure" detail="Play is optional and stays separate from your study rhythm." /></div></section>
    </motion.main>
  )
}

function Principle({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-[15px] bg-secondary/60 p-4"><p className="text-sm font-extrabold text-foreground">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>
}
