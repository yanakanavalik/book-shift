import { router } from 'expo-router';
import { Timer } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, StatValue, Text } from '@/components/ui';
import { pluralize } from '@/lib/format';
import { isPaused } from '@/lib/sessions';
import { amountOn } from '@/lib/streak';
import { colors, radius, sizes, space } from '@/theme';
import { useBooks } from '@/store/books';
import { useSessions } from '@/store/sessions';

/** Time read today, on a steel surface (steel = time and streaks). Opens the running session, if any. */
export function TodayCard({ now }: { now: Date }) {
  const { readingLog } = useBooks();
  const { active, minutesLog } = useSessions();
  const minutes = amountOn(minutesLog, now);
  const pages = amountOn(readingLog, now);

  const note = active
    ? isPaused(active)
      ? 'session paused'
      : 'reading now'
    : pages > 0
      ? pluralize(pages, 'page')
      : minutes > 0
        ? 'read today'
        : 'no reading yet';

  return (
    <Pressable
      disabled={!active}
      onPress={() => router.push('/session')}
      accessibilityRole={active ? 'button' : undefined}
      accessibilityLabel={`Today: ${minutes} minutes, ${note}`}
    >
      <Card variant="steel" style={styles.card}>
        <View style={styles.icon}>
          <Timer size={sizes.icon} strokeWidth={sizes.iconStroke} color={colors.text} />
        </View>
        <View style={styles.text}>
          <Text variant="kicker" color="steelText">
            Today
          </Text>
          <StatValue variant="sheetTitle" value={`${minutes} min`} unit={note} accessibilityLabel={`${minutes} minutes, ${note}`} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  icon: {
    width: sizes.minTouch,
    height: sizes.minTouch,
    borderRadius: radius.circle,
    backgroundColor: colors.steel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
