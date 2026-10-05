/** Spacing scale, mirroring `--space-N`. */
export const space = {
  /** 4 */
  1: 4,
  /** 8 · tight groups */
  2: 8,
  /** 12 · between cards */
  3: 12,
  /** 16 · screen edge, card padding */
  4: 16,
  /** 24 · grid rows */
  6: 24,
  /** 32 · tab bar inset */
  8: 32,
} as const;

export const radius = {
  /** Bottom sheets and hero panels. */
  sheet: 32,
  hero: 32,
  cards: 28,
  listRow: 20,
  /** Book covers: small thumbnails / full size. */
  coverSmall: 6,
  cover: 14,
  /** Fully rounded — every tappable control. */
  pill: 999,
  /** Dots and avatars. */
  circle: 999,
} as const;

export const sizes = {
  /** Minimum touch height for anything tappable. */
  minTouch: 44,
  controlHeight: 52,
  controlHeightSmall: 36,
  /** Floating chips, e.g. the minimized reading timer. */
  chipHeight: 48,
  /** Lucide icons, 2px stroke. */
  iconSmall: 16,
  icon: 20,
  iconStroke: 2,
} as const;

/** Extra touch area around small (36) controls so they still meet the 44 minimum. */
export const smallControlHitSlop = (sizes.minTouch - sizes.controlHeightSmall) / 2;
