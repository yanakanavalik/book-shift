import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, sizes, space, typography } from '@/theme';

import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: LucideIcon;
};

export function TextField({ label, icon: Icon, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="secondary" color="textMuted">
          {label}
        </Text>
      ) : null}
      <View style={styles.field}>
        {Icon ? <Icon size={sizes.iconSmall} strokeWidth={sizes.iconStroke} color={colors.textMuted} /> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.accent}
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
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: space[3],
  },
});
