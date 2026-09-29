import type { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { colors, radius, sizes, space, typography } from '@/theme';

import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: LucideIcon;
  /** `inset` uses the ground color, for fields placed on a peach card. */
  tone?: 'default' | 'inset';
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  icon: Icon,
  tone = 'default',
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text variant="secondary" color="textMuted">
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, tone === 'inset' && styles.inset, focused && styles.focused]}>
        {Icon ? <Icon size={sizes.iconSmall} strokeWidth={sizes.iconStroke} color={colors.textMuted} /> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.accent}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: space[1] + 2,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: sizes.minTouch,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space[4],
    // Always reserve the border so focusing doesn't shift the layout.
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inset: {
    backgroundColor: colors.bg,
  },
  focused: {
    borderColor: colors.accent,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: space[3],
  },
});
