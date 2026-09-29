import { StyleSheet, View, type ViewStyle } from 'react-native';

import type { StreakDay } from '@/lib/streak';
import { colors, radius, space } from '@/theme';

export type { StreakDay };

// Steel = read, tangerine = missed, dark steel ring = today, outline = future.
export const STREAK_DAY_STYLES: Record<StreakDay, ViewStyle> = {
  read: { backgroundColor: colors.streakRead },
  missed: { backgroundColor: colors.streakMissed },
  today: { borderWidth: 2, borderColor: colors.streakToday },
  todayRead: { backgroundColor: colors.streakRead, borderWidth: 2, borderColor: colors.streakToday },
  future: { borderWidth: 1, borderColor: colors.streakFuture },
  empty: { borderWidth: 1, borderColor: colors.streakFuture },
};

export const STREAK_DAY_LABELS: Record<StreakDay, string> = {
  read: 'read',
  missed: 'missed',
  today: 'today, not read yet',
  todayRead: 'today, read',
  future: 'upcoming',
  empty: 'no activity',
};

export function StreakDots({ days, size = 12 }: { days: StreakDay[]; size?: number }) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`Reading streak: ${days.map((day) => STREAK_DAY_LABELS[day]).join(', ')}`}
    >
      {days.map((day, index) => (
        <View key={index} style={[styles.dot, { width: size, height: size }, STREAK_DAY_STYLES[day]]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[1],
  },
  dot: {
    borderRadius: radius.circle,
  },
});
