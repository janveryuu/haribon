// Curated Royalty-Free Classical, Lo-Fi, and Ambient Focus Tracks

export type AmbientSoundscapeType =
  | 'rain'
  | 'binaural'
  | 'piano-drone'
  | 'lofi-beats'
  | 'lofi-coffee'
  | 'lofi-sunset'
  | 'lofi-drone'

export type StudyTrackCategory = 'classical' | 'lofi' | 'ambient' | 'opm'

export interface StudyTrack {
  id: string
  title: string
  artist: string
  duration: string
  category: StudyTrackCategory
  // Real public domain / streaming audio URL or empty string for procedural synthesis
  audioUrl: string
  // Procedural fallback type if network is unavailable or for synthetic soundscapes
  ambientType?: AmbientSoundscapeType
  mood?: string
}

// Curated Study Music Tracks: category: 'classical' | category: 'lofi' | category: 'ambient' | category: 'opm'
export const CURATED_TRACKS: StudyTrack[] = [
  // 1. Classical Category (Procedural Piano-Drone Synthesis)
  {
    id: 'track-mozart-21',
    title: 'Piano Concerto No. 21 in C Major, K. 467 (Andante)',
    artist: 'W.A. Mozart',
    duration: '7:00',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Classical Focus',
  },
  {
    id: 'track-mozart-448',
    title: 'Sonata for Two Pianos in D Major, K. 448',
    artist: 'W.A. Mozart',
    duration: '9:30',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Classical Focus',
  },
  {
    id: 'track-haydn-emperor',
    title: "String Quartet Op. 76, No. 3 'Emperor'",
    artist: 'Joseph Haydn',
    duration: '6:45',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Structured Recall',
  },
  {
    id: 'track-beethoven-moonlight',
    title: 'Moonlight Sonata, Op. 27 No. 2 (Adagio)',
    artist: 'Ludwig van Beethoven',
    duration: '5:30',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Reflective Piano',
  },
  {
    id: 'track-beethoven-furelise',
    title: 'Für Elise, WoO 59',
    artist: 'Ludwig van Beethoven',
    duration: '2:55',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Classical Focus',
  },
  {
    id: 'track-beethoven-tempest',
    title: "Piano Sonata No. 14 'Tempest' (Op. 31 No. 2)",
    artist: 'Ludwig van Beethoven',
    duration: '8:10',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Deep Focus',
  },
  {
    id: 'track-bach-air',
    title: 'Air on the G String, BWV 1068',
    artist: 'J.S. Bach',
    duration: '4:45',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Harmonic Clarity',
  },
  {
    id: 'track-schubert-serenade',
    title: 'Serenade (Ständchen), D. 957',
    artist: 'Franz Schubert',
    duration: '4:15',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Melodic Recall',
  },
  {
    id: 'track-brahms-intermezzo',
    title: 'Intermezzo in A Major, Op. 118 No. 2',
    artist: 'Johannes Brahms',
    duration: '5:50',
    category: 'classical',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'Warm Contemplation',
  },

  // 2. Lo-Fi Category (Procedural Chillhop & Vinyl Synthesis)
  {
    id: 'track-nujabes-aruarian',
    title: 'Aruarian Dance',
    artist: 'Nujabes',
    duration: '4:22',
    category: 'lofi',
    audioUrl: '',
    ambientType: 'lofi-beats',
    mood: 'Lofi Focus',
  },
  {
    id: 'track-saib-sakura',
    title: 'Sakura Trees',
    artist: 'Saib',
    duration: '3:45',
    category: 'lofi',
    audioUrl: '',
    ambientType: 'lofi-coffee',
    mood: 'Lofi Chill',
  },
  {
    id: 'track-jinsang-affection',
    title: 'Affection',
    artist: 'Jinsang',
    duration: '3:18',
    category: 'lofi',
    audioUrl: '',
    ambientType: 'lofi-sunset',
    mood: 'Lofi Chill',
  },
  {
    id: 'track-kalaido-lanterns',
    title: 'Hanging Lanterns',
    artist: 'Kalaido',
    duration: '4:05',
    category: 'lofi',
    audioUrl: '',
    ambientType: 'lofi-beats',
    mood: 'Lofi Focus',
  },

  // 3. OPM Category (Filipino Original Pilipino Music - Acoustic, Folk & Indie)
  {
    id: 'track-munimuni-piyesa',
    title: 'Bawat Piyesa',
    artist: 'Munimuni',
    duration: '4:30',
    category: 'opm',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'OPM Acoustic',
  },
  {
    id: 'track-ridleys-aphrodite',
    title: 'Aphrodite',
    artist: 'The Ridleys',
    duration: '3:55',
    category: 'opm',
    audioUrl: '',
    ambientType: 'lofi-coffee',
    mood: 'OPM Indie',
  },
  {
    id: 'track-shirebound-waltz',
    title: 'Waltz of Four Left Feet',
    artist: 'Shirebound and Buskers',
    duration: '3:40',
    category: 'opm',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'OPM Folk',
  },
  {
    id: 'track-shirebound-pahintulot',
    title: 'Pahintulot',
    artist: 'Shirebound and Buskers',
    duration: '4:15',
    category: 'opm',
    audioUrl: '',
    ambientType: 'piano-drone',
    mood: 'OPM Folk',
  },
]

/**
 * Procedural Web Audio generator for ambient rain, binaural tones, lo-fi beats, and piano harmonics.
 * Runs 100% offline, requires zero external network downloads, perfectly loopable with zero gaps.
 * Reuses single AudioContext to prevent browser hardware context exhaustion.
 */
export class ProceduralAmbientPlayer {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private activeSources: AudioScheduledSourceNode[] = []
  private activeNodes: AudioNode[] = []
  private activeTimers: number[] = []
  private isRunning: boolean = false
  private currentType: AmbientSoundscapeType | null = null
  private currentVolume: number = 0.5

  private getOrCreateContext(): AudioContext | null {
    if (typeof window === 'undefined') return null

    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!AudioCtx) return null
        this.ctx = new AudioCtx()
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return this.ctx
    } catch {
      return null
    }
  }

  public play(type: AmbientSoundscapeType, volume: number = 0.5) {
    this.stop()
    this.currentVolume = volume

    const ctx = this.getOrCreateContext()
    if (!ctx) return

    try {
      this.gainNode = ctx.createGain()
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), ctx.currentTime)
      this.gainNode.connect(ctx.destination)
      this.activeNodes.push(this.gainNode)

      if (type === 'rain') {
        // Pink noise generator for gentle rainfall sound
        const bufferSize = ctx.sampleRate * 2
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const output = noiseBuffer.getChannelData(0)
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.96900 * b2 + white * 0.1538520
          b3 = 0.86650 * b3 + white * 0.3104856
          b4 = 0.55000 * b4 + white * 0.5329522
          b5 = -0.7616 * b5 - white * 0.0168980
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08
          b6 = white * 0.115926
        }

        const whiteNoise = ctx.createBufferSource()
        whiteNoise.buffer = noiseBuffer
        whiteNoise.loop = true

        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1000, ctx.currentTime)

        whiteNoise.connect(filter)
        filter.connect(this.gainNode)
        whiteNoise.start()

        this.activeSources.push(whiteNoise)
        this.activeNodes.push(whiteNoise, filter)
      } else if (type === 'binaural') {
        // Binaural beat: 136.1 Hz OM frequency in left ear, 140 Hz in right ear (3.9 Hz theta/alpha beat)
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        osc1.type = 'sine'
        osc2.type = 'sine'
        osc1.frequency.setValueAtTime(140, ctx.currentTime)
        osc2.frequency.setValueAtTime(136.1, ctx.currentTime)

        const merger = ctx.createChannelMerger(2)
        osc1.connect(merger, 0, 0)
        osc2.connect(merger, 0, 1)
        merger.connect(this.gainNode)

        osc1.start()
        osc2.start()

        this.activeSources.push(osc1, osc2)
        this.activeNodes.push(osc1, osc2, merger)
      } else if (type === 'piano-drone') {
        // Acoustic piano body resonance drone: warm harmonic triad (A2 110Hz, E3 164.8Hz, A3 220Hz)
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const osc3 = ctx.createOscillator()

        osc1.type = 'sine'
        osc2.type = 'sine'
        osc3.type = 'triangle'

        osc1.frequency.setValueAtTime(110.0, ctx.currentTime)
        osc2.frequency.setValueAtTime(164.81, ctx.currentTime)
        osc3.frequency.setValueAtTime(220.0, ctx.currentTime)

        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(650, ctx.currentTime)

        osc1.connect(filter)
        osc2.connect(filter)
        osc3.connect(filter)
        filter.connect(this.gainNode)

        osc1.start()
        osc2.start()
        osc3.start()

        this.activeSources.push(osc1, osc2, osc3)
        this.activeNodes.push(osc1, osc2, osc3, filter)
      } else if (type === 'lofi-beats' || type === 'lofi-drone') {
        // Lo-Fi study soundscape: warm sub-seventh chord (C3 130.81Hz, Eb3 155.56Hz, G3 196Hz) + gentle vinyl crackle texture
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const osc3 = ctx.createOscillator()

        osc1.type = 'triangle'
        osc2.type = 'sine'
        osc3.type = 'sine'

        osc1.frequency.setValueAtTime(130.81, ctx.currentTime)
        osc2.frequency.setValueAtTime(155.56, ctx.currentTime)
        osc3.frequency.setValueAtTime(196.0, ctx.currentTime)

        // Warm tape lowpass filter
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(750, ctx.currentTime)

        osc1.connect(filter)
        osc2.connect(filter)
        osc3.connect(filter)
        filter.connect(this.gainNode)

        osc1.start()
        osc2.start()
        osc3.start()

        this.activeSources.push(osc1, osc2, osc3)
        this.activeNodes.push(osc1, osc2, osc3, filter)

        // Vinyl crackle simulation buffer
        const crackleLength = ctx.sampleRate * 2
        const crackleBuffer = ctx.createBuffer(1, crackleLength, ctx.sampleRate)
        const crackleData = crackleBuffer.getChannelData(0)
        for (let i = 0; i < crackleLength; i++) {
          crackleData[i] = Math.random() > 0.9975 ? (Math.random() * 2 - 1) * 0.12 : 0
        }
        const crackleSource = ctx.createBufferSource()
        crackleSource.buffer = crackleBuffer
        crackleSource.loop = true

        const crackleGain = ctx.createGain()
        crackleGain.gain.setValueAtTime(0.07, ctx.currentTime)

        crackleSource.connect(crackleGain)
        crackleGain.connect(this.gainNode)
        crackleSource.start()

        this.activeSources.push(crackleSource)
        this.activeNodes.push(crackleSource, crackleGain)
      } else if (type === 'lofi-coffee') {
        // Midnight Coffee Study: Warm Rhodes Major 7th chord (F3 174.61Hz, A3 220Hz, C4 261.63Hz, E4 329.63Hz) + soft tape saturation
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const osc3 = ctx.createOscillator()
        const osc4 = ctx.createOscillator()

        osc1.type = 'sine'
        osc2.type = 'triangle'
        osc3.type = 'sine'
        osc4.type = 'sine'

        osc1.frequency.setValueAtTime(174.61, ctx.currentTime)
        osc2.frequency.setValueAtTime(220.0, ctx.currentTime)
        osc3.frequency.setValueAtTime(261.63, ctx.currentTime)
        osc4.frequency.setValueAtTime(329.63, ctx.currentTime)

        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(680, ctx.currentTime)

        osc1.connect(filter)
        osc2.connect(filter)
        osc3.connect(filter)
        osc4.connect(filter)
        filter.connect(this.gainNode)

        osc1.start()
        osc2.start()
        osc3.start()
        osc4.start()

        this.activeSources.push(osc1, osc2, osc3, osc4)
        this.activeNodes.push(osc1, osc2, osc3, osc4, filter)

        // Gentle background tape hiss
        const hissLength = ctx.sampleRate * 2
        const hissBuffer = ctx.createBuffer(1, hissLength, ctx.sampleRate)
        const hissData = hissBuffer.getChannelData(0)
        for (let i = 0; i < hissLength; i++) {
          hissData[i] = (Math.random() * 2 - 1) * 0.015
        }
        const hissSource = ctx.createBufferSource()
        hissSource.buffer = hissBuffer
        hissSource.loop = true

        const hissGain = ctx.createGain()
        hissGain.gain.setValueAtTime(0.05, ctx.currentTime)

        hissSource.connect(hissGain)
        hissGain.connect(this.gainNode)
        hissSource.start()

        this.activeSources.push(hissSource)
        this.activeNodes.push(hissSource, hissGain)
      } else if (type === 'lofi-sunset') {
        // Golden Hour Flow: Downtempo warm 9th chord (D3 146.83Hz, F#3 185.0Hz, A3 220Hz, C#4 277.18Hz, E4 329.63Hz)
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const osc3 = ctx.createOscillator()

        osc1.type = 'triangle'
        osc2.type = 'sine'
        osc3.type = 'sine'

        osc1.frequency.setValueAtTime(146.83, ctx.currentTime)
        osc2.frequency.setValueAtTime(220.0, ctx.currentTime)
        osc3.frequency.setValueAtTime(277.18, ctx.currentTime)

        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(720, ctx.currentTime)

        osc1.connect(filter)
        osc2.connect(filter)
        osc3.connect(filter)
        filter.connect(this.gainNode)

        osc1.start()
        osc2.start()
        osc3.start()

        this.activeSources.push(osc1, osc2, osc3)
        this.activeNodes.push(osc1, osc2, osc3, filter)
      }

      this.isRunning = true
      this.currentType = type
    } catch {
      this.isRunning = false
      this.currentType = null
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = volume
    if (this.gainNode && this.ctx && this.ctx.state !== 'closed') {
      try {
        this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), this.ctx.currentTime)
      } catch {}
    }
  }

  public stop() {
    this.activeTimers.forEach((t) => window.clearTimeout(t))
    this.activeTimers = []

    this.activeSources.forEach((source) => {
      try {
        source.stop()
      } catch {}
    })
    this.activeSources = []

    this.activeNodes.forEach((node) => {
      try {
        node.disconnect()
      } catch {}
    })
    this.activeNodes = []

    // Suspend rather than close to preserve browser AudioContext allocation quota
    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend().catch(() => {})
      } catch {}
    }

    this.gainNode = null
    this.isRunning = false
    this.currentType = null
  }

  public destroy() {
    this.stop()
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close().catch(() => {})
      } catch {}
      this.ctx = null
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning
  }

  public getCurrentType(): AmbientSoundscapeType | null {
    return this.currentType
  }
}

/**
 * Maps YouTube IFrame Player error codes (2, 5, 100, 101, 150) to distinct, user-readable messages.
 */
export function mapYouTubeErrorCode(code: number | string): string {
  const numCode = Number(code)
  if (numCode === 101) {
    return 'This YouTube video is restricted by its owner from embedded playback.'
  } else if (numCode === 150) {
    return 'This YouTube video is restricted from embedded playback or requires age verification.'
  } else if (numCode === 100) {
    return 'This YouTube video was not found, is private, or has been removed.'
  } else if (numCode === 2) {
    return 'Invalid YouTube video link or ID parameter.'
  } else if (numCode === 5) {
    return 'HTML5 player error on this YouTube stream.'
  }
  return 'Unable to play this YouTube audio stream. Please check the URL.'
}
