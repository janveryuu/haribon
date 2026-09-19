# Fetch Design System Master

> Source of truth for Study Fieldbook Next V2. Page overrides in `pages/` refine these rules for individual routes.

## Product intent

Fetch turns a student's materials into the right active-recall session at the right time. The interface should feel calm during recall and lively during meaningful progress moments.

Audience: senior high-school through early-college students.

## Design dials

- Variance: 6/10, balanced editorial composition
- Motion: 6/10, responsive and purposeful
- Density: 5/10, enough information to act without dashboard fatigue

## Tokens

### Color

| Role | Value | Use |
| --- | --- | --- |
| Ink | `#14213D` | Primary text and dark navigation |
| Primary | `#2F66F6` | One recommended action, focus, active state |
| Progress | `#19B991` | Recall quality and mastery |
| Energy | `#EE9D35` | Due state and meaningful moments |
| Coral | `#E96B5A` | Attention and difficult retrieval |
| Canvas | `#F7F9FC` | Warm light application background |
| Paper | `#FFFFFF` | Elevated surfaces |

Dark mode is tuned independently with navy surfaces, periwinkle primary, mint progress, and visible borders. Never invert the light palette mechanically.

### Typography

- Display and headings: Manrope
- Body and controls: Inter
- Minimum mobile reading size: 16px
- Handwritten type is illustration-only and never carries essential meaning.

### Shape and depth

- Main surfaces: 18-20px radius
- Controls: 12-14px radius
- Pills: status, filters, segmented controls only
- Shadows: tinted navy, low opacity, used for real hierarchy
- Borders: semantic tokens in both themes

### Spacing and targets

- Base rhythm: 4px and 8px increments
- Mobile page gutter: 16px
- Desktop content maximum: 1360-1440px
- Minimum touch target: 44px
- Safe area: reserve space for fixed navigation and sheets

## Navigation and layering

- Desktop: persistent sidebar with Home, Study, Create, Tutor, Explore, and Play.
- Mobile: Home, Study, central Create, Tutor, and More.
- Bottom navigation is hidden while focused study or a modal sheet owns the viewport.
- Focus tools are contextual. They do not float over creation, deck browsing, or discovery content.
- Z-index layers are reserved for app chrome, contextual utilities, modal scrims, and modal content. Do not add arbitrary stacking values.

## Illustration system

- Editorial vector-like learning illustrations with ink outlines, organic shapes, and small annotation marks.
- Subject art carries recognition: mitochondrion, flask, calculus curve, open book.
- Mascot states are selective: onboarding, empty states, recovery, encouragement after genuine effort, and milestones.
- Use `next/image`, reserved dimensions, and responsive WebP or AVIF when production assets are available.
- Never use emoji as structural icons and never use generated imagery as a substitute for readable interface text.

## Motion

- 150-300ms ease-out for control feedback.
- Use spring motion only when it communicates state or hierarchy.
- Animate transform and opacity, not layout dimensions.
- Honor `prefers-reduced-motion` in every client motion island.
- No perpetual movement in the focused recall surface.

## Accessibility and responsive rules

- Mobile-first layout with explicit single-column fallbacks below 768px.
- No horizontal overflow at 360px.
- Form labels remain visible above inputs.
- Color never carries meaning alone.
- Modals lock background scrolling, manage focus, expose Escape and close controls, and keep focus visible.
- Fixed UI must never obscure content or keyboard focus.
- Test 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1536px, plus landscape.

## Anti-goals

- Childish classroom styling
- Generic SaaS dashboard repetition
- Neon glow, noisy gradients, and glass everywhere
- XP farming, currencies, punishment streaks, or competitive pressure in the main study loop
- Constant mascot decoration
- Mobile desktop-compression
- Invented testimonials, institutions, adoption numbers, or learning-outcome claims

