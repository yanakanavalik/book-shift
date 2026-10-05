import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { space, type TypographyVariant } from '@/theme';

import { Text } from './Text';

export type StatValueProps = {
  value: string | number;
  /** Muted text after the number, e.g. "books this year". */
  unit: string;
  /** Read as one element. */
  accessibilityLabel: string;
  /** `stat` (default) for the big card numbers. */
  variant?: TypographyVariant;
  style?: StyleProp<ViewStyle>;
};

/** A big number with its unit on the same baseline, e.g. "12 / 24 books". */
export function StatValue({ value, unit, accessibilityLabel, variant = 'stat', style }: StatValueProps) {
  return (
    <View style={[styles.value, style]} accessible accessibilityLabel={accessibilityLabel}>
      <Text variant={variant}>{value}</Text>
      <Text variant="secondary" color="textMuted">
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1] + 2,
  },
});
