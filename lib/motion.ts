/**
 * Shared Motion & Interaction Configuration for Fetch
 * Standardized easing curves, duration tokens, and spring physics.
 */

export const motionTokens = {
  // Duration tokens (in seconds for Motion / JS animations)
  durations: {
    instant: 0.1,    // 100ms - Active press, FSRS rating buttons, immediate clicks
    fast: 0.15,      // 150ms - Hover states, small property changes, tooltips
    base: 0.2,       // 200ms - Standard transitions, tabs, list item hover
    backdrop: 0.2,   // 200ms - Dialog / drawer backdrop opacity fade
    deliberate: 0.4, // 400ms - Modals, drawers, card flips, large spatial shifts
    fill: 0.6,       // 600ms - Progress bars, SVG retention rings, telemetry charts
  },

  // Standard CSS Easing Curves
  easings: {
    // Apple-grade ease-out for hover, press releases, and property changes
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // In-out for symmetrical state switches
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    // Snappy physical press curve
    press: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },

  // Motion / Framer-Motion Spring Presets (spatial motion, modals, flips)
  springs: {
    // Snappy spring for rapid study card flips (crisp, zero floatiness)
    cardFlip: {
      type: 'spring' as const,
      stiffness: 340,
      damping: 26,
      mass: 0.8,
    },
    // Spring for slide-up sheets and major dialogs
    modalSheet: {
      type: 'spring' as const,
      stiffness: 320,
      damping: 32,
      mass: 1,
    },
    // Fast spring for dropdowns, popovers, and notification drawers
    dropdown: {
      type: 'spring' as const,
      stiffness: 420,
      damping: 30,
      mass: 0.6,
    },
    // Morphing spring for shared layout indicator tabs (layoutId)
    tabPill: {
      type: 'spring' as const,
      stiffness: 480,
      damping: 36,
    },
    // Subtle tactile pop for icons and small feedback elements
    tactilePop: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 25,
    },
  },
} as const

// CSS Class Presets for standard Tailwind utility composition
export const motionClasses = {
  // Instant tactile button press with fast ease-out recovery
  pressable:
    'transition-[transform,background-color,border-color,opacity,box-shadow] duration-150 ease-out active:scale-[0.97] active:duration-75 active:ease-out select-none',
  // Card subtle lift (translateY only, no scale distortion)
  cardLift:
    'transition-[transform,border-color,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] active:duration-75',
  // Standard accessible focus ring with subtle offset
  focusRing:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
} as const
