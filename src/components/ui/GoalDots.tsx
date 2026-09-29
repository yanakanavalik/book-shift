import { StyleSheet, View } from 'react-native';

import { colors, radius, space } from '@/theme';

import { ProgressBar } from './ProgressBar';

/** Past this many books, individual dots get too small to read; fall back to a bar. */
const MAX_DOTS = 60;

/** One dot per book in the goal: cinnamon = finished, tangerine = still to go. */
export function GoalDots({ finished, goal, size = 11 }: { finished: number; goal: number; size?: number }) {
  if (goal > MAX_DOTS) return <ProgressBar percent={(finished / goal) * 100} />;

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: goal, now: Math.min(finished, goal) }}
    >
      {Array.from({ length: goal }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { width: size, height: size },
            { backgroundColor: i < finished ? colors.accent : colors.track },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[1],
  },
  dot: {
    borderRadius: radius.circle,
  },
});
