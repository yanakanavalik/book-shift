// Raw palette from the Reading Tracker design system. Prefer the semantic `colors` below in components.
export const palette = {
  darkCoffee: '#251605',
  cinnamon: '#C57B57',
  cinnamon700: '#8E4F31',
  tangerine: '#F1AB86',
  softPeach: '#F7DBA7',
  coolSteel: '#9CAFB7',
  /** "Dark steel" for today's streak ring; sampled from the Home design (no hex in the design system). */
  coolSteel700: '#4A5F68',
  ground: '#FCF1DE',
  muted: '#5E4A38',
} as const;

export const colors = {
  /** Screen background. `--color-bg` */
  bg: palette.ground,
  /** Cards, fields, segmented tracks. `--color-surface` */
  surface: palette.softPeach,
  /** Steel-tinted surface for streak/time content and "To read" badges (Cool Steel at ~38% on ground). */
  surfaceSteel: '#D8D8CF',
  /** Text on `surfaceSteel`, e.g. the "To read" badge (4.7:1). */
  steelText: palette.coolSteel700,
  /** Type, dark controls, tab bar. `--color-text` */
  text: palette.darkCoffee,
  /** Secondary text. */
  textMuted: palette.muted,
  /** Accent for actions and book progress: primary buttons, progress bars, goal. `--color-accent` */
  accent: palette.cinnamon,
  /** Accent text, links, stars. */
  accentText: palette.cinnamon700,
  /** Labels on the accent use Dark Coffee — light text on cinnamon falls below contrast. */
  onAccent: palette.darkCoffee,
  /** Labels on Dark Coffee fills (dark buttons). */
  onDark: palette.ground,
  /** Second accent, for selection, time and streaks. `--color-steel` */
  steel: palette.coolSteel,
  /** Selected segments and chips: Cool Steel fill with Dark Coffee text. */
  selected: palette.coolSteel,
  onSelected: palette.darkCoffee,
  /** Empty progress tracks and dots. `--color-neutral-300` */
  track: palette.tangerine,
  /** Hairline dividers — only inside a card. */
  divider: 'rgba(37, 22, 5, 0.14)',
  /** Outlined controls. */
  outline: palette.darkCoffee,
  /** Softer outline for secondary round controls, e.g. goal steppers (Dark Coffee at 40%). */
  outlineSubtle: 'rgba(37, 22, 5, 0.4)',
  /** Dashed placeholder outlines (empty shelf slots, empty-state cards). */
  outlineSoft: 'rgba(94, 74, 56, 0.35)',
  outlineFaint: 'rgba(94, 74, 56, 0.25)',
  placeholder: 'rgba(94, 74, 56, 0.7)',
  /** Streak days: steel = read, tangerine = missed, dark steel ring = today, outline = future. */
  streakRead: palette.coolSteel,
  streakMissed: palette.tangerine,
  streakToday: palette.coolSteel700,
  streakFuture: palette.coolSteel,
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
  // Hairline outline so it doesn't disappear on peach cards.
  { background: palette.softPeach, text: palette.darkCoffee, border: colors.outlineSubtle },
  { background: palette.ground, text: palette.darkCoffee, border: palette.darkCoffee },
] as const;

export type CoverStyle = (typeof coverStyles)[number];

/** Stable fallback cover style for a book, so it keeps the same look everywhere (app and widgets). */
export function coverStyleFor(seed: string): CoverStyle {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return coverStyles[Math.abs(hash) % coverStyles.length];
}

export type ColorToken = keyof typeof colors;
