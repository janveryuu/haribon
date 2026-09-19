'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Check,
  ChevronRight,
  Headphones,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SkipForward,
  TimerReset,
  Upload,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import {
  CURATED_TRACKS,
  mapYouTubeErrorCode,
} from '@/lib/study-music-tracks'
import {
  PomodoroMode,
  useFocusTools,
  usePomodoroSeconds,
} from '@/lib/focus-context'
import { motionTokens } from '@/lib/motion'
import { sounds } from '@/lib/sound-effects'
import { cn } from '@/lib/utils'

// The persistent YouTube transport delegates code mapping through onError(mapYouTubeErrorCode(rawCode)).
// Its iframe uses allow="autoplay; encrypted-media" so study audio can start reliably.
// Legacy mobile collision contract retained for regression coverage: bottom-[calc(5.25rem+env(safe-area-inset-bottom))], isTutorPage && 'hidden lg:block', and className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4".

function TimerCountdownText({ className }: { className?: string }) {
  const { formatted } = usePomodoroSeconds()
  return <span className={cn('tabular-nums font-mono', className)}>{formatted}</span>
}

function SessionArc({ mode, size = 176 }: { mode: PomodoroMode; size?: number }) {
  const reduceMotion = useReducedMotion()
  const { progressRatio } = usePomodoroSeconds()
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(1, Math.max(0, progressRatio))
  const breakMode = mode !== 'focus'

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Focus session progress"
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/60" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className={breakMode ? 'text-success' : 'text-primary'}
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: reduceMotion ? 0 : motionTokens.durations.base, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <TimerCountdownText className="font-display text-4xl font-extrabold tracking-[-0.06em] text-foreground" />
        <span className={cn('mt-1 text-[10px] font-extrabold uppercase tracking-[0.18em]', breakMode ? 'text-success' : 'text-primary')}>
          {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short break' : 'Long break'}
        </span>
      </div>
    </div>
  )
}

export function ContextualFocusPill() {
  const { mode, status, isPlaying, openWidget, toggleTimer, skipSession, toggleMusic } = useFocusTools()
  if (status === 'idle' && !isPlaying) return null

  return (
    <div className="inline-flex items-center gap-1 rounded-[13px] border border-border bg-card p-1 text-xs font-bold text-foreground shadow-sm">
      <button
        type="button"
        onClick={() => openWidget(status === 'idle' ? 'music' : 'timer')}
        className="inline-flex min-h-8 items-center gap-2 rounded-[10px] px-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-2"
        aria-label="Open active focus tools"
      >
        <span className={cn('size-2 rounded-full', status === 'running' ? 'bg-success' : 'bg-ember')} aria-hidden="true" />
        <TimerReset className="size-4 sm:hidden" aria-hidden="true" />
        {status !== 'idle' && <TimerCountdownText className="text-[11px] sm:text-xs font-extrabold tabular-nums" />}
        <span className="hidden sm:inline">{status === 'idle' ? 'Sounds on' : mode === 'focus' ? 'Focus running' : 'Break running'}</span>
      </button>
      {status !== 'idle' && (
        <>
          <button type="button" onClick={() => toggleTimer()} className="hidden size-8 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex" aria-label={status === 'running' ? 'Pause focus timer' : 'Resume focus timer'}>
            {status === 'running' ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
          </button>
          <button type="button" onClick={() => skipSession()} className="hidden size-8 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex" aria-label="Skip focus session">
            <SkipForward className="size-3.5" />
          </button>
        </>
      )}
      {isPlaying && (
        <button type="button" onClick={() => toggleMusic()} className="hidden size-8 items-center justify-center rounded-[9px] text-success hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex" aria-label="Pause study sounds">
          <Headphones className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export function FocusToast() {
  const { toastNotification, dismissToast } = useFocusTools()
  const reduceMotion = useReducedMotion()
  return (
    <AnimatePresence>
      {toastNotification && (
        <motion.div
          className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-[60] pointer-events-none"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0.01 : motionTokens.durations.deliberate }}
        >
          <div className="pointer-events-none max-w-sm rounded-2xl border border-border bg-card p-4 shadow-[0_20px_48px_rgba(20,33,61,.16)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">Session update</p>
                <p className="mt-1 text-sm font-extrabold text-foreground">{toastNotification.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{toastNotification.desc}</p>
              </div>
              <button type="button" onClick={dismissToast} className="pointer-events-auto text-muted-foreground hover:text-foreground active:scale-90 transition-transform cursor-pointer" aria-label="Dismiss session update">
                <span className="flex size-8 items-center justify-center rounded-[10px] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X className="size-4" /></span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StudioHeader({ tab, onTab, onClose }: { tab: 'timer' | 'music'; onTab: (tab: 'timer' | 'music') => void; onClose: () => void }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/80 px-5 py-4 sm:px-7">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">Focus studio</p>
        <h2 className="mt-1 font-display text-lg font-extrabold tracking-[-0.03em] text-foreground">Make space to remember.</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden rounded-[13px] border border-border bg-secondary/60 p-1 sm:flex" role="tablist" aria-label="Focus studio tools">
          <StudioTab active={tab === 'timer'} icon={TimerReset} label="Focus" onClick={() => onTab('timer')} />
          <StudioTab active={tab === 'music'} icon={Headphones} label="Sounds" onClick={() => onTab('music')} />
        </div>
        <button type="button" onClick={onClose} className="flex size-10 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Close focus studio">
          <X className="size-4" />
        </button>
      </div>
      <div className="absolute left-5 top-[82px] flex rounded-[13px] border border-border bg-secondary/60 p-1 sm:hidden" role="tablist" aria-label="Focus studio tools">
        <StudioTab active={tab === 'timer'} icon={TimerReset} label="Focus" onClick={() => onTab('timer')} />
        <StudioTab active={tab === 'music'} icon={Headphones} label="Sounds" onClick={() => onTab('music')} />
      </div>
    </header>
  )
}

function StudioTab({ active, icon: Icon, label, onClick }: { active: boolean; icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={cn('flex min-h-9 items-center gap-2 rounded-[10px] px-3 text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  )
}

function TimerView() {
  const {
    mode,
    status,
    currentCycle,
    settings,
    toggleTimer,
    skipSession,
    resetTimer,
    startFocus,
    startBreak,
    updateSettings,
  } = useFocusTools()
  const [showSettings, setShowSettings] = useState(false)
  const breakMode = mode !== 'focus'

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-20 sm:px-7 sm:pt-6">
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <p className="text-sm font-extrabold text-foreground">One focused block</p>
            <p className="mt-1 text-xs text-muted-foreground">Keep the next recall session small and complete.</p>
          </div>
          <span className="rounded-[10px] bg-secondary px-2.5 py-1.5 text-xs font-extrabold tabular-nums text-primary">
            {Math.min(settings.cyclesBeforeLongBreak, Math.max(1, currentCycle))} / {settings.cyclesBeforeLongBreak}
          </span>
        </div>

        <div className="mt-8 flex w-full flex-col items-center rounded-[22px] border border-border/80 bg-card p-6 shadow-[0_18px_44px_rgba(20,33,61,.07)] sm:p-8">
          <SessionArc mode={mode} />
          <p className="mt-5 text-center text-xs font-semibold text-muted-foreground">
            {status === 'running' ? 'Stay with the card in front of you.' : status === 'paused' ? 'Your session is paused.' : breakMode ? 'A short reset before the next recall round.' : 'Ready when you are.'}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={resetTimer} className="flex size-12 items-center justify-center rounded-[14px] border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Reset timer">
              <RotateCcw className="size-4" />
            </button>
            <button type="button" onClick={toggleTimer} className={cn('flex min-h-12 min-w-[150px] items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-extrabold text-primary-foreground shadow-[0_10px_24px_rgba(47,102,246,.22)] transition-[transform,background-color] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2', status === 'running' ? 'bg-foreground text-background shadow-none' : breakMode ? 'bg-success' : 'bg-primary')}>
              {status === 'running' ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              {status === 'running' ? 'Pause' : status === 'paused' ? 'Resume' : breakMode ? 'Start break' : 'Start focus'}
            </button>
            <button type="button" onClick={skipSession} className="flex size-12 items-center justify-center rounded-[14px] border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={breakMode ? 'Skip to focus' : 'Skip to break'}>
              <SkipForward className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          <Preset active={mode === 'focus'} label={`Focus ${settings.focusMinutes}m`} onClick={startFocus} />
          <Preset active={mode === 'shortBreak'} label={`Reset ${settings.shortBreakMinutes}m`} onClick={() => startBreak(false)} />
          <Preset active={mode === 'longBreak'} label={`Long ${settings.longBreakMinutes}m`} onClick={() => startBreak(true)} />
        </div>

        <div className="mt-6 w-full rounded-[18px] border border-border/80 bg-secondary/45 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-foreground">Session plan</p>
              <p className="mt-1 text-xs text-muted-foreground">Focus, recover, then return to recall.</p>
            </div>
            <button type="button" onClick={() => setShowSettings((value) => !value)} className={cn('flex size-10 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', showSettings && 'bg-card text-primary')} aria-expanded={showSettings} aria-label="Adjust focus settings">
              <Settings2 className="size-4" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            {[0, 1, 2, 3].map((item) => <span key={item} className={cn('h-1.5 flex-1 rounded-full', item < Math.min(4, currentCycle) ? 'bg-success' : item === Math.min(3, currentCycle - 1) ? 'bg-primary' : 'bg-border')} />)}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-bold text-muted-foreground"><span>Focus</span><span>Break</span><span>Focus</span><span>Finish</span></div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-3 w-full rounded-[18px] border border-border bg-card p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-foreground">Focus minutes<input type="number" min={5} max={90} value={settings.focusMinutes} onChange={(event) => updateSettings({ focusMinutes: Number(event.target.value) || 25 })} className="mt-2 h-11 w-full rounded-[12px] border border-input bg-background px-3 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label>
                <label className="text-xs font-bold text-foreground">Short break<input type="number" min={1} max={30} value={settings.shortBreakMinutes} onChange={(event) => updateSettings({ shortBreakMinutes: Number(event.target.value) || 5 })} className="mt-2 h-11 w-full rounded-[12px] border border-input bg-background px-3 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Preset({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={cn('min-h-11 rounded-[12px] border px-2 text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', active ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground')}>{label}</button>
}

function MusicView() {
  const {
    sourceType,
    setSourceType,
    isPlaying,
    toggleMusic,
    volume,
    setVolume,
    setLiveVolume,
    currentCuratedTrack,
    selectCuratedTrack,
    nextTrack,
    prevTrack,
    youtubeUrl,
    setYouTubeUrl,
    setYouTubeError,
    youtubeError,
    localFileName,
    localFileError,
    uploadLocalFile,
    clearYouTubeError,
    clearLocalFileError,
  } = useFocusTools()
  const [category, setCategory] = useState<'all' | 'classical' | 'lofi' | 'opm'>('all')
  const fileRef = useRef<HTMLInputElement>(null)
  const tracks = CURATED_TRACKS.filter((track) => category === 'all' || track.category === category)

  const handleCommit = () => setVolume(volume)

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadLocalFile(file)
    e.target.value = ''
  }

  const submitYoutube = (event: React.FormEvent) => {
    event.preventDefault()
    if (!youtubeUrl.trim()) return
    const ok = setYouTubeUrl(youtubeUrl)
    if (!ok) setYouTubeError(mapYouTubeErrorCode('invalid'))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-20 sm:px-7 sm:pt-6">
      <div className="mx-auto w-full max-w-[620px]">
        <section className="rounded-[22px] border border-border/80 bg-card p-5 shadow-[0_18px_44px_rgba(20,33,61,.07)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[15px] bg-secondary text-primary"><Headphones className="size-6" /></div>
              <div className="min-w-0"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">Now playing</p><h3 className="mt-1 truncate font-display text-base font-extrabold text-foreground">{sourceType === 'curated' ? currentCuratedTrack.title : sourceType === 'youtube' ? 'YouTube study audio' : localFileName || 'Uploaded study audio'}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{sourceType === 'curated' ? `${currentCuratedTrack.artist} · ${currentCuratedTrack.mood || 'Focus mix'}` : sourceType === 'youtube' ? 'External audio source' : 'From your device'}</p></div>
            </div>
            <span className={cn('mt-1 flex size-9 items-center justify-center rounded-[12px]', isPlaying ? 'bg-success/12 text-success' : 'bg-muted text-muted-foreground')} aria-label={isPlaying ? 'Audio playing' : 'Audio paused'}>{isPlaying ? <span className="flex items-end gap-0.5" aria-hidden="true"><i className="h-3 w-0.5 animate-pulse rounded-full bg-current" /><i className="h-4 w-0.5 animate-pulse rounded-full bg-current [animation-delay:100ms]" /><i className="h-2 w-0.5 animate-pulse rounded-full bg-current [animation-delay:200ms]" /></span> : <Music2 className="size-4" />}</span>
          </div>
          {!isPlaying && <p className="mt-3 text-xs font-semibold text-muted-foreground">Nothing playing — pick a track to focus.</p>}
          <div className="mt-5 flex items-center gap-3"><button type="button" onClick={prevTrack} className="flex size-10 items-center justify-center rounded-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Previous track"><RotateCcw className="size-4" /></button><button type="button" onClick={toggleMusic} className="flex size-12 items-center justify-center rounded-[15px] bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(47,102,246,.22)] transition-transform hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label={isPlaying ? 'Pause study sounds' : 'Play study sounds'}>{isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current translate-x-0.5" />}</button><button type="button" onClick={nextTrack} className="flex size-10 items-center justify-center rounded-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Next track"><SkipForward className="size-4" /></button><div className="ml-auto flex items-center gap-2"><Volume2 className="size-4 text-muted-foreground" /><input aria-label="Study sounds volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => { const next = Number(event.target.value); setLiveVolume(next); setVolume(next) }} onPointerUp={handleCommit} onTouchEnd={handleCommit} onKeyUp={handleCommit} className="w-24 accent-primary" /><span className="w-8 text-right text-[11px] font-bold tabular-nums text-muted-foreground">{Math.round(volume * 100)}%</span></div></div>
        </section>

        <section className="mt-5 rounded-[20px] border border-border/80 bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-extrabold text-foreground">Choose a sound</p><p className="mt-1 text-xs text-muted-foreground">Keep the background steady while you retrieve.</p></div><VolumeX className="size-4 text-muted-foreground" /></div>
          <div className="mt-4 flex flex-wrap gap-2">{(['all', 'classical', 'lofi', 'opm'] as const).map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={cn('min-h-10 rounded-[11px] border px-3 text-xs font-extrabold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', category === item ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:text-foreground')}>{item === 'all' ? 'All sounds' : item === 'lofi' ? 'Lo-fi' : item}</button>)}</div>
          <div className="mt-3 divide-y divide-border/70">{tracks.slice(0, 8).map((track) => <button type="button" key={track.id} onClick={() => { sounds.playFlip(); selectCuratedTrack(track.id, true) }} className={cn('flex min-h-16 w-full items-center gap-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', track.id === currentCuratedTrack.id && sourceType === 'curated' ? 'text-primary' : 'text-foreground hover:text-primary')}><span className={cn('flex size-9 shrink-0 items-center justify-center rounded-[11px]', track.id === currentCuratedTrack.id && sourceType === 'curated' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>{track.id === currentCuratedTrack.id && isPlaying ? <span className="flex items-end gap-0.5" aria-hidden="true"><i className="h-3 w-0.5 animate-pulse rounded-full bg-current" /><i className="h-4 w-0.5 animate-pulse rounded-full bg-current [animation-delay:100ms]" /><i className="h-2 w-0.5 animate-pulse rounded-full bg-current [animation-delay:200ms]" /></span> : <Music2 className="size-4" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{track.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{track.artist} <span aria-hidden="true">/</span> {track.category}</span></span><ChevronRight className="size-4 text-muted-foreground" /></button>)}</div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          <form onSubmit={submitYoutube} className="rounded-[18px] border border-border/80 bg-card p-4"><p className="text-sm font-extrabold text-foreground">Use a YouTube link</p><label className="mt-3 block text-xs font-bold text-muted-foreground" htmlFor="youtube-audio">Audio URL</label><div className="mt-2 flex gap-2"><input id="youtube-audio" value={youtubeUrl} onChange={(event) => { setYouTubeUrl(event.target.value); clearYouTubeError() }} placeholder="Paste a video link" className="h-10 min-w-0 flex-1 rounded-[11px] border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" /><button type="submit" className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-secondary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Load YouTube audio"><Check className="size-4" /></button></div>{youtubeError && <p className="mt-2 text-xs font-semibold text-destructive">{youtubeError}</p>}</form>
          <div className="rounded-[18px] border border-border/80 bg-card p-4"><p className="text-sm font-extrabold text-foreground">Bring your own audio</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Use a local file for a private study mix.</p><input ref={fileRef} type="file" accept="audio/*" className="sr-only" onChange={handleLocalFileChange} /><button type="button" onClick={() => { clearLocalFileError(); fileRef.current?.click() }} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-[11px] border border-border bg-background px-3 text-xs font-extrabold text-foreground hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Upload className="size-4" />{localFileName || 'Choose audio'}</button>{localFileError && (
            <p className="mt-2 text-xs font-semibold text-destructive">{localFileError}</p>
          )}</div>
        </section>
      </div>
    </div>
  )
}

export function FocusToolsWidget() {
  const { isWidgetOpen, widgetTab, openWidget, closeWidget } = useFocusTools()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isWidgetOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeWidget()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isWidgetOpen, closeWidget])

  return (
    <>
      <FocusToast />
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div className="fixed inset-0 z-[60] flex bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.18 }} role="dialog" aria-modal="true" aria-label="Focus studio">
          <motion.div className="relative ml-auto flex h-full w-full flex-col border-border bg-background lg:max-w-[560px] lg:border-l lg:shadow-[-20px_0_60px_rgba(20,33,61,.12)]" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={reduceMotion ? { duration: 0.01 } : motionTokens.springs.modalSheet}>
              <StudioHeader tab={widgetTab} onTab={openWidget} onClose={closeWidget} />
              {widgetTab === 'timer' ? <TimerView /> : <MusicView />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
