'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from 'react'
import {
  CURATED_TRACKS,
  StudyTrack,
  ProceduralAmbientPlayer,
  mapYouTubeErrorCode,
} from '@/lib/study-music-tracks'
import { sounds } from '@/lib/sound-effects'
import { initialUser } from '@/lib/mock-data'

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak'
export type PomodoroStatus = 'idle' | 'running' | 'paused'
export type MusicSourceType = 'curated' | 'youtube' | 'local'

export interface PomodoroSettings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  cyclesBeforeLongBreak: number
  soundChime: boolean
  grantXpOnComplete: boolean
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
  soundChime: true,
  grantXpOnComplete: true,
}

const SESSION_STORAGE_KEY = 'fetch_pomodoro_session'

import {
  SavedPomodoroSession,
  ReconcileResult,
  reconcileSavedSession,
} from './focus-reconciliation'

export type { SavedPomodoroSession, ReconcileResult }
export { reconcileSavedSession }

// Sub-store ticker for zero-cascading re-renders on the 1-second countdown tick
type TickerListener = (remainingSeconds: number, progress: number) => void

class PomodoroTickerStore {
  private listeners: Set<TickerListener> = new Set()
  private remainingSeconds: number = 25 * 60
  private progress: number = 0

  public getRemainingSeconds(): number {
    return this.remainingSeconds
  }

  public getProgress(): number {
    return this.progress
  }

  public setValues(remaining: number, progress: number) {
    this.remainingSeconds = remaining
    this.progress = progress
    this.listeners.forEach((fn) => fn(this.remainingSeconds, this.progress))
  }

  public subscribe(fn: TickerListener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
}

export const pomodoroTicker = new PomodoroTickerStore()

export interface FocusToolsContextValue {
  // Pomodoro timer state
  mode: PomodoroMode
  status: PomodoroStatus
  currentCycle: number
  settings: PomodoroSettings
  toastNotification: {
    id: string
    title: string
    desc: string
    mascotPose?: 'celebrate' | 'wave' | 'ball'
    type: 'focus' | 'break' | 'xp'
  } | null
  dismissToast: () => void

  // Timer actions
  startFocus: () => void
  startBreak: (long?: boolean) => void
  pauseTimer: () => void
  resumeTimer: () => void
  toggleTimer: () => void
  skipSession: () => void
  resetTimer: () => void
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void

  // Music state
  sourceType: MusicSourceType
  isPlaying: boolean
  isFallbackActive: boolean
  volume: number
  currentCuratedTrack: StudyTrack
  youtubeUrl: string
  youtubeVideoId: string | null
  youtubeError: string | null
  localFileName: string | null
  localFileError: string | null

  // Music actions
  playMusic: () => void
  pauseMusic: () => void
  toggleMusic: () => void
  setVolume: (v: number) => void
  setLiveVolume: (v: number) => void
  setSourceType: (source: MusicSourceType) => void
  selectCuratedTrack: (trackId: string, autoPlay?: boolean) => void
  nextTrack: () => void
  prevTrack: () => void
  setYouTubeUrl: (url: string) => boolean
  setYouTubeError: (error: string | null) => void
  uploadLocalFile: (file: File) => boolean
  clearYouTubeError: () => void
  clearLocalFileError: () => void
  registerYouTubeIframe: (iframe: HTMLIFrameElement | null) => void

  // Widget visibility & control
  isWidgetOpen: boolean
  widgetTab: 'timer' | 'music'
  openWidget: (tab?: 'timer' | 'music') => void
  closeWidget: () => void
  toggleWidget: (tab?: 'timer' | 'music') => void

  // "+" Action Menu state
  isActionMenuOpen: boolean
  openActionMenu: () => void
  closeActionMenu: () => void
}

const FocusToolsContext = createContext<FocusToolsContextValue | null>(null)

/**
 * Root Layout Persistent YouTube Audio Player.
 * Lives inside FocusToolsProvider at app/layout.tsx to decouple the iframe from route changes.
 * The iframe remains mounted across route navigations (/home -> /decks -> /tutor etc.) as long as youtubeVideoId is set.
 */
function PersistentYouTubeAudioPlayer({
  videoId,
  onIframeReady,
  onError,
}: {
  videoId: string
  onIframeReady: (iframe: HTMLIFrameElement | null) => void
  onError: (errMsg: string) => void
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    onIframeReady(iframeRef.current)
    return () => onIframeReady(null)
  }, [onIframeReady, videoId])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.origin === 'string' && !event.origin.includes('youtube')) return

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        if (data?.event === 'onReady' || data?.event === 'initialDelivery') {
          onIframeReady(iframeRef.current)
        }

        let rawCode: number | string | null = null
        if (data?.event === 'onError') {
          rawCode =
            typeof data.info === 'object' && data.info !== null
              ? (data.info.errorCode ?? data.info.error ?? 999)
              : (data.info ?? 999)
        } else if (data?.info?.errorCode !== undefined || data?.info?.error !== undefined) {
          rawCode = data.info.errorCode ?? data.info.error
        }

        if (rawCode !== null && rawCode !== undefined) {
          onError(mapYouTubeErrorCode(rawCode))
        }
      } catch {}
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onError, onIframeReady])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: -9999,
        width: '1px',
        height: '1px',
        opacity: 0.01,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&origin=${
          typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''
        }`}
        title="YouTube Study Music Stream"
        allow="autoplay; encrypted-media"
        onLoad={() => onIframeReady(iframeRef.current)}
        className="size-px"
      />
    </div>
  )
}

export function FocusToolsProvider({ children }: { children: React.ReactNode }) {
  // 1. Settings State (persisted in localStorage)
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS)

  // 2. Pomodoro State
  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [status, setStatus] = useState<PomodoroStatus>('idle')
  const [currentCycle, setCurrentCycle] = useState<number>(1)

  // Drift-free timestamp references
  const targetDurationRef = useRef<number>(25 * 60)
  const startTimestampRef = useRef<number>(0)
  const pausedAccumulatedRef = useRef<number>(0)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef<boolean>(false)

  // Toast notifications for session transitions & Fetch mascot moments
  const [toastNotification, setToastNotification] = useState<FocusToolsContextValue['toastNotification']>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 3. Music State
  const [sourceType, setSourceType] = useState<MusicSourceType>('curated')
  const sourceTypeRef = useRef<MusicSourceType>('curated')
  const [isPlaying, setIsPlaying] = useState(false)
  const isPlayingRef = useRef(false)
  const [volume, setVolumeState] = useState(0.7)
  const volumeRef = useRef(0.7)
  const [currentCuratedTrackId, setCurrentCuratedTrackId] = useState(CURATED_TRACKS[0]?.id || 'track-mozart-21')
  const currentCuratedTrackIdRef = useRef(CURATED_TRACKS[0]?.id || 'track-mozart-21')
  const [youtubeUrl, setYoutubeUrlState] = useState('')
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null)
  const youtubeVideoIdRef = useRef<string | null>(null)
  const [youtubeError, setYoutubeError] = useState<string | null>(null)
  const [localFileName, setLocalFileName] = useState<string | null>(null)
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null)
  const localFileUrlRef = useRef<string | null>(null)
  const [localFileError, setLocalFileError] = useState<string | null>(null)
  const [isFallbackActive, setIsFallbackActive] = useState(false)

  // Audio elements & YouTube Controller
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const ambientPlayerRef = useRef<ProceduralAmbientPlayer | null>(null)
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null)

  // 4. Widget Visibility State
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const [widgetTab, setWidgetTab] = useState<'timer' | 'music'>('timer')
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)

  // Synchronize mutable refs
  useEffect(() => {
    sourceTypeRef.current = sourceType
  }, [sourceType])

  useEffect(() => {
    localFileUrlRef.current = localFileUrl
  }, [localFileUrl])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  useEffect(() => {
    currentCuratedTrackIdRef.current = currentCuratedTrackId
  }, [currentCuratedTrackId])

  useEffect(() => {
    youtubeVideoIdRef.current = youtubeVideoId
  }, [youtubeVideoId])

  // Auto-dismiss helper for toasts to ensure they are brief and non-blocking
  const showToast = useCallback((toast: FocusToolsContextValue['toastNotification']) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = null
    }
    setToastNotification(toast)
    if (toast) {
      toastTimeoutRef.current = setTimeout(() => {
        setToastNotification(null)
      }, 5500)
    }
  }, [])

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = null
    }
    setToastNotification(null)
  }, [])

  // Save active timer session to localStorage for reload & tab close continuity
  const saveSessionToStorage = useCallback(
    (curStatus: PomodoroStatus, curMode: PomodoroMode, curCycle: number) => {
      try {
        if (curStatus === 'idle') {
          localStorage.removeItem(SESSION_STORAGE_KEY)
          return
        }
        const sessionData: SavedPomodoroSession = {
          mode: curMode,
          status: curStatus,
          startTimestamp: startTimestampRef.current,
          pausedAccumulated: pausedAccumulatedRef.current,
          targetDuration: targetDurationRef.current,
          currentCycle: curCycle,
          savedAt: Date.now(),
        }
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
      } catch {}
    },
    []
  )

  // Compute duration based on mode and settings
  const getDurationForMode = useCallback(
    (targetMode: PomodoroMode): number => {
      if (targetMode === 'focus') return settings.focusMinutes * 60
      if (targetMode === 'shortBreak') return settings.shortBreakMinutes * 60
      return settings.longBreakMinutes * 60
    },
    [settings]
  )

  // Session completion handler
  const handleSessionCompleted = useCallback(
    (wasAway = false) => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }

      setStatus('idle')
      pausedAccumulatedRef.current = 0
      startTimestampRef.current = 0
      saveSessionToStorage('idle', mode, currentCycle)

      if (mode === 'focus') {
        const isLong = currentCycle >= settings.cyclesBeforeLongBreak
        const nextMode: PomodoroMode = isLong ? 'longBreak' : 'shortBreak'
        setMode(nextMode)
        const nextDur = getDurationForMode(nextMode)
        targetDurationRef.current = nextDur
        pomodoroTicker.setValues(nextDur, 0)

        // Award study XP credit
        const earnedXp = settings.grantXpOnComplete ? 50 : 0
        if (earnedXp > 0) {
          initialUser.totalXp += earnedXp
          initialUser.todayXp += earnedXp
          try {
            localStorage.setItem('fetch_user_total_xp', String(initialUser.totalXp))
            localStorage.setItem('fetch_user_today_xp', String(initialUser.todayXp))
          } catch {}
        }

        // Audio chime (respects sounds.isMuted())
        if (settings.soundChime) {
          sounds.playPomodoroChime()
        }

        showToast({
          id: `toast-${Date.now()}`,
          title: wasAway ? 'Session completed while away!' : 'Focus session fetched!',
          desc: isLong
            ? `${settings.cyclesBeforeLongBreak} focus cycles complete! +${earnedXp} XP earned. Fetch some water and take a ${settings.longBreakMinutes}-minute long break.`
            : `${settings.focusMinutes} minutes locked in! +${earnedXp} XP earned. Take a ${settings.shortBreakMinutes}-minute break to let memories stabilize.`,
          mascotPose: 'celebrate',
          type: 'focus',
        })
      } else {
        // Break session completed
        if (settings.soundChime) {
          sounds.playBreakChime()
        }

        // If completing a long break, reset cycle to 1; if short break, advance to next cycle
        const nextCycle = mode === 'longBreak' ? 1 : Math.min(settings.cyclesBeforeLongBreak, currentCycle + 1)
        setCurrentCycle(nextCycle)

        setMode('focus')
        const focusDur = getDurationForMode('focus')
        targetDurationRef.current = focusDur
        pomodoroTicker.setValues(focusDur, 0)

        showToast({
          id: `toast-${Date.now()}`,
          title: 'Break complete!',
          desc: 'Ready to retrieve more cards? Start your next focus cycle when you are ready.',
          mascotPose: 'ball',
          type: 'break',
        })
      }
    },
    [mode, currentCycle, settings, getDurationForMode, saveSessionToStorage, showToast]
  )

  // Drift-free interval ticker runner
  const runTick = useCallback(() => {
    if (status !== 'running') return

    const now = Date.now()
    const elapsedSinceStart = (now - startTimestampRef.current) / 1000
    const totalElapsed = pausedAccumulatedRef.current + elapsedSinceStart
    const remaining = Math.max(0, targetDurationRef.current - totalElapsed)
    const progress = Math.min(1, Math.max(0, totalElapsed / targetDurationRef.current))

    pomodoroTicker.setValues(Math.round(remaining), progress)

    if (remaining <= 0) {
      handleSessionCompleted(false)
    }
  }, [status, handleSessionCompleted])

  // Manage setInterval when status changes
  useEffect(() => {
    if (status === 'running') {
      runTick()
      timerIntervalRef.current = setInterval(runTick, 500)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [status, runTick])

  // Background tab visibility & focus drift resolution
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (status === 'running') {
        const now = Date.now()
        const elapsedSinceStart = (now - startTimestampRef.current) / 1000
        const totalElapsed = pausedAccumulatedRef.current + elapsedSinceStart

        if (totalElapsed >= targetDurationRef.current) {
          handleSessionCompleted(true)
        } else {
          runTick()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityOrFocus)
    window.addEventListener('focus', handleVisibilityOrFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      window.removeEventListener('focus', handleVisibilityOrFocus)
    }
  }, [status, handleSessionCompleted, runTick])

  // Load preferences and restore active session from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('fetch_pomodoro_settings')
      let activeSettings = DEFAULT_SETTINGS
      if (savedSettings) {
        activeSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) }
        setSettings(activeSettings)
      }
      const savedVol = localStorage.getItem('fetch_music_volume')
      if (savedVol) {
        const v = parseFloat(savedVol)
        if (!isNaN(v) && v >= 0 && v <= 1) {
          setVolumeState(v)
          volumeRef.current = v
        }
      }

      const savedTotalXp = localStorage.getItem('fetch_user_total_xp')
      if (savedTotalXp) {
        const parsed = parseInt(savedTotalXp, 10)
        if (!isNaN(parsed) && parsed > 0) {
          initialUser.totalXp = parsed
        }
      }
      const savedTodayXp = localStorage.getItem('fetch_user_today_xp')
      if (savedTodayXp) {
        const parsed = parseInt(savedTodayXp, 10)
        if (!isNaN(parsed) && parsed > 0) {
          initialUser.todayXp = parsed
        }
      }

      // Check session continuity
      const savedSessionStr = localStorage.getItem(SESSION_STORAGE_KEY)
      if (savedSessionStr) {
        const session: SavedPomodoroSession = JSON.parse(savedSessionStr)
        if (session && (session.status === 'running' || session.status === 'paused')) {
          const res = reconcileSavedSession(session, Date.now(), activeSettings)
          setMode(res.mode)
          setCurrentCycle(res.currentCycle)
          setStatus(res.status)
          targetDurationRef.current = res.targetDuration
          pomodoroTicker.setValues(res.remainingSeconds, res.progress)

          if (res.action === 'expired') {
            pausedAccumulatedRef.current = 0
            startTimestampRef.current = 0
            if (res.earnedXp > 0) {
              initialUser.totalXp += res.earnedXp
              initialUser.todayXp += res.earnedXp
              try {
                localStorage.setItem('fetch_user_total_xp', String(initialUser.totalXp))
                localStorage.setItem('fetch_user_today_xp', String(initialUser.todayXp))
              } catch {}
            }
            if (res.toastNotification) {
              showToast(res.toastNotification)
            }
            localStorage.removeItem(SESSION_STORAGE_KEY)
          } else if (res.action === 'resumed') {
            startTimestampRef.current = session.startTimestamp
            pausedAccumulatedRef.current = session.pausedAccumulated
          } else if (res.action === 'paused') {
            pausedAccumulatedRef.current = session.pausedAccumulated
          }
        }
      }
    } catch {} finally {
      isInitializedRef.current = true
    }
  }, [showToast])

  // Save settings on change
  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      if (updated.cyclesBeforeLongBreak && currentCycle > updated.cyclesBeforeLongBreak) {
        setCurrentCycle(updated.cyclesBeforeLongBreak)
      }
      try {
        localStorage.setItem('fetch_pomodoro_settings', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }, [currentCycle])

  // Update target duration ref and ticker when mode or duration settings change
  useEffect(() => {
    if (!isInitializedRef.current) return

    const curDur = getDurationForMode(mode)
    targetDurationRef.current = curDur

    if (status === 'idle') {
      pomodoroTicker.setValues(curDur, 0)
    } else if (status === 'paused') {
      const elapsed = pausedAccumulatedRef.current
      const remaining = Math.max(0, curDur - elapsed)
      const progress = Math.min(1, Math.max(0, elapsed / curDur))
      pomodoroTicker.setValues(Math.round(remaining), progress)
      saveSessionToStorage('paused', mode, currentCycle)
    } else if (status === 'running') {
      const now = Date.now()
      const elapsedSinceStart = (now - startTimestampRef.current) / 1000
      const totalElapsed = pausedAccumulatedRef.current + elapsedSinceStart
      const remaining = Math.max(0, curDur - totalElapsed)
      const progress = Math.min(1, Math.max(0, totalElapsed / curDur))
      pomodoroTicker.setValues(Math.round(remaining), progress)
      saveSessionToStorage('running', mode, currentCycle)
    }
  }, [mode, status, settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes, getDurationForMode, currentCycle, saveSessionToStorage])

  // YouTube IFrame Player API postMessage helper
  const sendYouTubeCommand = useCallback(
    (cmd: { action: string; value?: number | string }) => {
      const iframe = youtubeIframeRef.current
      if (!iframe || !iframe.contentWindow) return

      try {
        if (cmd.action === 'play') {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*')
        } else if (cmd.action === 'pause') {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*')
        } else if (cmd.action === 'setVolume' && typeof cmd.value === 'number') {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [cmd.value] }), '*')
        } else if (cmd.action === 'mute') {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*')
        } else if (cmd.action === 'unMute') {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*')
        }
      } catch {}
    },
    []
  )

  const registerYouTubeIframe = useCallback(
    (iframe: HTMLIFrameElement | null) => {
      youtubeIframeRef.current = iframe
      if (iframe && isPlayingRef.current) {
        // Sync initial volume & play
        sendYouTubeCommand({ action: 'setVolume', value: Math.round(volumeRef.current * 100) })
        sendYouTubeCommand({ action: 'play' })
      }
    },
    [sendYouTubeCommand]
  )

  // Initialize HTML5 Audio and Procedural Ambient Player
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio()
      audio.preload = 'auto'
      audioElementRef.current = audio
      ambientPlayerRef.current = new ProceduralAmbientPlayer()

      const handleEnded = () => {
        if (sourceTypeRef.current === 'curated') {
          nextTrack()
        }
      }

      const handleError = () => {
        if (sourceTypeRef.current === 'local') {
          setLocalFileError('Could not decode or play this audio file. Please try another track.')
          setIsPlaying(false)
          setIsFallbackActive(false)
          return
        }

        // Curated track network failure: smoothly fall back to procedural soundscape
        const track = CURATED_TRACKS.find((t) => t.id === currentCuratedTrackIdRef.current)
        if (track?.ambientType && ambientPlayerRef.current) {
          ambientPlayerRef.current.play(track.ambientType, volumeRef.current)
          setIsFallbackActive(true)
        }
      }

      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
        audio.pause()
        audio.src = ''
        ambientPlayerRef.current?.destroy()
        if (localFileUrlRef.current) {
          try {
            URL.revokeObjectURL(localFileUrlRef.current)
          } catch {}
        }
      }
    }
  }, [])

  // Timer actions
  const startFocus = useCallback(() => {
    setMode('focus')
    const dur = getDurationForMode('focus')
    targetDurationRef.current = dur
    pausedAccumulatedRef.current = 0
    startTimestampRef.current = Date.now()
    setStatus('running')
    pomodoroTicker.setValues(dur, 0)
    saveSessionToStorage('running', 'focus', currentCycle)
    sounds.playFlip()
  }, [getDurationForMode, currentCycle, saveSessionToStorage])

  const startBreak = useCallback(
    (long = false) => {
      const targetMode: PomodoroMode = long ? 'longBreak' : 'shortBreak'
      setMode(targetMode)
      const dur = getDurationForMode(targetMode)
      targetDurationRef.current = dur
      pausedAccumulatedRef.current = 0
      startTimestampRef.current = Date.now()
      setStatus('running')
      pomodoroTicker.setValues(dur, 0)
      saveSessionToStorage('running', targetMode, currentCycle)
      sounds.playFlip()
    },
    [getDurationForMode, currentCycle, saveSessionToStorage]
  )

  const pauseTimer = useCallback(() => {
    if (status === 'running') {
      const now = Date.now()
      pausedAccumulatedRef.current += (now - startTimestampRef.current) / 1000
      setStatus('paused')
      saveSessionToStorage('paused', mode, currentCycle)
      sounds.playFlip()
    }
  }, [status, mode, currentCycle, saveSessionToStorage])

  const resumeTimer = useCallback(() => {
    if (status === 'paused' || status === 'idle') {
      startTimestampRef.current = Date.now()
      setStatus('running')
      saveSessionToStorage('running', mode, currentCycle)
      sounds.playFlip()
    }
  }, [status, mode, currentCycle, saveSessionToStorage])

  const toggleTimer = useCallback(() => {
    if (status === 'running') {
      pauseTimer()
    } else {
      resumeTimer()
    }
  }, [status, pauseTimer, resumeTimer])

  const skipSession = useCallback(() => {
    sounds.playFlip()
    handleSessionCompleted(false)
  }, [handleSessionCompleted])

  const resetTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setStatus('idle')
    pausedAccumulatedRef.current = 0
    startTimestampRef.current = 0
    saveSessionToStorage('idle', mode, currentCycle)
    const dur = getDurationForMode(mode)
    targetDurationRef.current = dur
    pomodoroTicker.setValues(dur, 0)
    sounds.playFlip()
  }, [mode, currentCycle, getDurationForMode, saveSessionToStorage])

  // Music playback sync
  const currentCuratedTrack = CURATED_TRACKS.find((t) => t.id === currentCuratedTrackId) || CURATED_TRACKS[0]

  const handleSetSourceType = useCallback((source: MusicSourceType) => {
    sourceTypeRef.current = source
    setSourceType(source)
  }, [])

  const selectCuratedTrack = useCallback(
    (trackId: string, autoPlay: boolean = true) => {
      setCurrentCuratedTrackId(trackId)
      currentCuratedTrackIdRef.current = trackId
      setSourceType('curated')
      sourceTypeRef.current = 'curated'

      const track = CURATED_TRACKS.find((t) => t.id === trackId) || CURATED_TRACKS[0]
      const audio = audioElementRef.current
      const ambient = ambientPlayerRef.current

      if (autoPlay) {
        setIsPlaying(true)
        isPlayingRef.current = true
      }

      if (track.ambientType && (!track.audioUrl || track.audioUrl === '')) {
        audio?.pause()
        if (autoPlay || isPlayingRef.current) {
          ambient?.play(track.ambientType, volumeRef.current)
          setIsFallbackActive(true)
        }
      } else if (audio) {
        ambient?.stop()
        setIsFallbackActive(false)
        audio.src = track.audioUrl
        audio.volume = volumeRef.current
        if (autoPlay || isPlayingRef.current) {
          audio.play().catch(() => {
            if (track.ambientType && ambient) {
              ambient.play(track.ambientType, volumeRef.current)
              setIsFallbackActive(true)
            }
          })
        }
      }
    },
    []
  )

  const nextTrack = useCallback(() => {
    const currentIndex = CURATED_TRACKS.findIndex((t) => t.id === currentCuratedTrackIdRef.current)
    const nextIndex = (currentIndex + 1) % CURATED_TRACKS.length
    selectCuratedTrack(CURATED_TRACKS[nextIndex].id, true)
  }, [selectCuratedTrack])

  const prevTrack = useCallback(() => {
    const currentIndex = CURATED_TRACKS.findIndex((t) => t.id === currentCuratedTrackIdRef.current)
    const prevIndex = (currentIndex - 1 + CURATED_TRACKS.length) % CURATED_TRACKS.length
    selectCuratedTrack(CURATED_TRACKS[prevIndex].id, true)
  }, [selectCuratedTrack])

  const playMusic = useCallback(() => {
    setIsPlaying(true)
    isPlayingRef.current = true
    const audio = audioElementRef.current
    const ambient = ambientPlayerRef.current
    const activeSource = sourceTypeRef.current

    if (activeSource === 'curated') {
      const activeTrack = CURATED_TRACKS.find((t) => t.id === currentCuratedTrackIdRef.current) || CURATED_TRACKS[0]
      if (activeTrack.ambientType && (!activeTrack.audioUrl || activeTrack.audioUrl === '')) {
        audio?.pause()
        ambient?.play(activeTrack.ambientType, volumeRef.current)
        setIsFallbackActive(true)
      } else if (audio) {
        ambient?.stop()
        setIsFallbackActive(false)
        if (audio.src !== activeTrack.audioUrl) {
          audio.src = activeTrack.audioUrl
        }
        audio.volume = volumeRef.current
        audio.play().catch(() => {
          if (activeTrack.ambientType && ambient) {
            ambient.play(activeTrack.ambientType, volumeRef.current)
            setIsFallbackActive(true)
          }
        })
      }
    } else if (activeSource === 'local') {
      const activeLocalUrl = localFileUrlRef.current
      if (!activeLocalUrl) {
        setLocalFileError('Please choose an audio file from your device first.')
        setIsPlaying(false)
        isPlayingRef.current = false
        return
      }
      if (audio) {
        ambient?.stop()
        setIsFallbackActive(false)
        if (audio.src !== activeLocalUrl) {
          audio.src = activeLocalUrl
        }
        audio.volume = volumeRef.current
        audio.play().catch(() => {
          setLocalFileError('Could not play this audio track on your device.')
          setIsPlaying(false)
          isPlayingRef.current = false
        })
      }
    } else if (activeSource === 'youtube') {
      const activeVideoId = youtubeVideoIdRef.current
      if (!activeVideoId) {
        setYoutubeError('Please add a valid YouTube link first.')
        setIsPlaying(false)
        isPlayingRef.current = false
        return
      }
      audio?.pause()
      ambient?.stop()
      setIsFallbackActive(false)
      sendYouTubeCommand({ action: 'play' })
      sendYouTubeCommand({ action: 'setVolume', value: Math.round(volumeRef.current * 100) })
    }
  }, [sendYouTubeCommand])

  const pauseMusic = useCallback(() => {
    setIsPlaying(false)
    isPlayingRef.current = false
    setIsFallbackActive(false)
    audioElementRef.current?.pause()
    ambientPlayerRef.current?.stop()
    if (sourceTypeRef.current === 'youtube') {
      sendYouTubeCommand({ action: 'pause' })
    }
  }, [sendYouTubeCommand])

  const toggleMusic = useCallback(() => {
    if (isPlayingRef.current) {
      pauseMusic()
    } else {
      playMusic()
    }
  }, [pauseMusic, playMusic])

  // Live volume updates (0-1) without triggering React state updates on every frame
  const setLiveVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v))
      volumeRef.current = clamped
      if (audioElementRef.current) {
        audioElementRef.current.volume = clamped
      }
      ambientPlayerRef.current?.setVolume(clamped)
      if (clamped === 0) {
        sendYouTubeCommand({ action: 'mute' })
      } else {
        sendYouTubeCommand({ action: 'unMute' })
      }
      sendYouTubeCommand({ action: 'setVolume', value: Math.round(clamped * 100) })
    },
    [sendYouTubeCommand]
  )

  // Committed volume update on gesture end
  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v))
      setVolumeState(clamped)
      setLiveVolume(clamped)
      try {
        localStorage.setItem('fetch_music_volume', clamped.toString())
      } catch {}
    },
    [setLiveVolume]
  )

  // YouTube URL validator & extractor
  const setYouTubeUrl = useCallback((url: string): boolean => {
    setYoutubeUrlState(url)
    setYoutubeError(null)

    const trimmed = url.trim()
    if (!trimmed) {
      setYoutubeVideoId(null)
      youtubeVideoIdRef.current = null
      pauseMusic()
      return false
    }

    // Comprehensive YouTube ID extractor regex supporting youtu.be, youtube.com, youtube-nocookie.com, watch?v=, embed/, live/, shorts/, and music.youtube.com
    const match = trimmed.match(
      /(?:youtu\.be\/|(?:youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/
    )
    let id: string | null = null
    if (match && match[1]) {
      id = match[1]
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      id = trimmed
    }

    if (id) {
      setYoutubeVideoId(id)
      youtubeVideoIdRef.current = id
      setSourceType('youtube')
      sourceTypeRef.current = 'youtube'
      setIsPlaying(true)
      isPlayingRef.current = true
      setIsFallbackActive(false)
      audioElementRef.current?.pause()
      ambientPlayerRef.current?.stop()
      return true
    } else {
      setYoutubeError('Please enter a valid YouTube link (e.g., https://youtube.com/watch?v=... or youtu.be/...)')
      setYoutubeVideoId(null)
      youtubeVideoIdRef.current = null
      pauseMusic()
      return false
    }
  }, [pauseMusic])

  const handleSetYouTubeError = useCallback((error: string | null) => {
    setYoutubeError(error)
    if (error) {
      setIsPlaying(false)
      isPlayingRef.current = false
      setIsFallbackActive(false)
      audioElementRef.current?.pause()
      ambientPlayerRef.current?.stop()
    }
  }, [])

  const clearYouTubeError = useCallback(() => {
    setYoutubeError(null)
  }, [])

  const clearLocalFileError = useCallback(() => {
    setLocalFileError(null)
  }, [])

  // Local file upload validator & handler
  const uploadLocalFile = useCallback(
    (file: File): boolean => {
      setLocalFileError(null)

      const handleValidationError = (msg: string) => {
        setLocalFileError(msg)
        if (sourceTypeRef.current === 'local') {
          setIsPlaying(false)
          isPlayingRef.current = false
          audioElementRef.current?.pause()
        }
        return false
      }

      if (!file || file.size === 0) {
        return handleValidationError('Uploaded file is empty. Please select a valid audio file.')
      }

      const validTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/x-wav',
        'audio/m4a',
        'audio/x-m4a',
        'audio/ogg',
        'audio/flac',
        'audio/aac',
      ]
      const validExtensions = /\.(mp3|wav|m4a|ogg|flac|aac)$/i

      if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
        return handleValidationError('Unsupported format. Please upload an MP3, WAV, or M4A file.')
      }

      // 50MB file size limit check
      if (file.size > 50 * 1024 * 1024) {
        return handleValidationError('File exceeds 50MB. Please select a smaller study track.')
      }

      try {
        if (localFileUrlRef.current) {
          URL.revokeObjectURL(localFileUrlRef.current)
        }
        const newUrl = URL.createObjectURL(file)
        localFileUrlRef.current = newUrl
        setLocalFileUrl(newUrl)
        setLocalFileName(file.name.replace(/\.[^/.]+$/, ''))
        setSourceType('local')
        sourceTypeRef.current = 'local'
        setIsPlaying(true)
        isPlayingRef.current = true
        setIsFallbackActive(false)

        if (audioElementRef.current) {
          ambientPlayerRef.current?.stop()
          audioElementRef.current.src = newUrl
          audioElementRef.current.volume = volumeRef.current
          audioElementRef.current.play().catch(() => {
            setLocalFileError('Could not play this audio format on your device.')
            setIsPlaying(false)
            isPlayingRef.current = false
          })
        }
        return true
      } catch {
        setLocalFileError('Failed to read local audio file. Please try another file.')
        return false
      }
    },
    []
  )

  // Widget visibility toggles
  const openWidget = useCallback((tab: 'timer' | 'music' = 'timer') => {
    setWidgetTab(tab)
    setIsWidgetOpen(true)
  }, [])

  const closeWidget = useCallback(() => {
    setIsWidgetOpen(false)
  }, [])

  const toggleWidget = useCallback((tab?: 'timer' | 'music') => {
    setIsWidgetOpen((prev) => {
      if (!prev && tab) setWidgetTab(tab)
      return !prev
    })
  }, [])

  const openActionMenu = useCallback(() => {
    setIsActionMenuOpen(true)
  }, [])

  const closeActionMenu = useCallback(() => {
    setIsActionMenuOpen(false)
  }, [])

  const contextValue: FocusToolsContextValue = {
    mode,
    status,
    currentCycle,
    settings,
    toastNotification,
    dismissToast,
    startFocus,
    startBreak,
    pauseTimer,
    resumeTimer,
    toggleTimer,
    skipSession,
    resetTimer,
    updateSettings,
    sourceType,
    isPlaying,
    isFallbackActive,
    volume,
    currentCuratedTrack,
    youtubeUrl,
    youtubeVideoId,
    youtubeError,
    localFileName,
    localFileError,
    playMusic,
    pauseMusic,
    toggleMusic,
    setVolume,
    setLiveVolume,
    setSourceType: handleSetSourceType,
    selectCuratedTrack,
    nextTrack,
    prevTrack,
    setYouTubeUrl,
    setYouTubeError: handleSetYouTubeError,
    uploadLocalFile,
    clearYouTubeError,
    clearLocalFileError,
    registerYouTubeIframe,
    isWidgetOpen,
    widgetTab,
    openWidget,
    closeWidget,
    toggleWidget,
    isActionMenuOpen,
    openActionMenu,
    closeActionMenu,
  }

  return (
    <FocusToolsContext.Provider value={contextValue}>
      {children}
      {/* Persistent Root-Level YouTube Audio Player - keeps audio streaming across route navigation */}
      {youtubeVideoId && (
        <PersistentYouTubeAudioPlayer
          videoId={youtubeVideoId}
          onIframeReady={registerYouTubeIframe}
          onError={handleSetYouTubeError}
        />
      )}
    </FocusToolsContext.Provider>
  )
}

export function useFocusTools() {
  const ctx = useContext(FocusToolsContext)
  if (!ctx) {
    throw new Error('useFocusTools must be used within a FocusToolsProvider')
  }
  return ctx
}

/**
 * Isolated countdown hook for leaf components
 * ONLY subscribes to the 1-second ticks; does NOT trigger re-renders in parent components
 */
export function usePomodoroSeconds() {
  const remainingSeconds = useSyncExternalStore(
    (onStoreChange) => pomodoroTicker.subscribe(onStoreChange),
    () => pomodoroTicker.getRemainingSeconds(),
    () => 25 * 60
  )

  const progressRatio = useSyncExternalStore(
    (onStoreChange) => pomodoroTicker.subscribe(onStoreChange),
    () => pomodoroTicker.getProgress(),
    () => 0
  )

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return {
    remainingSeconds,
    progressRatio,
    formatted,
  }
}
