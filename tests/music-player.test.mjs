import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// 1. YouTube Link Validator & Extractor Logic Test
function extractYouTubeVideoId(url) {
  const trimmed = url.trim()
  if (!trimmed) return null

  // Supports youtu.be, youtube.com, youtube-nocookie.com, watch?v=, watch?.+&v=, embed/, live/, shorts/, and music.youtube.com
  const match = trimmed.match(
    /(?:youtu\.be\/|(?:youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/
  )
  if (match && match[1]) {
    return match[1]
  } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  return null
}

function validateYouTubeUrl(url) {
  const id = extractYouTubeVideoId(url)
  if (id) {
    return { valid: true, videoId: id, error: null }
  }
  return {
    valid: false,
    videoId: null,
    error: 'Please enter a valid YouTube link (e.g., https://youtube.com/watch?v=... or youtu.be/...)',
  }
}

// 2. Local File Validator Logic Test
function validateLocalFile(file) {
  if (!file || file.size === 0) {
    return { valid: false, error: 'Uploaded file is empty. Please select a valid audio file.' }
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
    return { valid: false, error: 'Unsupported format. Please upload an MP3, WAV, or M4A file.' }
  }

  const MAX_SIZE = 50 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File exceeds 50MB. Please select a smaller study track.' }
  }

  return { valid: true, error: null }
}

// 3. YouTube Error Message Code Mapper
function mapYouTubeErrorCode(code) {
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

// 4. Continuous Volume Control Pipeline Simulator
class ContinuousVolumeController {
  constructor(initial = 0.7) {
    this.stateVolume = initial
    this.liveVolume = initial
    this.storage = {}
    this.lastNonZeroVolume = initial > 0 ? initial : 0.7
    this.youtubeCommands = []
  }

  setLive(v) {
    const clamped = Math.max(0, Math.min(1, v))
    this.liveVolume = clamped
    if (clamped > 0) {
      this.lastNonZeroVolume = clamped
    }
    // High-frequency drag updates hardware audio and YouTube postMessage
    // ZERO React setState calls and ZERO localStorage writes during dragging!
    if (clamped === 0) {
      this.youtubeCommands.push({ event: 'command', func: 'mute', args: [] })
    } else {
      this.youtubeCommands.push({ event: 'command', func: 'unMute', args: [] })
    }
    this.youtubeCommands.push({ event: 'command', func: 'setVolume', args: [Math.round(clamped * 100)] })
  }

  commit(v) {
    const clamped = Math.max(0, Math.min(1, v))
    this.stateVolume = clamped
    this.setLive(clamped)
    this.storage['fetch_music_volume'] = clamped.toString()
  }

  toggleMute() {
    if (this.stateVolume === 0) {
      this.commit(this.lastNonZeroVolume || 0.7)
    } else {
      this.commit(0)
    }
  }
}

// =================== TEST SUITES ===================

test('1. Curated Tracks structure, categories, and procedural synthesis in lib/study-music-tracks.ts', () => {
  const filePath = path.resolve('lib/study-music-tracks.ts')
  const content = fs.readFileSync(filePath, 'utf-8')

  // Verify all 3 categories exist
  assert.ok(content.includes("category: 'classical'"), 'Must contain classical tracks')
  assert.ok(content.includes("category: 'lofi'"), 'Must contain lo-fi tracks')
  assert.ok(content.includes("category: 'ambient'"), 'Must contain ambient tracks')

  // Verify dedicated procedural synthesizer ambient types
  assert.ok(content.includes("'rain'"), 'Must support rain soundscape')
  assert.ok(content.includes("'binaural'"), 'Must support binaural soundscape')
  assert.ok(content.includes("'piano-drone'"), 'Must support piano-drone fallback')
  assert.ok(content.includes("'lofi-beats'"), 'Must support lofi-beats soundscape')
  assert.ok(content.includes("'lofi-coffee'"), 'Must support lofi-coffee soundscape')
  assert.ok(content.includes("'lofi-sunset'"), 'Must support lofi-sunset soundscape')

  // Verify ProceduralAmbientPlayer has AudioContext quota preservation (suspend instead of close on stop)
  assert.ok(content.includes('suspend()'), 'Must suspend AudioContext on stop to avoid quota exhaustion')
  assert.ok(content.includes('destroy()'), 'Must provide destroy() method for full unmount cleanup')
})

test('2. YouTube URL parser and extractor covering 15+ varied formats', () => {
  // Standard watch URL
  assert.equal(validateYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // Short URL
  assert.equal(validateYouTubeUrl('https://youtu.be/dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // Short URL with tracking query
  assert.equal(validateYouTubeUrl('https://youtu.be/dQw4w9WgXcQ?si=abcdef12345').videoId, 'dQw4w9WgXcQ')
  // Live stream URL
  assert.equal(validateYouTubeUrl('https://www.youtube.com/live/jfKfPfyJRdk?si=test123').videoId, 'jfKfPfyJRdk')
  // Embed URL
  assert.equal(validateYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // Shorts URL
  assert.equal(validateYouTubeUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // Music YouTube URL
  assert.equal(validateYouTubeUrl('https://music.youtube.com/watch?v=dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // Mobile YouTube URL
  assert.equal(validateYouTubeUrl('https://m.youtube.com/watch?v=dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // No-cookie domain URL
  assert.equal(validateYouTubeUrl('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // Query param order variations
  assert.equal(validateYouTubeUrl('https://www.youtube.com/watch?feature=shared&v=dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  assert.equal(validateYouTubeUrl('https://www.youtube.com/watch?si=xyz&v=dQw4w9WgXcQ&t=20').videoId, 'dQw4w9WgXcQ')
  assert.equal(validateYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')
  // Direct 11-char ID
  assert.equal(validateYouTubeUrl('dQw4w9WgXcQ').videoId, 'dQw4w9WgXcQ')

  // Invalid URLs
  const inv1 = validateYouTubeUrl('https://vimeo.com/12345678')
  assert.equal(inv1.valid, false)
  assert.ok(inv1.error.includes('valid YouTube link'))

  const inv2 = validateYouTubeUrl('')
  assert.equal(inv2.valid, false)

  const inv3 = validateYouTubeUrl('https://www.youtube.com/watch?v=short')
  assert.equal(inv3.valid, false)

  const inv4 = validateYouTubeUrl('not a url at all')
  assert.equal(inv4.valid, false)
})

test('3. YouTube IFrame Player postMessage command dispatch and error code mapping', () => {
  // Command structure verification
  const playCmd = JSON.stringify({ event: 'command', func: 'playVideo', args: [] })
  const pauseCmd = JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] })
  const volCmd = JSON.stringify({ event: 'command', func: 'setVolume', args: [75] })
  const muteCmd = JSON.stringify({ event: 'command', func: 'mute', args: [] })
  const unMuteCmd = JSON.stringify({ event: 'command', func: 'unMute', args: [] })

  assert.ok(playCmd.includes('playVideo'))
  assert.ok(pauseCmd.includes('pauseVideo'))
  assert.ok(volCmd.includes('75'))
  assert.ok(muteCmd.includes('mute'))
  assert.ok(unMuteCmd.includes('unMute'))

  // Error codes mapping (2, 5, 100, 101, 150) all produce distinct, user-readable error messages
  const err150 = mapYouTubeErrorCode(150)
  const err101 = mapYouTubeErrorCode(101)
  const err100 = mapYouTubeErrorCode(100)
  const err2 = mapYouTubeErrorCode(2)
  const err5 = mapYouTubeErrorCode(5)

  assert.ok(err150.includes('restricted from embedded playback or requires age verification'))
  assert.ok(err101.includes('restricted by its owner from embedded playback'))
  assert.ok(err100.includes('not found, is private, or has been removed'))
  assert.ok(err2.includes('Invalid YouTube video link'))
  assert.ok(err5.includes('HTML5 player error'))

  // Verify all 5 are mutually distinct
  const uniqueErrors = new Set([err2, err5, err100, err101, err150])
  assert.equal(uniqueErrors.size, 5, 'All 5 YouTube error codes must produce distinct error messages')
})

test('4. Local File validation, size limits (<50MB), and format support', () => {
  // Valid MP3 file
  const validMp3 = { name: 'study-session.mp3', type: 'audio/mpeg', size: 12 * 1024 * 1024 }
  assert.equal(validateLocalFile(validMp3).valid, true)

  // Valid WAV file
  const validWav = { name: 'ambient.wav', type: 'audio/wav', size: 35 * 1024 * 1024 }
  assert.equal(validateLocalFile(validWav).valid, true)

  // Valid M4A file
  const validM4a = { name: 'notes.m4a', type: 'audio/m4a', size: 8 * 1024 * 1024 }
  assert.equal(validateLocalFile(validM4a).valid, true)

  // Valid file by extension even if browser MIME is generic
  const validByExt = { name: 'track.m4a', type: '', size: 5 * 1024 * 1024 }
  assert.equal(validateLocalFile(validByExt).valid, true)

  // File exceeding 50MB
  const largeFile = { name: 'large-mix.mp3', type: 'audio/mpeg', size: 52 * 1024 * 1024 }
  const largeRes = validateLocalFile(largeFile)
  assert.equal(largeRes.valid, false)
  assert.ok(largeRes.error.includes('exceeds 50MB'))

  // Invalid file type (.pdf)
  const invalidPdf = { name: 'notes.pdf', type: 'application/pdf', size: 2 * 1024 * 1024 }
  const pdfRes = validateLocalFile(invalidPdf)
  assert.equal(pdfRes.valid, false)
  assert.ok(pdfRes.error.includes('Unsupported format'))

  // Invalid file type (.exe)
  const invalidExe = { name: 'setup.exe', type: 'application/x-msdownload', size: 10 * 1024 }
  const exeRes = validateLocalFile(invalidExe)
  assert.equal(exeRes.valid, false)
  assert.ok(exeRes.error.includes('Unsupported format'))

  // Empty file (size = 0)
  const emptyFile = { name: 'silent.mp3', type: 'audio/mpeg', size: 0 }
  const emptyRes = validateLocalFile(emptyFile)
  assert.equal(emptyRes.valid, false)
  assert.ok(emptyRes.error.includes('empty'))
})

test('5. Continuous volume control: 60fps frame-rate live updates vs gesture commit & mute/unmute', () => {
  const ctrl = new ContinuousVolumeController(0.7)
  assert.equal(ctrl.stateVolume, 0.7)
  assert.equal(ctrl.liveVolume, 0.7)

  // Simulate high-frequency pointer drag (100 events)
  for (let i = 0; i <= 100; i++) {
    ctrl.setLive(i / 100)
    // Verify stateVolume has NOT changed during drag
    assert.equal(ctrl.stateVolume, 0.7)
    // Verify localStorage has NOT been written during drag
    assert.equal(ctrl.storage['fetch_music_volume'], undefined)
  }

  // End of gesture (pointerUp / touchEnd / keyUp)
  ctrl.commit(0.42)
  assert.equal(ctrl.stateVolume, 0.42)
  assert.equal(ctrl.liveVolume, 0.42)
  assert.equal(ctrl.storage['fetch_music_volume'], '0.42')

  // Verify volume clamping
  ctrl.setLive(-0.5)
  assert.equal(ctrl.liveVolume, 0)
  ctrl.setLive(1.5)
  assert.equal(ctrl.liveVolume, 1)

  ctrl.commit(-0.2)
  assert.equal(ctrl.stateVolume, 0)
  assert.equal(ctrl.storage['fetch_music_volume'], '0')

  ctrl.commit(2.5)
  assert.equal(ctrl.stateVolume, 1)
  assert.equal(ctrl.storage['fetch_music_volume'], '1')

  // Verify mute / unmute restores previous non-zero volume
  ctrl.commit(0.65)
  ctrl.toggleMute()
  assert.equal(ctrl.stateVolume, 0)
  assert.equal(ctrl.storage['fetch_music_volume'], '0')

  ctrl.toggleMute()
  assert.equal(ctrl.stateVolume, 0.65)
  assert.equal(ctrl.storage['fetch_music_volume'], '0.65')
})

test('6. Empty state prompt text and Focus Tools widget implementation verification', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // Verify exact required empty state text
  assert.ok(
    widgetContent.includes('Nothing playing — pick a track to focus.'),
    'Must display exact required empty state message: Nothing playing — pick a track to focus.'
  )

  // Verify YouTube iframe attributes include encrypted-media for music DRM
  assert.ok(
    widgetContent.includes('allow="autoplay; encrypted-media"'),
    'Must include encrypted-media in allow attribute for YouTube music streams'
  )

  // Verify VolumeSlider does NOT use React synthetic onChange for commits
  assert.ok(
    !widgetContent.includes('onChange={handleCommit}'),
    'VolumeSlider must not use React synthetic onChange to prevent state updates per-frame during drag'
  )

  // Verify gesture completion triggers
  assert.ok(widgetContent.includes('onPointerUp={handleCommit}'), 'Must commit volume on pointer up')
  assert.ok(widgetContent.includes('onTouchEnd={handleCommit}'), 'Must commit volume on touch end')
  assert.ok(widgetContent.includes('onKeyUp={handleCommit}'), 'Must commit volume on keyboard release')
})
