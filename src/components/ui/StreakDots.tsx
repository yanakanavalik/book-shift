import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, space } from '@/theme';

export type StreakDay = 'read' | 'missed' | 'today' | 'future';

// Coffee = read, steel = missed, cinnamon ring = today, outline = future.
const DAY_STYLES: Record<StreakDay, ViewStyle> = {
  read: { backgroundColor: colors.text },
  missed: { backgroundColor: colors.steel },
  today: { borderWidth: 2, borderColor: colors.accent },
  future: { borderWidth: 1, borderColor: colors.track },
};

const DAY_LABELS: Record<StreakDay, string> = {
  read: 'read',
  missed: 'missed',
  today: 'today',
  future: 'upcoming',
};

export function StreakDots({ days, size = 12 }: { days: StreakDay[]; size?: number }) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`Reading streak: ${days.map((day) => DAY_LABELS[day]).join(', ')}`}
    >
      {days.map((day, index) => (
        <View key={index} style={[styles.dot, { width: size, height: size }, DAY_STYLES[day]]} />
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
