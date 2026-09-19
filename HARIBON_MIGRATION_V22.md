# Haribon to Fetch migration note

Fetch still tracks the public Haribon repository at `fd0c0c8` as its implementation baseline. The upstream repository does not contain a newer commit than the baseline already present in this worktree, so no upstream files were blindly copied over the V2 design work.

The compatible Haribon product primitives remain present in Fetch:

- active-recall decks and the FSRS-oriented review loop
- multi-source deck creation
- the Socratic tutor
- Explore and Play routes
- Motion, Lucide, Next 16, React 19, and Tailwind 4

V2.2 extends those primitives instead of replacing them. The new Play hub is a live-ready client surface with clear local-preview boundaries; room synchronization, identity, presence, friends, and persistence remain backend work. The mascot library, typography, notification center, and responsive shell are now Fetch-owned improvements layered on the Haribon foundation.
