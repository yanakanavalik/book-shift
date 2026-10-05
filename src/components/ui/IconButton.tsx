import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, sizes } from '@/theme';

export type IconButtonProps = {
  icon: LucideIcon;
  /** Required: icon-only controls need a spoken label. */
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
  /** `outline` (default) for steppers; `steel` for time-related actions like the reading timer. `active` fills it. */
  tone?: 'outline' | 'steel';
  active?: boolean;
};

/** Circular outlined control at the minimum touch size, e.g. goal steppers. */
export function IconButton({ icon: Icon, accessibilityLabel, onPress, disabled, tone = 'outline', active }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'steel' && (active ? styles.steelActive : styles.steel),
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
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
    borderColor: colors.outlineSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  steel: {
    borderWidth: 0,
    backgroundColor: colors.surfaceSteel,
  },
  steelActive: {
    borderWidth: 0,
    backgroundColor: colors.steel,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
