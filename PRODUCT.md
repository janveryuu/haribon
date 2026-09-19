# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Fetch primarily serves senior high-school through early-college students. They often study under time pressure, move between creating material and reviewing it, and need an interface that feels friendly without feeling childish.

## Product Purpose

Fetch helps students turn their own learning materials into active-recall practice and return to the right material at the right time. Success means a student can quickly understand what is due, begin a focused study session, complete meaningful recall practice, and see what to do next.

## Positioning

Fetch turns a student's materials into the right active-recall session at the right time. Creation, AI tutoring, focus tools, progress, discovery, and social play support this central loop rather than competing with it.

## Operating Context

The core loop is: source material or deck creation, card generation, active recall, confidence or difficulty rating, spaced-repetition scheduling, a due queue, and visible progress. Students may also use an AI tutor, focus timer and music, public deck discovery, and live study play.

The default product experience is calm, clear, and reassuring. Expressive energy is reserved for meaningful learning moments such as beginning a session, retrieving a difficult answer, reaching mastery, and completing the due queue.

The current web application includes landing, home, decks, create, tutor, explore, and play routes. It is currently a frontend-led product prototype: interface interactions and focus tools are implemented, while AI generation, ingestion, persistence, authentication, multiplayer, and production scheduling infrastructure are simulated or incomplete.

## Capabilities and Constraints

- Preserve the existing core routes and their product functions while reorganizing hierarchy within each route.
- Use an adaptive application shell. Desktop has a compact persistent sidebar for Home, Study/Decks, Create, Tutor, Explore, and Play, with account, theme, and settings separated below. Mobile uses Home, Study, Create, Tutor, and More; Explore and Play remain directly addressable inside More.
- Focus timer and music are contextual utilities rather than permanently floating elements.
- Focused study uses a dedicated deep-linkable route such as `/decks/[id]/study`, with minimal navigation, safe exit, preserved state, visible keyboard alternatives, mobile-fullscreen behavior, and a concise completion state.
- Back navigation should preserve relevant scroll, filter, and in-progress study state.
- The redesign is frontend-focused and must not imply that simulated backend, AI, multiplayer, authentication, or persistence capabilities are production-ready.
- The application uses Next.js 16, React 19, Tailwind CSS 4, Motion, Lucide, and a Base UI/shadcn-style component structure.
- Active recall and the due-study loop are the product center; supporting features must remain subordinate to that loop.
- The home experience should recommend one primary next study action. Its priority order is: due study, recent learning, creation or import, tutor help, then discovery or social play.
- Gamification should remain light and learning-authentic. Reward recall quality, consistency, recovery, and mastery. Avoid punitive streaks, empty XP farming, currencies, constant celebration, and main-loop competitive pressure; competition belongs in Play.
- The detailed visual world, motion grammar, content-authoring boundaries, and rollout sequence remain open decisions until the redesign interview is complete.
- UX labels, empty states, onboarding copy, tutor prompts, calls to action, and clearly synthetic demonstration material may be rewritten. Factual meaning must remain accurate; testimonials, usage claims, partnerships, and learning-outcome claims must not be invented.
- Desktop and mobile are complementary rather than identical reductions. Desktop prioritizes material ingestion, deck organization, detailed progress, tutor conversations, and longer sessions. Mobile prioritizes the due queue, immediate study, focused recall, quick tutor help, and progress review. Essential capabilities remain available on both.
- The product requires complete light and dark experiences. Theme support must cover contrast, surfaces, illustrations, elevation, and focus states rather than simple color inversion.

## Brand Commitments

- Keep the Fetch name.
- Keep the puppy mascot concept, while allowing its presentation and asset system to be refined.
- Use the mascot selectively as a coach for onboarding, empty states, recovery, earned encouragement, and major milestones. It should recede during focused recall.
- Keep a friendly personality that is mature enough for senior high-school and early-college students.
- Keep the core navigation destinations.
- The existing visual system, colors, component styling, and within-route hierarchy may be replaced rather than merely polished.

## Evidence on Hand

- Existing product copy, routes, components, mock study data, study-session behavior, and mascot assets in the repository.
- Existing interface behavior demonstrates the intended study loop and supporting tools.
- No verified testimonials, institutional partnerships, learning-outcome claims, or production usage metrics are currently established and must not be invented.

## Product Principles

1. Make the next worthwhile study action unmistakable.
2. Reward genuine recall and consistency rather than empty engagement.
3. Reduce the distance from a student's material to focused practice.
4. Keep powerful learning tools coherent around one study loop.
5. Feel encouraging and human without becoming childish or distracting.

## Redesign Anti-Goals

- Childish classroom visuals
- Generic SaaS dashboards made from interchangeable cards
- Excessive glassmorphism, gradients, glow, or decorative motion
- Duolingo-style pressure and manipulative reward mechanics
- Dense productivity-software aesthetics
- Sterile institutional or corporate-learning presentation
- Literal copying of Quizlet, Gizmo, or reference products

## Delivery Sequence

1. Design foundations, light and dark themes, adaptive app shell, and shared interaction primitives
2. Dashboard and the complete focused-study loop
3. Deck library and creation or import
4. Tutor
5. Explore and Play
6. Landing page built from the proven product system
7. Cross-product accessibility, responsive, performance, and motion verification

The dashboard, study session, and landing page use comp-first design. Secondary routes may be developed code-first within the approved system. The landing page is implemented after the core product interface so it demonstrates the real product language.

## Accessibility & Inclusion

The redesign must support keyboard navigation, visible focus, sufficient contrast, reduced motion, semantic controls, screen-reader clarity, responsive layouts, and text scaling. Study progress and correctness must never be communicated by color alone.
