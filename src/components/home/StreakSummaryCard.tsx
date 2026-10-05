import { StyleSheet, View } from 'react-native';

import { Card, StatValue, StreakCalendar, Text } from '@/components/ui';
import { readingStreak } from '@/lib/sessions';
import { streakCalendar } from '@/lib/streak';
import { sizes, space } from '@/theme';
import { useBooks } from '@/store/books';
import { useSessions } from '@/store/sessions';

export function StreakSummaryCard({ now }: { now: Date }) {
  const { readingLog } = useBooks();
  const { minutesLog } = useSessions();
  const { activity, days: streak, readToday } = readingStreak(readingLog, minutesLog, now);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="kicker">Streak</Text>
      </View>
      <StatValue value={streak} unit={streak === 1 ? 'day' : 'days'} accessibilityLabel={`${streak} day streak`} />
      <StreakCalendar days={streakCalendar(activity, now)} />
      <Text variant="secondaryStrong" color="steelText">
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
});
