// Raw palette from the Reading Tracker design system. Prefer the semantic `colors` below in components.
export const palette = {
  darkCoffee: '#251605',
  cinnamon: '#C57B57',
  cinnamon700: '#8E4F31',
  tangerine: '#F1AB86',
  softPeach: '#F7DBA7',
  coolSteel: '#9CAFB7',
  ground: '#FCF1DE',
  muted: '#5E4A38',
} as const;

export const colors = {
  /** Screen background. `--color-bg` */
  bg: palette.ground,
  /** Cards, fields, segmented tracks. `--color-surface` */
  surface: palette.softPeach,
  /** Type, dark controls, tab bar. `--color-text` */
  text: palette.darkCoffee,
  /** Secondary text. */
  textMuted: palette.muted,
  /** The one accent: primary action, progress, goal. `--color-accent` */
  accent: palette.cinnamon,
  /** Accent text, links, stars. */
  accentText: palette.cinnamon700,
  /** Labels on the accent use Dark Coffee — light text on cinnamon falls below contrast. */
  onAccent: palette.darkCoffee,
  /** Labels on Dark Coffee fills (dark buttons, selected chips). */
  onDark: palette.ground,
  /** Empty progress tracks and dots. `--color-neutral-300` */
  track: palette.tangerine,
  /** Covers, missed streak days. `--color-steel` */
  steel: palette.coolSteel,
  /** Hairline dividers — only inside a card. */
  divider: 'rgba(37, 22, 5, 0.14)',
  /** Outlined controls. */
  outline: palette.darkCoffee,
  /** Dashed placeholder outlines (empty shelf slots, empty-state cards). */
  outlineSoft: 'rgba(94, 74, 56, 0.35)',
  outlineFaint: 'rgba(94, 74, 56, 0.2)',
  placeholder: 'rgba(94, 74, 56, 0.7)',
} as const;

/**
 * Fallback cover styles, assigned in rotation when a book has no cover image.
 * Each pairs a fill with a label color that keeps contrast.
 */
export const coverStyles = [
  { background: palette.cinnamon, text: palette.darkCoffee },
  { background: palette.darkCoffee, text: palette.ground },
  { background: palette.coolSteel, text: palette.darkCoffee },
  { background: palette.tangerine, text: palette.darkCoffee },
  { background: palette.softPeach, text: palette.darkCoffee },
  { background: palette.ground, text: palette.darkCoffee, border: palette.darkCoffee },
] as const;

export type ColorToken = keyof typeof colors;
