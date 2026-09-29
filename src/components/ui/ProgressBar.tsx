import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

/** Cinnamon fill on a tangerine track. */
export function ProgressBar({ percent, height = 6 }: { percent: number; height?: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <View
      style={[styles.track, { height }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View style={[styles.fill, { width: `${clamped}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
});
