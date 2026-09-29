import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, sizes, space } from '@/theme';

import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Selectable pill. Selected: Cool Steel fill with Dark Coffee text; otherwise outlined. */
export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={(sizes.minTouch - sizes.controlHeightSmall) / 2}
      style={({ pressed }) => [styles.chip, selected ? styles.selected : styles.unselected, pressed && styles.pressed]}
    >
      <Text variant="label" color={selected ? 'onSelected' : 'text'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    height: sizes.controlHeightSmall,
    paddingHorizontal: space[3],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.selected,
    borderWidth: 1,
    borderColor: colors.selected,
  },
  unselected: {
    borderWidth: 1,
    borderColor: colors.outlineSoft,
  },
  pressed: {
    opacity: 0.75,
  },
});
