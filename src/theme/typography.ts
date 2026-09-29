// Per-weight imports so only the two weights the design uses get bundled.
import { Archivo_400Regular } from '@expo-google-fonts/archivo/400Regular';
import { Archivo_600SemiBold } from '@expo-google-fonts/archivo/600SemiBold';
import type { TextStyle } from 'react-native';

/** Passed to `useFonts` in the root layout. */
export const fontAssets = {
  Archivo_400Regular,
  Archivo_600SemiBold,
};

// Each weight is its own family: Android ignores `fontWeight` for custom fonts.
export const fonts = {
  regular: 'Archivo_400Regular',
  semibold: 'Archivo_600SemiBold',
} as const;

/** Type scale · Archivo. Sizes and weights from the design system; line heights tuned for mobile. */
export const typography = {
  /** 44 / 600 — big numbers, e.g. books this year. */
  stat: { fontFamily: fonts.semibold, fontSize: 44, lineHeight: 48, letterSpacing: -1 },
  /** 38 / 600 — top-level screen titles. */
  screenTitle: { fontFamily: fonts.semibold, fontSize: 38, lineHeight: 42, letterSpacing: -0.8 },
  /** 26 / 600 — sheet and modal titles. */
  sheetTitle: { fontFamily: fonts.semibold, fontSize: 26, lineHeight: 30, letterSpacing: -0.4 },
  /** 19 / 600 — book titles in lists and cards. */
  bookTitle: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 24, letterSpacing: -0.2 },
  /** 15 / 400 — body copy. */
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 },
  /** 15 / 600 — button and control labels. */
  label: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
  /** 13 / 400 — metadata, helper text. */
  secondary: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  /** 11 / 600 caps — section kickers. */
  kicker: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
