# Fetch Study Fieldbook Next V2

## Design read

Fetch is a responsive learning product for senior high-school through early-college students. The redesign should feel lively, reassuring, and academically credible. It should combine a calm fieldbook workspace with selective editorial illustration and a clear active-recall loop.

Design dials:

- Variance: 6/10
- Motion: 6/10
- Density: 5/10
- Primary mode: warm light
- Secondary mode: independently tuned evening dark theme

The approved direction preserves Fetch, the dog mascot, the product routes, and the active-recall promise. It replaces the current compressed desktop-on-mobile behavior with purpose-built phone layouts.

## Current-state findings

### What already works

- The primary blue, deep navy, mint, amber, and coral palette fits the product.
- Manrope and Inter provide the right mature-friendly foundation.
- The desktop sidebar and five-item mobile navigation express the intended information architecture.
- The dedicated study route, session persistence, keyboard alternatives, and reduced-motion support are good foundations.

### What must change

- The dashboard is clean but visually underdeveloped compared with the approved reference. The main card relies on a generic line icon where a learning-specific illustration should carry the subject identity.
- Several desktop surfaces are large white containers with too little internal composition.
- The mobile experience still behaves like a narrowed desktop interface in important places.
- The creator review header keeps its title, secondary action, and primary action in one horizontal row. This crushes the heading into one-word lines on narrow screens.
- Fixed navigation, the active focus pill, and long content compete for the same bottom viewport area.
- Focus and quick-action sheets do not share a single overlay policy, height model, navigation suppression rule, or focus-management contract.
- The product lacks a reusable illustration system. The mascot, subject art, progress moments, and empty states do not yet feel like one visual world.
- The current generated master design file recommends a child-oriented font system that conflicts with the approved audience. The V2 system will replace that recommendation with the established Manrope and Inter pairing.

## Visual system

### Color

- Ink: `#14213D`
- Primary cobalt: `#2F66F6`
- Progress mint: `#19B991`
- Energy amber: `#EE9D35`
- Helpful coral: `#E96B5A`
- Canvas: `#F7F9FC`
- Paper surface: `#FFFFFF`

Dark mode will use navy surfaces and independently tuned borders, illustrations, elevation, and focus states. It will not be a direct inversion.

### Typography

- Display and high-emphasis UI: Manrope
- Body, controls, and dense learning content: Inter
- Handwritten lettering: illustration-only annotations, never essential interface copy
- Mobile body copy: 16px minimum for reading content

### Shape and depth

- Main cards: 18-20px radius
- Controls and compact cards: 12-14px radius
- Pills: reserved for status, filters, and segmented controls
- Shadows: tinted navy shadows with low opacity
- Borders: semantic tokens with visible light and dark variants

### Illustration language

Illustrations will use softly dimensional editorial vectors with ink-like outlines, organic shapes, and restrained handwritten notes. They will be subject-specific and useful:

- Biology: mitochondrion, cell, DNA, leaf
- Chemistry: flask, molecule, reaction path
- Mathematics: derivative curve, integral, coordinate plane
- English: open book, annotated passage, quotation marks
- Progress: growth path, sprout, trail signs, small field notes
- Mascot: onboarding, recovery, genuine encouragement, empty states, and major milestones only

The mascot will recede during focused recall.

## Responsive architecture

### Mobile

- Design target begins at 360px and is verified at 375px, 390px, and 430px.
- Use a compact app bar, 16px page gutters, single-column content, and horizontal subject shelves where breadth is useful.
- The bottom navigation occupies one reserved safe-area-aware layer. Page content receives matching bottom inset.
- No persistent floating timer when it would cover learning content. Active focus status becomes a compact contextual strip or is accessed from the app bar.
- Creation becomes a sequence: source, deck details, draft review, save and study.
- Draft review actions stack on narrow screens. The save action becomes a single sticky bottom action above the safe area.
- Modals and sheets suppress competing fixed navigation, lock background scrolling, trap focus, restore focus on close, and expose a predictable close action.
- Quick Actions targets roughly 55-65% of the viewport. Focus Tools targets roughly 68-76%, with internal scrolling only when content requires it.

### Tablet

- Use two-column layouts only when each column remains readable.
- Navigation can remain mobile-style until the full sidebar has enough room.
- Creator and tutor surfaces gain a supporting rail without duplicating desktop density.

### Desktop

- Keep the compact persistent sidebar.
- Use a 12-column content grid within a 1360-1440px maximum canvas.
- The next study session owns the strongest visual region and contains the subject illustration.
- Secondary panels vary in composition rather than repeating equal white cards.
- Detailed deck organization, tutor conversations, imports, and progress views use the additional width.

## Ten-phase implementation plan

### 1. Lock the V2 design source of truth

- Replace the conflicting child-oriented master recommendations.
- Document final tokens for color, type, spacing, radii, elevation, icon sizes, layer order, and motion.
- Add page overrides for Home, Create, Study, Tutor, Explore, Play, and Landing.
- Treat the three V2 generated references as direction, not pixel-perfect requirements.

### 2. Build the illustration asset system

- Generate final mascot states and subject illustrations as separate production assets.
- Produce light and dark-compatible variants where needed.
- Export responsive WebP or AVIF assets, retain high-quality PNG sources, and reserve dimensions to prevent layout shift.
- Create an asset manifest with usage, alt text, aspect ratio, and intended route.

### 3. Rebuild responsive foundations and the app shell

- Establish shared page gutters, width containers, safe-area variables, and z-index tokens.
- Refine the desktop sidebar and mobile app bar.
- Rebuild the bottom navigation as a stable safe-area layer with clear active states and 44px minimum targets.
- Add an overlay coordinator so navigation, quick actions, focus tools, and study overlays never compete.

### 4. Upgrade the dashboard

- Implement the illustrated next-session hero.
- Build a mobile-first subject shelf.
- Recompose recall quality, mascot coaching, recent decks, and progress notes with varied hierarchy.
- Keep the primary action visible without forcing the student to plan.
- Use small motion only to explain entrance, progress, and interaction feedback.

### 5. Redesign decks and creation

- Convert the deck library into a responsive card-and-row system with filter persistence.
- Replace the creator's desktop compression with a mobile sequence.
- Repair the review header, action wrapping, text measure, and sticky CTA behavior.
- Add intentional loading, empty, generated, edit, error, and saved states.

### 6. Rebuild quick actions and focus tools

- Create a shared sheet primitive with focus trap, scroll lock, safe-area padding, close behavior, and reduced-motion handling.
- Shorten quick-action copy and keep each row fully readable.
- Remove the content-covering mobile focus pill.
- Make the timer and music panel responsive, internally scrollable, and mutually exclusive with bottom navigation.

### 7. Upgrade the focused study route

- Preserve the deep link and session-state behavior.
- Give prompt, reveal, confidence rating, progress, and exit a clearer visual sequence.
- Use illustrations only at session start, recovery, and completion.
- Verify keyboard, screen reader, touch, fullscreen mobile, and interrupted-session behavior.

### 8. Upgrade Tutor, Explore, and Play

- Tutor: conversation-first layout with quick help and contextual study references.
- Explore: mobile discovery shelves and desktop browsing without unsupported social claims.
- Play: contain energetic competition inside the route and keep learning content readable.
- Share the illustration and motion language without making every route visually identical.

### 9. Rebuild the landing page from the proven product system

- Use real product screenshots and generated editorial assets.
- Align promises with implemented product behavior.
- Keep claims factual and avoid invented testimonials, institutions, adoption numbers, and learning outcomes.
- Optimize above-fold imagery and reserve layout dimensions.

### 10. Verification and hardening

- Test widths: 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1536px.
- Test phone and tablet landscape.
- Test 200% text scaling, keyboard-only use, screen reader order, dark mode, reduced motion, and touch targets.
- Confirm no horizontal overflow and no content hidden under fixed UI.
- Verify loading, empty, error, saved, offline-like, and interrupted states.
- Run TypeScript, automated tests, production build, visual regression screenshots, accessibility checks, and performance checks.

## Delivery order

Implementation will proceed in vertical slices so each stage is usable:

1. Tokens, assets, shell, and overlay primitives
2. Dashboard and mobile navigation
3. Deck library, creation, and draft review
4. Focus tools and study route
5. Tutor, Explore, and Play
6. Landing page
7. Cross-product verification and final polish

## Acceptance criteria

The redesign is complete when:

- A student can open Fetch on a phone and begin the right review within two clear actions.
- No mobile heading, CTA, sheet, navigation element, or floating control clips or overlaps at 360px.
- Desktop feels richer and more composed without becoming denser or more distracting.
- Illustrations create recognizable subject identity and meaningful encouragement.
- The mascot appears selectively and never competes with recall content.
- Light and dark themes feel intentionally designed.
- Motion communicates hierarchy, feedback, or state and fully respects reduced-motion preferences.
- All routes share one design system while retaining route-specific hierarchy.

## Reference artifacts

- `.impeccable/mocks/decision/fetch-fieldbook-v2-desktop.png`
- `.impeccable/mocks/decision/fetch-fieldbook-v2-mobile-home.png`
- `.impeccable/mocks/decision/fetch-fieldbook-v2-mobile-flow.png`

