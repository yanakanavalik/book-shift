import { StyleSheet, View } from 'react-native';

import { colors, coverStyles, radius, space } from '@/theme';

// Book spines as fractions of the panel height, so the shelf scales with the screen.
const SPINES = [
  { width: 34, height: 0.62, color: coverStyles[1].background },
  { width: 26, height: 0.48, color: coverStyles[2].background },
  { width: 40, height: 0.74, color: coverStyles[0].background },
  { width: 30, height: 0.56, color: coverStyles[3].background },
  { width: 36, height: 0.66, color: coverStyles[5].background },
  { width: 24, height: 0.44, color: colors.accentText },
];

export function BookshelfIllustration({ height = 240 }: { height?: number }) {
  return (
    <View style={[styles.panel, { height }]} accessible={false} importantForAccessibility="no-hide-descendants">
      {SPINES.map((spine, index) => (
        <View
          key={index}
          style={[styles.spine, { width: spine.width, height: height * spine.height, backgroundColor: spine.color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.hero,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: space[1] + 2,
  },
  spine: {
    borderTopLeftRadius: radius.coverSmall,
    borderTopRightRadius: radius.coverSmall,
  },
});
