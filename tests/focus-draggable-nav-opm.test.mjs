import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { CURATED_TRACKS } from '../lib/study-music-tracks.ts'

// ============================================================================
// FOCUS TOOLS ENHANCEMENTS TEST SUITE: DRAGGABLE PILL, YOUTUBE PERSISTENCE, & OPM
// ============================================================================

test('Issue 1: Draggable Floating Pill Widget with Framer Motion, constraints & localStorage', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // A. Uses Framer Motion's drag prop, dragElastic={0}, and dragMomentum={false}
  assert.ok(widgetContent.includes('drag\n'), 'Floating pill must have drag prop')
  assert.ok(widgetContent.includes('dragElastic={0}'), 'Floating pill must have dragElastic={0}')
  assert.ok(widgetContent.includes('dragMomentum={false}'), 'Floating pill must have dragMomentum={false}')
  assert.ok(widgetContent.includes('dragConstraints={dragConstraints}'), 'Floating pill must have dragConstraints')

  // B. Drag constraints reference window dimensions
  assert.ok(widgetContent.includes('window.innerWidth'), 'Constraints must reference window.innerWidth')
  assert.ok(widgetContent.includes('window.innerHeight'), 'Constraints must reference window.innerHeight')

  // C. Persists position to localStorage
  assert.ok(
    widgetContent.includes("localStorage.setItem('fetch_focus_widget_pos'"),
    'Must persist dragged position to localStorage under fetch_focus_widget_pos'
  )
  assert.ok(
    widgetContent.includes("localStorage.getItem('fetch_focus_widget_pos'"),
    'Must restore dragged position from localStorage'
  )

  // D. Mobile bottom navigation safety and safe area
  assert.ok(
    widgetContent.includes('bottom-[calc(5.25rem+env(safe-area-inset-bottom))]'),
    'Must respect safe-area-inset-bottom and bottom offset'
  )
  assert.ok(
    widgetContent.includes('maxBottom = isMobile ? 0'),
    'On mobile, bottom drag constraint must prevent overlapping bottom nav bar'
  )

  // E. Distinguish drag gesture (> 5px threshold) vs tap
  assert.ok(
    widgetContent.includes('dist > 5'),
    'Must distinguish drag gesture vs tap using movement threshold'
  )
  assert.ok(
    widgetContent.includes('isDraggingRef.current'),
    'Must guard tap/click handlers using isDraggingRef'
  )

  // F. Re-verify constraints and clamp whenever the floating pill mounts or modal closes
  assert.ok(
    widgetContent.includes('!isWidgetOpen'),
    'Must refresh drag constraints when floating pill re-appears after closing modal'
  )
})

test('Issue 2: Root-level Persistent YouTube Player across route navigations', () => {
  const contextPath = path.resolve('lib/focus-context.tsx')
  const contextContent = fs.readFileSync(contextPath, 'utf-8')
  const layoutPath = path.resolve('app/layout.tsx')
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8')
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // A. FocusToolsProvider is mounted at Root Layout (app/layout.tsx), never unmounting on route changes
  assert.ok(layoutContent.includes('<FocusToolsProvider>'), 'Root layout mounts FocusToolsProvider')

  // B. PersistentYouTubeAudioPlayer is rendered inside FocusToolsProvider at root layout level
  assert.ok(
    contextContent.includes('PersistentYouTubeAudioPlayer'),
    'PersistentYouTubeAudioPlayer must be defined in focus-context.tsx'
  )
  assert.ok(
    contextContent.includes('<PersistentYouTubeAudioPlayer'),
    'FocusToolsProvider must render PersistentYouTubeAudioPlayer at root layout level'
  )
  assert.ok(
    contextContent.includes('{youtubeVideoId && ('),
    'YouTube player must stay mounted as long as youtubeVideoId is set'
  )

  // C. HTML5 audio element for curated playlist tracks also persists in FocusToolsProvider
  assert.ok(
    contextContent.includes('audioElementRef.current = audio'),
    'HTML5 Audio element persists in FocusToolsProvider'
  )

  // D. Duplicate YouTube player was removed from FocusToolsWidget to prevent double-playback
  assert.ok(
    !widgetContent.includes("<YouTubeAudioPlayer\n          videoId={youtubeVideoId}"),
    'FocusToolsWidget must not mount duplicate YouTube player'
  )
})

test('Issue 3: Curated Playlist replacement with Classical, Lo-Fi, and new OPM category', () => {
  const widgetPath = path.resolve('components/focus/focus-tools-widget.tsx')
  const widgetContent = fs.readFileSync(widgetPath, 'utf-8')

  // A. Total tracks count is 17
  assert.equal(CURATED_TRACKS.length, 17, 'Must have exactly 17 curated tracks')

  // B. Categories breakdown: 9 Classical, 4 Lo-Fi, 4 OPM
  const classicalTracks = CURATED_TRACKS.filter((t) => t.category === 'classical')
  const lofiTracks = CURATED_TRACKS.filter((t) => t.category === 'lofi')
  const opmTracks = CURATED_TRACKS.filter((t) => t.category === 'opm')

  assert.equal(classicalTracks.length, 9, 'Must have 9 classical tracks')
  assert.equal(lofiTracks.length, 4, 'Must have 4 lo-fi tracks')
  assert.equal(opmTracks.length, 4, 'Must have 4 OPM tracks')

  // C. Verify required classical pieces with exact artist and mood
  const mozart21 = classicalTracks.find((t) => t.id === 'track-mozart-21')
  assert.ok(mozart21)
  assert.equal(mozart21.artist, 'W.A. Mozart', 'Artist must be exact artist name')
  assert.equal(mozart21.mood, 'Classical Focus', 'Mood must be separate field')
  assert.equal(mozart21.ambientType, 'piano-drone')

  assert.ok(classicalTracks.some((t) => t.title.includes('Piano Concerto No. 21') && t.artist.includes('Mozart')))
  assert.ok(classicalTracks.some((t) => t.title.includes('Sonata for Two Pianos') && t.artist.includes('Mozart')))
  assert.ok(classicalTracks.some((t) => t.title.includes('Emperor') && t.artist.includes('Haydn')))
  assert.ok(classicalTracks.some((t) => t.title.includes('Moonlight Sonata') && t.artist.includes('Beethoven')))
  assert.ok(classicalTracks.some((t) => t.title.includes('Für Elise') && t.artist.includes('Beethoven')))
  assert.ok(classicalTracks.some((t) => t.title.includes('Tempest') && t.artist.includes('Beethoven')))
  assert.ok(classicalTracks.some((t) => t.title.includes('Air on the G String') && t.artist.includes('Bach')))

  // D. Verify required lo-fi pieces
  const nujabes = lofiTracks.find((t) => t.id === 'track-nujabes-aruarian')
  assert.ok(nujabes)
  assert.equal(nujabes.artist, 'Nujabes')
  assert.equal(nujabes.mood, 'Lofi Focus')
  assert.equal(nujabes.ambientType, 'lofi-beats')

  assert.ok(lofiTracks.some((t) => t.title.includes('Aruarian Dance') && t.artist.includes('Nujabes')))
  assert.ok(lofiTracks.some((t) => t.title.includes('Sakura Trees') && t.artist.includes('Saib')))
  assert.ok(lofiTracks.some((t) => t.title.includes('Affection') && t.artist.includes('Jinsang')))
  assert.ok(lofiTracks.some((t) => t.title.includes('Hanging Lanterns') && t.artist.includes('Kalaido')))

  // E. Verify required OPM pieces
  const munimuni = opmTracks.find((t) => t.id === 'track-munimuni-piyesa')
  assert.ok(munimuni)
  assert.equal(munimuni.artist, 'Munimuni')
  assert.equal(munimuni.mood, 'OPM Acoustic')
  assert.equal(munimuni.ambientType, 'piano-drone')

  const ridleys = opmTracks.find((t) => t.id === 'track-ridleys-aphrodite')
  assert.ok(ridleys)
  assert.equal(ridleys.artist, 'The Ridleys')
  assert.equal(ridleys.ambientType, 'lofi-coffee')

  assert.ok(opmTracks.some((t) => t.title.includes('Bawat Piyesa') && t.artist.includes('Munimuni')))
  assert.ok(opmTracks.some((t) => t.title.includes('Aphrodite') && t.artist.includes('Ridleys')))
  assert.ok(opmTracks.some((t) => t.title.includes('Waltz of Four Left Feet') && t.artist.includes('Shirebound')))
  assert.ok(opmTracks.some((t) => t.title.includes('Pahintulot') && t.artist.includes('Shirebound')))

  // F. All tracks use procedural synthesizer (audioUrl is empty string)
  for (const track of CURATED_TRACKS) {
    assert.equal(track.audioUrl, '', `Track ${track.id} must have audioUrl: ''`)
    assert.ok(track.ambientType, `Track ${track.id} must have ambientType defined`)
  }

  // G. Category filter tabs in FocusToolsWidget: All Tracks | Classical | Lo-Fi | OPM
  assert.ok(
    widgetContent.includes("['all', 'classical', 'lofi', 'opm']"),
    'Category filter tabs must support all, classical, lofi, and opm'
  )
  assert.ok(
    /cat === 'opm'\s*\?\s*'OPM'/.test(widgetContent),
    'OPM tab label must be OPM'
  )
  assert.ok(
    widgetContent.includes('Playlist ({CURATED_TRACKS.length})'),
    'Playlist count badge must reflect CURATED_TRACKS.length'
  )
})
