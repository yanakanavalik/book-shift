import { ArrowRight } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, sizes, space } from '@/theme';

import { Text } from './Text';

/** Full-width outlined pill that navigates somewhere: label on the left, arrow on the right. */
export function LinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text variant="label">{label}</Text>
      <ArrowRight size={sizes.iconSmall} strokeWidth={sizes.iconStroke} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: sizes.controlHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[6],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineSoft,
  },
  pressed: {
    opacity: 0.75,
  },
});
