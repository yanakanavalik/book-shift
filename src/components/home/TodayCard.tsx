import { router } from 'expo-router';
import { Timer } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { isPaused } from '@/lib/sessions';
import { dateKey } from '@/lib/streak';
import { colors, radius, sizes, space } from '@/theme';
import { useBooks } from '@/store/books';
import { useSessions } from '@/store/sessions';

/** Time read today, on a steel surface (steel = time and streaks). Opens the running session, if any. */
export function TodayCard({ now }: { now: Date }) {
  const { readingLog } = useBooks();
  const { active, minutesLog } = useSessions();
  const key = dateKey(now);
  const minutes = minutesLog[key] ?? 0;
  const pages = readingLog[key] ?? 0;

  const note = active
    ? isPaused(active)
      ? 'session paused'
      : 'reading now'
    : pages > 0
      ? `${pages} ${pages === 1 ? 'page' : 'pages'}`
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
          <View style={styles.value}>
            <Text variant="sheetTitle">{minutes} min</Text>
            <Text variant="secondary" color="textMuted">
              {note}
            </Text>
          </View>
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
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1] + 2,
  },
});
