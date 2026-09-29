import { StyleSheet, View } from 'react-native';

import type { StreakDay } from '@/lib/streak';
import { radius, space } from '@/theme';

import { STREAK_DAY_STYLES } from './StreakDots';
import { Text } from './Text';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** Monday-first grid of streak days; `days.length` must be a multiple of 7. Cells scale to the width. */
export function StreakCalendar({ days }: { days: StreakDay[] }) {
  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) => days.slice(i * 7, i * 7 + 7));
  const read = days.filter((day) => day === 'read' || day === 'todayRead').length;

  return (
    <View
      style={styles.grid}
      accessible
      accessibilityLabel={`Last ${weeks.length} weeks: read on ${read} ${read === 1 ? 'day' : 'days'}. ${
        days.includes('todayRead') ? 'Read today.' : 'Not read today yet.'
      }`}
    >
      <View style={styles.row}>
        {WEEKDAYS.map((label, i) => (
          <Text key={i} variant="kicker" color="textMuted" style={styles.weekday}>
            {label}
          </Text>
        ))}
      </View>
      {weeks.map((week, w) => (
        <View key={w} style={styles.row}>
          {week.map((day, d) => (
            <View key={d} style={[styles.cell, STREAK_DAY_STYLES[day]]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: space[1],
  },
  row: {
    flexDirection: 'row',
    gap: space[1],
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.circle,
  },
});
