# Fetch backend handoff

This document is the source-of-truth handoff for continuing Fetch in another IDE. It describes the product, the current frontend, the data that is still mocked, and the backend contract the next implementation should build.

## 1. What Fetch is

Fetch is a student learning web application for senior high-school through early-college learners. It turns a student's own materials into active-recall practice, then brings the right cards back at the right time.

The product is a calm study loop, not a general-purpose social network:

1. A student imports or writes material.
2. Fetch drafts active-recall questions and answers.
3. The student reviews and edits the draft.
4. Fetch schedules cards using spaced repetition.
5. The student completes a focused recall session.
6. Ratings update memory state and determine the next review.
7. Home recommends one clear next action.

Creation, the AI tutor, focus tools, progress, discovery, and Play should support this loop instead of competing equally for attention.

The brand is Fetch: a friendly puppy who retrieves what memory is about to drop. The tone is warm and encouraging, but mature enough for older students. The mascot is selective: welcome, empty, recovery, effort, and mastery states; never decoration during a focused recall prompt.

## 2. Current product boundaries

The current repository is a frontend-led prototype. The following are simulated or local-only and need backend implementation:

- authentication and account persistence
- user profiles and friendships
- decks and flashcard persistence
- file uploads and ingestion jobs
- AI card generation
- AI tutor conversations
- real FSRS scheduling and review history
- notifications
- cross-device focus-session sync
- multiplayer room presence, synchronized rounds, and leaderboards
- community deck publishing, cloning, likes, and moderation

Do not expose demo values as real adoption numbers, institutional relationships, testimonials, or learning-outcome claims.

## 3. Stack and local commands

- Next.js 16 App Router
- React 19
- TypeScript 5.7+
- Tailwind CSS 4 with CSS variables in `app/globals.css`
- Motion (`motion/react`) for transitions
- Lucide React for icons
- Base UI/shadcn-style component structure
- Vercel Analytics in production only
- Web Audio API sound effects; no audio package required

Commands:

```bash
npm install
npm run dev
npm run build
npm test
```

The current development server is normally available at `http://localhost:3001`.

## 4. Route map

| Route | Purpose | Current state |
|---|---|---|
| `/` | Landing page | Frontend complete; copy and visuals are synthetic product content |
| `/home` | Due-first dashboard | Frontend complete; uses mock decks, quests, and momentum |
| `/decks` | Study library | Frontend complete; filters persist to session storage |
| `/decks/[id]/study` | Focused recall session | Deep-linkable study sheet; cards are currently mock data |
| `/create` | Import and create material | Four source modes and draft card review; generation is simulated |
| `/tutor` | Socratic tutor | Conversation and recall checks are local deterministic demo behavior |
| `/explore` | Community deck discovery | Community sets are mock data; cloning is not persisted |
| `/play` | Social study hub | Rooms and friends are live-ready local preview behavior |
| `/play?room=FETCH-88` | Room preview / match | Local countdown, answers, score, and demo leaderboard |
| `/profile/[username]` | Shareable learner profile | Frontend profile preview with privacy copy and local follow toggle |
| `/more` | Secondary destinations | Explore, Play, focus tools, account, and settings entry points |

## 5. Frontend architecture

### App shell

`components/app/app-shell.tsx` owns the authenticated product shell:

- desktop persistent sidebar
- sticky topbar
- mobile bottom navigation
- search palette
- rank modal
- focus tools widget
- quick action menu

The focused study route and active Play room intentionally own more of the viewport. The mobile bottom bar is hidden in those states so it cannot cover recall or answer controls.

### Main views

- `components/app/dashboard-view.tsx`: due queue, weekly recall quality, recent decks, small wins, creation CTA
- `components/app/deck-list-view.tsx`: search, subject filtering, sorting, retention rings, due-first deck list
- `components/app/deck-creator-view.tsx`: source selection, deck metadata, generation simulation, card editor, custom cards, save/start study
- `components/app/ai-tutor-view.tsx`: deterministic tutor conversation, suggested prompts, multiple-choice recall checks, save-card interaction
- `components/app/explore-view.tsx`: public study set discovery and clone CTA
- `components/app/play-route-client.tsx`: Play hub, room creation/join, open rooms, friends activity
- `components/app/live-play-view.tsx`: timed room round, answer state, keyboard shortcuts, score, leaderboard, completion state
- `components/app/profile-view.tsx`: learner profile preview and privacy boundary
- `components/shared/study-sheet.tsx`: 3D recall card, reveal, hint, Again/Hard/Good/Easy ratings, completion state
- `components/focus/focus-tools-widget.tsx`: Pomodoro and study sounds as contextual tools

### State model today

Most product data is initialized from `lib/mock-data.ts` and held in React state. Focus tools use `FocusToolsProvider` at the root and persist timer/settings locally. The app is intentionally not pretending to have a backend yet.

## 6. Current data models

The existing TypeScript types are in `lib/mock-data.ts`.

```ts
interface Flashcard {
  id: string
  deckId: string
  subject: string
  question: string
  answer: string
  hint?: string
  lastInterval?: string
  confidence?: 'again' | 'hard' | 'good' | 'easy'
  stability?: number
  difficulty?: number
  reps?: number
  lapses?: number
}

interface Deck {
  id: string
  title: string
  subject: string
  cards: number
  due: number
  retention: number
  color: string
  badgeBg?: string
  description?: string
  author?: string
  cardsList: Flashcard[]
}

interface UserProfile {
  name: string
  initials: string
  grade: string
  level: number
  streak: number
  totalXp: number
  todayXp: number
  levelTitle: string
  xpToNextLevel: number
  aiUsesRemaining: number
  streakShields: number
}
```

The backend should normalize these into relational records rather than storing `cardsList` inside a deck row.

## 7. Recommended backend domain model

Supabase/Postgres is a good fit because the product needs relational data, row-level security, storage, and realtime channels.

### Identity

- `profiles`: `id`, `display_name`, `username`, `avatar_url`, `grade_level`, `timezone`, `theme_preference`, `created_at`, `updated_at`
- `profile_privacy`: `user_id`, `profile_visibility`, `activity_visibility`, `allow_friend_requests`
- use Supabase Auth user IDs everywhere; never trust a client-provided user ID

### Learning content

- `decks`: `id`, `owner_id`, `title`, `subject`, `description`, `visibility`, `source_kind`, `source_file_id`, `created_at`, `updated_at`, `archived_at`
- `deck_members`: `deck_id`, `user_id`, `role`
- `flashcards`: `id`, `deck_id`, `question`, `answer`, `hint`, `position`, `created_at`, `updated_at`
- `card_tags`: `card_id`, `tag`
- `deck_sources`: `id`, `deck_id`, `kind`, `storage_path`, `mime_type`, `size_bytes`, `status`, `error_code`, `created_at`

### Scheduling and review

- `card_states`: `card_id`, `user_id`, `due_at`, `stability`, `difficulty`, `retrievability`, `reps`, `lapses`, `last_reviewed_at`, `last_rating`
- `review_logs`: `id`, `card_id`, `user_id`, `session_id`, `rating`, `elapsed_ms`, `scheduled_at`, `reviewed_at`, `client_event_id`
- `study_sessions`: `id`, `user_id`, `deck_id`, `started_at`, `ended_at`, `status`, `cards_seen`, `cards_completed`, `recall_quality`

Use a server-side FSRS implementation. The client sends a rating event; the server reads the current card state, calculates the next state, writes a review log, and returns the updated state. Use an idempotency key (`client_event_id`) to prevent duplicate ratings during retry/offline recovery.

### Creation and AI jobs

- `generation_jobs`: `id`, `user_id`, `deck_id`, `source_id`, `status`, `model`, `prompt_version`, `error_code`, `created_at`, `completed_at`
- `generation_cards`: `id`, `generation_job_id`, `question`, `answer`, `hint`, `confidence`, `needs_review`
- `tutor_threads`: `id`, `user_id`, `deck_id`, `title`, `created_at`, `updated_at`
- `tutor_messages`: `id`, `thread_id`, `role`, `content`, `source_card_id`, `created_at`

AI output must be schema-validated JSON. Treat all generated cards as drafts until the student accepts them. Store model name and prompt version for reproducibility.

### Notifications

- `notifications`: `id`, `user_id`, `kind`, `title`, `body`, `deck_id`, `read_at`, `created_at`
- create due-card notifications server-side from the schedule, with a deduplication key per user/deck/day

### Social and Play

- `friendships`: `requester_id`, `addressee_id`, `status`, `created_at`, `accepted_at`
- `activity_events`: `id`, `user_id`, `kind`, `visibility`, `payload`, `created_at`
- `play_rooms`: `id`, `host_id`, `join_code`, `deck_id`, `status`, `visibility`, `max_players`, `starts_at`, `created_at`, `ended_at`
- `play_room_members`: `room_id`, `user_id`, `status`, `score`, `streak`, `joined_at`, `left_at`
- `play_rounds`: `id`, `room_id`, `round_number`, `card_id`, `question_snapshot`, `answer_options`, `correct_option`, `starts_at`, `ends_at`
- `play_answers`: `id`, `round_id`, `user_id`, `option_index`, `is_correct`, `response_ms`, `points`, `created_at`

Never send private deck content to users who are not room members. Store question snapshots for a round so later card edits cannot change an active match.

## 8. API and server-action contract

The client should eventually use typed server actions or route handlers behind an application service layer. Suggested operations:

### Auth and profile

- `signUp`, `signIn`, `signOut`, `getCurrentProfile`, `updateProfile`, `updatePrivacy`
- `sendFriendRequest`, `acceptFriendRequest`, `removeFriend`
- `listFriends`, `listVisibleActivity`, `getPublicProfile`

### Decks and cards

- `listDecks({ filter, sort, cursor })`
- `getDeck(deckId)`
- `createDeck(metadata)`
- `updateDeck(deckId, patch)`
- `archiveDeck(deckId)`
- `createCard`, `updateCard`, `deleteCard`, `reorderCards`
- `clonePublicDeck(deckId)`

### Ingestion and generation

- `createUploadIntent`
- `startIngestion(sourceId)`
- `getGenerationJob(jobId)`
- `acceptGenerationDraft(jobId, selectedCardIds)`
- `discardGenerationDraft(jobId)`

Use signed storage uploads, file-size/MIME validation, virus scanning where available, and a queue/worker for PDF/OCR/AI processing. Do not run expensive parsing inside a request that blocks the UI.

### Study

- `getDueQueue(deckId?)`
- `startStudySession(deckId, mode)`
- `submitReview({ sessionId, cardId, rating, elapsedMs, clientEventId })`
- `finishStudySession(sessionId)`
- `getProgressSummary(range)`

### Tutor

- `createTutorThread(deckId?)`
- `sendTutorMessage(threadId, content)` with streaming response if supported
- `saveTutorCard(threadId, messageId)`
- `getTutorThreads`, `getTutorMessages`

### Play

- `createPlayRoom({ deckId, visibility, maxPlayers })`
- `joinPlayRoom(joinCode)`
- `leavePlayRoom(roomId)`
- `startPlayRoom(roomId)`
- `submitPlayAnswer(roundId, optionIndex, clientEventId)`
- `subscribeToRoom(roomId)` via Supabase Realtime
- `getRoomSummary(roomId)`

## 9. Multiplayer design

The current `/play` UI is a local preview. Convert it to a server-authoritative flow:

1. Host creates a room.
2. Server validates deck access and creates a join code.
3. Members join and receive presence updates.
4. Host starts the room; server creates round snapshots and timestamps.
5. Clients render the same round from server events.
6. Answers are validated server-side. Score uses correctness plus response time, with a reasonable cap.
7. Server publishes leaderboard updates.
8. Server closes the room and stores a summary.

Presence should be ephemeral. Scores and answers should be durable. Reconnect should restore room state from the current round rather than trusting stale local state.

## 10. Security, privacy, and abuse controls

- Enable row-level security for every user-owned table.
- Validate ownership on every deck/card/session mutation.
- Treat uploaded files and AI output as untrusted input.
- Restrict file size, MIME type, and storage paths.
- Rate-limit generation and tutor requests per user.
- Add moderation/reporting before public deck publishing.
- Keep profile/activity visibility opt-in and separate from deck privacy.
- Do not expose email addresses or private tutor content through profile/activity queries.
- Audit room joins, answer submissions, and friendship changes.
- Use server timestamps for scheduling, room timing, and scoring.

## 11. Frontend-to-backend migration order

1. Add Supabase project, environment variables, auth callback, and typed database client.
2. Replace profile and deck mock reads with authenticated queries.
3. Persist cards and implement server-side FSRS state and review logs.
4. Persist study sessions and dashboard summaries.
5. Add storage upload intents and asynchronous ingestion jobs.
6. Replace deterministic generation with validated AI jobs and draft acceptance.
7. Persist tutor threads/messages and streaming responses.
8. Persist notifications and connect the fixed notification center.
9. Add friend requests, privacy, activity events, and profile queries.
10. Replace Play preview state with realtime room state and server scoring.
11. Add offline queue/idempotent review submission and reconnect handling.
12. Add production observability, rate limits, moderation, and end-to-end tests.

At every step, keep the existing mock adapter as a development fallback so the UI remains usable without backend credentials.

## 12. Design and UX constraints to preserve

- The Home screen recommends one primary due study action.
- Focused study minimizes navigation and keeps the question visually dominant.
- Light and dark themes are intentionally tuned independently.
- Motion is brief, purposeful, and disabled or reduced when `prefers-reduced-motion` is enabled.
- Use Lucide or authored SVG icons, never emoji as interface icons.
- Use the mascot for meaningful coaching moments, not every card.
- Play is optional and socially positive; it must not punish a broken study streak.
- Desktop favors creation, organization, tutor, and detail. Mobile favors due study and quick help.
- Preserve scroll position, filters, active study state, and safe exit behavior.

## 13. Important files

- `app/layout.tsx`: root metadata, Geist fonts, focus provider
- `app/globals.css`: theme tokens and global accessibility styling
- `components/app/app-shell.tsx`: shared shell and global overlays
- `components/shared/study-sheet.tsx`: core active recall interaction
- `lib/mock-data.ts`: current demo domain data and types
- `lib/focus-context.tsx`: timer/music state and local persistence
- `lib/focus-reconciliation.ts`: drift-free timer restoration logic
- `lib/study-music-tracks.ts`: curated tracks and audio validation helpers
- `lib/subject-colors.ts`: semantic subject color tokens
- `components/app/play-route-client.tsx`: social Play hub
- `components/app/live-play-view.tsx`: room preview interaction
- `public/mascot/manifest.json`: canonical mascot pose map
- `design-system/fetch/MASTER.md`: design system direction
- `PRODUCT.md`: product principles and constraints
- `HARIBON_MIGRATION_V22.md`: relationship to the upstream Haribon baseline

## 14. Mascot asset map

The ZIP supplied by the product owner was converted to optimized WebP assets:

- `coach-wave.webp`: welcome and empty states
- `coach-study.webp`: library and creation
- `coach-point.webp`: tutor and explanations
- `coach-thinking.webp`: difficult cards and recovery
- `coach-idea.webp`: creation suggestions
- `coach-thumbs-up.webp`: small wins
- `coach-celebrate.webp`: mastery and completion
- `coach-rest.webp`: breaks and recovery

All assets are listed in `public/mascot/manifest.json` with alt text and intended use.

## 15. Definition of backend readiness

The backend pass is complete when a new user can sign up, create/import a deck, accept generated cards, study a due queue, rate cards, close/reopen the app without losing state, use tutor threads, receive notifications, control profile privacy, add friends, create/join a real Play room, reconnect during a round, and see server-derived progress on desktop and mobile.

The UI should continue to work in demo mode when backend environment variables are absent, but demo mode must be clearly labeled in social and generated-content surfaces.
