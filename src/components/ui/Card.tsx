import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, space } from '@/theme';

export type CardProps = ViewProps & {
  /** `surface`: peach card for grouping content. `steel`: steel-tinted card for streak and time content. */
  variant?: 'surface' | 'steel';
};

/** Surfaces, not lines: use `Divider` only inside a card. */
export function Card({ variant = 'surface', style, ...props }: CardProps) {
  return <View style={[styles.card, variant === 'steel' ? styles.steel : styles.surface, style]} {...props} />;
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  card: {
    padding: space[4],
    gap: space[2],
  },
  surface: {
    backgroundColor: colors.surface,
    borderRadius: radius.cards,
  },
  steel: {
    backgroundColor: colors.surfaceSteel,
    borderRadius: radius.cards,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
});
