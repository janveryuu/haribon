// Pure Pomodoro session reconciliation logic for tab reload, background tab, and away-time handling

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak'
export type PomodoroStatus = 'idle' | 'running' | 'paused'

export interface PomodoroSettings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  cyclesBeforeLongBreak: number
  soundChime: boolean
  grantXpOnComplete: boolean
}

export interface SavedPomodoroSession {
  mode: PomodoroMode
  status: PomodoroStatus
  startTimestamp: number
  pausedAccumulated: number
  targetDuration: number
  currentCycle: number
  savedAt: number
}

export interface ReconcileResult {
  action: 'resumed' | 'expired' | 'paused'
  mode: PomodoroMode
  currentCycle: number
  status: PomodoroStatus
  remainingSeconds: number
  progress: number
  targetDuration: number
  earnedXp: number
  toastNotification?: {
    id: string
    title: string
    desc: string
    mascotPose: 'celebrate' | 'ball'
    type: 'focus' | 'break'
  }
}

/**
 * Pure session reconciliation logic for tab close, reload, and away-time handling.
 * Eliminates drift and properly transitions cycles and awards XP.
 */
export function reconcileSavedSession(
  session: SavedPomodoroSession,
  now: number,
  settings: PomodoroSettings
): ReconcileResult {
  if (session.status === 'paused') {
    const remaining = Math.max(0, session.targetDuration - session.pausedAccumulated)
    const progress = Math.min(1, Math.max(0, session.pausedAccumulated / session.targetDuration))
    return {
      action: 'paused',
      mode: session.mode,
      currentCycle: session.currentCycle,
      status: 'paused',
      remainingSeconds: Math.round(remaining),
      progress,
      targetDuration: session.targetDuration,
      earnedXp: 0,
    }
  }

  const elapsed = session.pausedAccumulated + (now - session.startTimestamp) / 1000
  if (elapsed >= session.targetDuration) {
    const wasFocus = session.mode === 'focus'
    const isLong = wasFocus && session.currentCycle >= settings.cyclesBeforeLongBreak
    const nextMode: PomodoroMode = wasFocus
      ? (isLong ? 'longBreak' : 'shortBreak')
      : 'focus'
    const nextCycle = wasFocus
      ? session.currentCycle
      : (session.mode === 'longBreak' ? 1 : Math.min(settings.cyclesBeforeLongBreak, session.currentCycle + 1))
    const earnedXp = wasFocus && settings.grantXpOnComplete ? 50 : 0
    const targetDuration = wasFocus
      ? (isLong ? settings.longBreakMinutes * 60 : settings.shortBreakMinutes * 60)
      : settings.focusMinutes * 60

    return {
      action: 'expired',
      mode: nextMode,
      currentCycle: nextCycle,
      status: 'idle',
      remainingSeconds: targetDuration,
      progress: 0,
      targetDuration,
      earnedXp,
      toastNotification: {
        id: `toast-${now}`,
        title: 'Session completed while away!',
        desc: wasFocus
          ? `Your ${Math.round(session.targetDuration / 60)}-minute focus session finished while you were away. +${earnedXp} XP credited!`
          : 'Your break finished while you were away. Ready for your next focus session?',
        mascotPose: 'celebrate',
        type: wasFocus ? 'focus' : 'break',
      },
    }
  } else {
    const remaining = Math.max(0, session.targetDuration - elapsed)
    const progress = Math.min(1, Math.max(0, elapsed / session.targetDuration))
    return {
      action: 'resumed',
      mode: session.mode,
      currentCycle: session.currentCycle,
      status: 'running',
      remainingSeconds: Math.round(remaining),
      progress,
      targetDuration: session.targetDuration,
      earnedXp: 0,
    }
  }
}
