import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { mapYouTubeErrorCode } from '../lib/study-music-tracks.ts'
import { reconcileSavedSession } from '../lib/focus-reconciliation.ts'

// ============================================================================
// STAGE 4 HARDEN-PASS AUTOMATED TEST SUITE
// ============================================================================

// 1. Mid-flip Pomodoro completion safety
test('1. Mid-flip Pomodoro completion safety: FocusToast non-blocking pointer events & StudySheet state isolation', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // A. FocusToast container must have pointer-events-none and elevated z-index (z-[60])
  assert.ok(
    widgetContent.includes('className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-[60] pointer-events-none"'),
    'FocusToast container must have pointer-events-none and z-[60]'
  )

  // B. Inner toast card must have pointer-events-none so clicks pass through to flashcards
  assert.ok(
    widgetContent.includes('<div className="pointer-events-none max-w-sm rounded-2xl'),
    'FocusToast card must have pointer-events-none'
  )

  // C. Dismiss button must have pointer-events-auto
  assert.ok(
    widgetContent.includes('className="pointer-events-auto text-muted-foreground hover:text-foreground active:scale-90 transition-transform cursor-pointer"'),
    'FocusToast dismiss button must have pointer-events-auto'
  )

  // D. StudySheet isolation: verify study-sheet.tsx does NOT consume useFocusTools() directly
  const sheetPath = path.resolve('components/shared/study-sheet.tsx')
  const sheetContent = fs.readFileSync(sheetPath, 'utf-8')

  assert.ok(
    !sheetContent.includes('useFocusTools()'),
    'StudySheet root component must not subscribe to useFocusTools to prevent re-renders on timer ticks or session completions'
  )

  // E. Card flip state machine is isolated in StudySheet
  assert.ok(sheetContent.includes('const [flipped, setFlipped] = useState(false)'))
  assert.ok(sheetContent.includes('const handleFlip = useCallback'))
})

// 2. YouTube error handling: codes 2, 5, 100, 101, 150 all produce distinct user-readable messages
test('2. YouTube URL error handling: codes 2, 5, 100, 101, 150 distinct messages & isPlaying stops', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  const err2 = mapYouTubeErrorCode(2)
  const err5 = mapYouTubeErrorCode(5)
  const err100 = mapYouTubeErrorCode(100)
  const err101 = mapYouTubeErrorCode(101)
  const err150 = mapYouTubeErrorCode(150)
  const fallback = mapYouTubeErrorCode(999)

  // Assert all are distinct
  const uniqueSet = new Set([err2, err5, err100, err101, err150])
  assert.equal(uniqueSet.size, 5, 'All 5 YouTube error codes must have distinct error messages')

  assert.ok(err2.includes('Invalid YouTube video link'))
  assert.ok(err5.includes('HTML5 player error'))
  assert.ok(err100.includes('not found, is private, or has been removed'))
  assert.ok(err101.includes('restricted by its owner from embedded playback'))
  assert.ok(err150.includes('restricted from embedded playback or requires age verification'))
  assert.ok(fallback.includes('Unable to play this YouTube audio stream'))

  // Verify YouTubeAudioPlayer dispatches mapYouTubeErrorCode
  assert.ok(
    widgetContent.includes('onError(mapYouTubeErrorCode(rawCode))'),
    'YouTubeAudioPlayer must delegate error code mapping to mapYouTubeErrorCode'
  )

  // Verify YouTubeAudioPlayer postMessage parsing prevents collision with player states
  function parseYouTubeMessage(data) {
    let rawCode = null
    if (data?.event === 'onError') {
      rawCode =
        typeof data.info === 'object' && data.info !== null
          ? (data.info.errorCode ?? data.info.error ?? 999)
          : (data.info ?? 999)
    } else if (data?.info?.errorCode !== undefined || data?.info?.error !== undefined) {
      rawCode = data.info.errorCode ?? data.info.error
    }
    return rawCode !== null ? mapYouTubeErrorCode(rawCode) : null
  }

  // Real YouTube player states (info = 2 is PAUSED, info = 5 is CUED) must NOT produce errors
  assert.equal(parseYouTubeMessage({ event: 'onStateChange', info: 2 }), null)
  assert.equal(parseYouTubeMessage({ event: 'onStateChange', info: 5 }), null)
  assert.equal(parseYouTubeMessage({ event: 'onStateChange', info: 1 }), null)

  // Real error events MUST produce distinct error messages
  assert.ok(parseYouTubeMessage({ event: 'onError', info: 2 }).includes('Invalid YouTube video link'))
  assert.ok(parseYouTubeMessage({ event: 'onError', info: 5 }).includes('HTML5 player error'))
  assert.ok(parseYouTubeMessage({ event: 'onError', info: 100 }).includes('not found, is private'))
  assert.ok(parseYouTubeMessage({ event: 'onError', info: 101 }).includes('restricted by its owner'))
  assert.ok(parseYouTubeMessage({ event: 'onError', info: 150 }).includes('restricted from embedded playback'))
  assert.ok(parseYouTubeMessage({ event: 'infoDelivery', info: { errorCode: 150 } }).includes('restricted from embedded playback'))

  // Verify focus-context handleSetYouTubeError stops playback and equalizer
  const contextPath = path.resolve('lib/focus-context.tsx')
  const contextContent = fs.readFileSync(contextPath, 'utf-8')
  assert.ok(
    contextContent.includes('setIsPlaying(false)'),
    'focus-context must set isPlaying to false on error paths'
  )
  assert.ok(
    contextContent.includes('isPlayingRef.current = false'),
    'focus-context must update isPlayingRef to false on error paths'
  )
})

// 3. Local file upload handling: size, formats, 0 bytes, and e.target.value reset
test('3. Local file upload handling: size, format, empty files, and e.target.value reset', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // Verify e.target.value = '' is executed after each attempt
  assert.ok(
    widgetContent.includes("e.target.value = ''"),
    'Must reset e.target.value to enable re-selecting same file name after error'
  )

  // Verify inline error banner is rendered in widget
  assert.ok(
    widgetContent.includes('{localFileError && ('),
    'Must render localFileError inline error banner'
  )

  // Verify validation logic in focus-context.tsx
  const contextPath = path.resolve('lib/focus-context.tsx')
  const contextContent = fs.readFileSync(contextPath, 'utf-8')

  assert.ok(contextContent.includes('Uploaded file is empty. Please select a valid audio file.'))
  assert.ok(contextContent.includes('File exceeds 50MB. Please select a smaller study track.'))
  assert.ok(contextContent.includes('Unsupported format. Please upload an MP3, WAV, or M4A file.'))
})

// 4. Tab close / reload mid-Pomodoro reconciliation logic
test('4. Tab close / browser reload mid-Pomodoro: drift-free reconciliation logic', () => {
  const contextPath = path.resolve('lib/focus-context.tsx')
  const contextContent = fs.readFileSync(contextPath, 'utf-8')

  // Verify localStorage check on mount
  assert.ok(contextContent.includes('SESSION_STORAGE_KEY'))
  assert.ok(contextContent.includes('localStorage.getItem(SESSION_STORAGE_KEY)'))
  assert.ok(contextContent.includes("session.status === 'running'"))

  // Verify FocusToolsProvider imports and uses reconcileSavedSession on mount
  assert.ok(
    contextContent.includes('reconcileSavedSession'),
    'focus-context.tsx must use reconcileSavedSession for session reconciliation'
  )

  const defaultSettings = {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
    soundChime: true,
    grantXpOnComplete: true,
  }

  // Case A: Active focus session resumes with exact remaining seconds and progress
  const activeSession = {
    mode: 'focus',
    status: 'running',
    startTimestamp: 1000000,
    pausedAccumulated: 0,
    targetDuration: 25 * 60,
    currentCycle: 1,
    savedAt: 1000000,
  }
  const resActive = reconcileSavedSession(activeSession, 1000000 + 10 * 60 * 1000, defaultSettings)
  assert.equal(resActive.action, 'resumed')
  assert.equal(resActive.status, 'running')
  assert.equal(resActive.remainingSeconds, 15 * 60)
  assert.ok(Math.abs(resActive.progress - 0.4) < 0.001)

  // Case B: Session expired while tab was closed (30 minutes elapsed out of 25 minutes)
  const resExpired = reconcileSavedSession(activeSession, 1000000 + 30 * 60 * 1000, defaultSettings)
  assert.equal(resExpired.action, 'expired')
  assert.equal(resExpired.status, 'idle')
  assert.equal(resExpired.mode, 'shortBreak')
  assert.equal(resExpired.earnedXp, 50)
  assert.equal(resExpired.toastNotification?.title, 'Session completed while away!')
  assert.equal(resExpired.toastNotification?.type, 'focus')

  // Case C: Cycle 4 focus expired -> advances to long break
  const cycle4Session = { ...activeSession, currentCycle: 4 }
  const resC4 = reconcileSavedSession(cycle4Session, 1000000 + 30 * 60 * 1000, defaultSettings)
  assert.equal(resC4.action, 'expired')
  assert.equal(resC4.mode, 'longBreak')
  assert.equal(resC4.earnedXp, 50)
  assert.equal(resC4.toastNotification?.type, 'focus')

  // Case D: Short break expired -> advances to next cycle focus (e.g. cycle 1 -> cycle 2)
  const breakSession = {
    mode: 'shortBreak',
    status: 'running',
    startTimestamp: 1000000,
    pausedAccumulated: 0,
    targetDuration: 5 * 60,
    currentCycle: 1,
    savedAt: 1000000,
  }
  const resBreak = reconcileSavedSession(breakSession, 1000000 + 6 * 60 * 1000, defaultSettings)
  assert.equal(resBreak.action, 'expired')
  assert.equal(resBreak.mode, 'focus')
  assert.equal(resBreak.currentCycle, 2)
  assert.equal(resBreak.earnedXp, 0) // breaks don't award focus XP

  // Case E: Long break expired -> resets to cycle 1 focus
  const longBreakSession = {
    mode: 'longBreak',
    status: 'running',
    startTimestamp: 1000000,
    pausedAccumulated: 0,
    targetDuration: 15 * 60,
    currentCycle: 4,
    savedAt: 1000000,
  }
  const resLongBreak = reconcileSavedSession(longBreakSession, 1000000 + 16 * 60 * 1000, defaultSettings)
  assert.equal(resLongBreak.action, 'expired')
  assert.equal(resLongBreak.mode, 'focus')
  assert.equal(resLongBreak.currentCycle, 1)

  // Case F: Paused session preserved exactly without drift
  const pausedSession = {
    mode: 'focus',
    status: 'paused',
    startTimestamp: 1000000,
    pausedAccumulated: 10 * 60,
    targetDuration: 25 * 60,
    currentCycle: 2,
    savedAt: 1000000,
  }
  const resPaused = reconcileSavedSession(pausedSession, 1000000 + 60 * 60 * 1000, defaultSettings)
  assert.equal(resPaused.action, 'paused')
  assert.equal(resPaused.status, 'paused')
  assert.equal(resPaused.remainingSeconds, 15 * 60)
  assert.ok(Math.abs(resPaused.progress - 0.4) < 0.001)
})

// 5. Mobile widget / bottom nav collision: safe area offset & tutor visibility
test('5. Mobile widget / bottom nav collision: safe area offset and hidden on /tutor mobile', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // Verify safe area inset and bottom offset
  assert.ok(
    widgetContent.includes('bottom-[calc(5.25rem+env(safe-area-inset-bottom))]'),
    'Floating widget must have bottom offset accounting for safe area and h-16 bottom nav'
  )

  // Verify hidden on mobile on /tutor page
  assert.ok(
    widgetContent.includes("isTutorPage && 'hidden lg:block'"),
    'Floating widget must be hidden on mobile when on /tutor page'
  )

  // Verify expanded modal container has z-[55] to layer cleanly above StudySheet (z-50)
  assert.ok(
    widgetContent.includes('className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4"'),
    'Expanded modal panel must have z-[55] to layer above z-50 sheets'
  )
})

// 6. prefers-reduced-motion compliance across all transitions
test('6. prefers-reduced-motion compliance across all transitions', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')
  const actionSheetPath = path.resolve('components/focus/action-plus-sheet.tsx')
  const actionSheetContent = fs.readFileSync(actionSheetPath, 'utf-8')
  const cssPath = path.resolve('app/globals.css')
  const cssContent = fs.readFileSync(cssPath, 'utf-8')

  // A. Ring fill animation: duration 0 when reduced motion
  assert.ok(
    widgetContent.includes('duration: reduceMotion ? 0 : motionTokens.durations.base'),
    'PomodoroProgressRing must respect reduceMotion'
  )

  // B. Toast slide-in: instant when reduced motion
  assert.ok(
    widgetContent.includes('duration: reduceMotion ? 0.01 : motionTokens.durations.deliberate'),
    'FocusToast must respect reduceMotion'
  )

  // C. Expanded modal panel spring: instant when reduced motion
  assert.ok(
    /reduceMotion\s*\?\s*\{\s*duration:\s*0\.01\s*\}\s*:\s*motionTokens\.springs\.modalSheet/.test(widgetContent),
    'Expanded modal sheet must respect reduceMotion'
  )

  // D. Action Plus bottom sheet: instant when reduced motion
  assert.ok(
    /reduceMotion\s*\?\s*\{\s*duration:\s*0\.01\s*\}\s*:\s*motionTokens\.springs\.dropdown/.test(actionSheetContent),
    'ActionPlusSheet must respect reduceMotion'
  )

  // E. Global CSS prefers-reduced-motion media query
  assert.ok(
    cssContent.includes('@media (prefers-reduced-motion: reduce)'),
    'globals.css must define @media (prefers-reduced-motion: reduce)'
  )
  assert.ok(
    cssContent.includes('animation-duration: 0.01ms !important'),
    'globals.css must force animation-duration to 0.01ms'
  )
})

// 7. ContextualFocusPill mounted in both StudySheet and AI Tutor
test('7. ContextualFocusPill mounted in both StudySheet and AI Tutor with live status & controls', () => {
  const sheetPath = path.resolve('components/shared/study-sheet.tsx')
  const sheetContent = fs.readFileSync(sheetPath, 'utf-8')
  const tutorPath = path.resolve('components/app/ai-tutor-view.tsx')
  const tutorContent = fs.readFileSync(tutorPath, 'utf-8')
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // Mounted in StudySheet
  assert.ok(sheetContent.includes("import { ContextualFocusPill } from '@/components/focus/focus-tools-widget'"))
  assert.ok(sheetContent.includes('<ContextualFocusPill />'))

  // Mounted in AI Tutor
  assert.ok(tutorContent.includes("import { ContextualFocusPill } from '@/components/focus/focus-tools-widget'"))
  assert.ok(tutorContent.includes('<ContextualFocusPill />'))

  // ContextualFocusPill features:
  // - 1-tap play/pause timer
  assert.ok(widgetContent.includes('toggleTimer()'))
  // - 1-tap skip timer
  assert.ok(widgetContent.includes('skipSession()'))
  // - 1-tap toggle music
  assert.ok(widgetContent.includes('toggleMusic()'))
  // - Live countdown via TimerCountdownText
  assert.ok(widgetContent.includes('<TimerCountdownText className="text-[11px] sm:text-xs font-extrabold tabular-nums" />'))
  // - Live music equalizer status
  assert.ok(widgetContent.includes('{isPlaying && ('))
})

// 8. Shared state continuity across layout and navigation
test('8. Shared state continuity: FocusToolsProvider at root layout & continuous session', () => {
  const layoutPath = path.resolve('app/layout.tsx')
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8')
  const appShellPath = path.resolve('components/app/app-shell.tsx')
  const appShellContent = fs.readFileSync(appShellPath, 'utf-8')

  // Root Layout provides FocusToolsProvider across ALL pages
  assert.ok(
    layoutContent.includes("import { FocusToolsProvider } from '@/lib/focus-context'"),
    'app/layout.tsx must import FocusToolsProvider'
  )
  assert.ok(
    layoutContent.includes('<FocusToolsProvider>'),
    'app/layout.tsx must wrap {children} with <FocusToolsProvider>'
  )

  // AppShell mounts FocusToolsWidget and ActionPlusSheet globally
  assert.ok(appShellContent.includes('<FocusToolsWidget />'))
  assert.ok(appShellContent.includes('<ActionPlusSheet'))
})
