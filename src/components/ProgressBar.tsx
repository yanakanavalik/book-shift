import { StyleSheet, View } from 'react-native';

import { colors } from '@/lib/theme';

export function ProgressBar({ percent, height = 8 }: { percent: number; height?: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2 }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, borderRadius: height / 2 },
          clamped === 100 && { backgroundColor: colors.success },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});
