import { StyleSheet, View } from 'react-native';

import { Card, StreakCalendar, Text } from '@/components/ui';
import { currentStreak, dateKey, streakCalendar } from '@/lib/streak';
import { sizes, space } from '@/theme';
import { useBooks } from '@/store/books';

export function StreakSummaryCard({ now }: { now: Date }) {
  const { readingLog } = useBooks();
  const streak = currentStreak(readingLog, now);
  const readToday = !!readingLog[dateKey(now)];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="kicker">Streak</Text>
      </View>
      <View style={styles.value} accessible accessibilityLabel={`${streak} day streak`}>
        <Text variant="stat">{streak}</Text>
        <Text variant="secondary" color="textMuted">
          {streak === 1 ? 'day' : 'days'}
        </Text>
      </View>
      <StreakCalendar days={streakCalendar(readingLog, now)} />
      <Text variant="secondaryStrong" color="accentText">
        {readToday ? 'You read today' : 'Read today to keep it'}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: space[3],
  },
  // Matches the goal card header height so the stats line up across the row.
  header: {
    minHeight: sizes.controlHeightSmall,
    justifyContent: 'center',
  },
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1] + 2,
  },
});
