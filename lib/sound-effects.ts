// Zero-dependency Web Audio API sound synthesizer for tactile UI feedback
// Operates with 0ms latency, zero external asset downloads, and full browser support.

class SoundEffectsEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = false
  private listeners: Set<(muted: boolean) => void> = new Set()

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fetch_sound_muted') ?? localStorage.getItem('haribon_sound_muted')
        this.muted = saved === 'true'
      } catch {
        this.muted = false
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public isMuted(): boolean {
    return this.muted
  }

  public setMuted(muted: boolean) {
    this.muted = muted
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fetch_sound_muted', String(muted))
      } catch {}
    }
    this.listeners.forEach((fn) => fn(this.muted))
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  public subscribe(fn: (muted: boolean) => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  // 1. Tactile Card Flip / Navigation Click
  public playFlip() {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.07)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)

    gain.gain.setValueAtTime(0.09, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.07)
  }

  // 2. Rating Responses (Again, Hard, Good, Easy)
  public playRating(rating: 'again' | 'hard' | 'good' | 'easy') {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime

    if (rating === 'again') {
      // Dull low thud
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(now + 0.12)
    } else if (rating === 'hard') {
      // Neutral short blip
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(260, now)
      osc.frequency.setValueAtTime(310, now + 0.05)

      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(now + 0.14)
    } else if (rating === 'good') {
      // Pleasant resonant chime
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.035)

        gain.gain.setValueAtTime(0.08, now + i * 0.035)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.22)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.035)
        osc.stop(now + i * 0.035 + 0.22)
      })
    } else if (rating === 'easy') {
      // Sparkling harmonic major chime
      [587.33, 739.99, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.04)

        gain.gain.setValueAtTime(0.07, now + i * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.28)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.04)
        osc.stop(now + i * 0.04 + 0.28)
      })
    }
  }

  // 3. Quest or Goal Completed (Sparkle Pop)
  public playQuestComplete() {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.045)

      gain.gain.setValueAtTime(0.08, now + i * 0.045)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.2)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.045)
      osc.stop(now + i * 0.045 + 0.2)
    })
  }

  // 4. Flight / Deck Cleared Fanfare
  public playFanfare() {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const chord = [440, 554.37, 659.25, 880, 1108.73]
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.05)

      gain.gain.setValueAtTime(0.07, now + i * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.05)
      osc.stop(now + i * 0.05 + 0.45)
    })
  }

  // 5. Arena Timer Tick
  public playTick(isUrgent: boolean = false) {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now)

    gain.gain.setValueAtTime(isUrgent ? 0.07 : 0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(now + 0.04)
  }

  // 6. Pomodoro Focus Session Complete Chime (Harmonic Zen Chime)
  public playPomodoroChime() {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Warm, peaceful harmonic chord: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.08)

      gain.gain.setValueAtTime(0.09, now + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.08)
      osc.stop(now + i * 0.08 + 1.2)
    })
  }

  // 7. Break Complete Chime (Energizing Two-tone Chime)
  public playBreakChime() {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [587.33, 880] // D5, A5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.1)

      gain.gain.setValueAtTime(0.08, now + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.8)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.8)
    })
  }
}

export const sounds = new SoundEffectsEngine()
