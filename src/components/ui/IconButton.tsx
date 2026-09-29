import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, sizes } from '@/theme';

export type IconButtonProps = {
  icon: LucideIcon;
  /** Required: icon-only controls need a spoken label. */
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
};

/** Circular outlined control at the minimum touch size, e.g. goal steppers. */
export function IconButton({ icon: Icon, accessibilityLabel, onPress, disabled }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Icon size={sizes.iconSmall} strokeWidth={sizes.iconStroke} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: sizes.minTouch,
    height: sizes.minTouch,
    borderRadius: radius.circle,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
