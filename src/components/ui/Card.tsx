import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, space } from '@/theme';

export type CardProps = ViewProps & {
  /** `surface`: peach card for grouping content. `dashed`: outlined placeholder for empty states. */
  variant?: 'surface' | 'dashed';
};

/** Surfaces, not lines: use `Divider` only inside a card. */
export function Card({ variant = 'surface', style, ...props }: CardProps) {
  return <View style={[styles.card, variant === 'dashed' ? styles.dashed : styles.surface, style]} {...props} />;
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
  dashed: {
    borderRadius: radius.listRow,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineSoft,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
});
