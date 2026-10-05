import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, sizes, smallControlHitSlop, space, type ColorToken } from '@/theme';

import { Text } from './Text';

type Variant = 'primary' | 'dark' | 'outline' | 'subtle' | 'link' | 'plain';

const VARIANTS: Record<Variant, { container: ViewStyle; label: ColorToken }> = {
  /** Cinnamon — the one main action on a screen. */
  primary: { container: { backgroundColor: colors.accent }, label: 'onAccent' },
  dark: { container: { backgroundColor: colors.text }, label: 'onDark' },
  outline: { container: { borderWidth: 1, borderColor: colors.outline }, label: 'text' },
  /** Softer outline for secondary actions, e.g. "Finished", "Minimize". */
  subtle: { container: { borderWidth: 1, borderColor: colors.outlineSubtle }, label: 'text' },
  /** Text-only, e.g. "Discard session". */
  link: { container: {}, label: 'accentText' },
  /** Text-only in the body color, for a neutral secondary action like "Keep reading". */
  plain: { container: {}, label: 'text' },
};

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: Variant;
  /** `lg` (default) 52 · `md` 44, e.g. next to a text field · `sm` 36, compact pills. */
  size?: 'lg' | 'md' | 'sm';
  icon?: LucideIcon;
  /** Text-only variants: sit inline in a row (no padding, compact height) instead of centered on their own line. */
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
};

const HEIGHTS = { lg: sizes.controlHeight, md: sizes.minTouch, sm: sizes.controlHeightSmall } as const;

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  inline,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const { container, label: labelColor } = VARIANTS[variant];
  const textOnly = variant === 'link' || variant === 'plain';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      // Small pills stay visually compact but keep the 44pt minimum touch target.
      hitSlop={size === 'sm' ? smallControlHitSlop : undefined}
      style={({ pressed }) => [
        styles.base,
        { height: HEIGHTS[size] },
        { paddingHorizontal: size === 'lg' ? space[6] : space[4] },
        container,
        textOnly && (inline ? styles.inline : styles.link),
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {Icon ? <Icon size={sizes.iconSmall} strokeWidth={sizes.iconStroke} color={colors[labelColor]} /> : null}
        <Text variant="label" color={labelColor}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  link: {
    alignSelf: 'center',
    height: sizes.minTouch,
  },
  inline: {
    paddingHorizontal: 0,
    height: sizes.controlHeightSmall,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.4,
  },
});
