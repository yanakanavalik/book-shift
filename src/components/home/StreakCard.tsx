import { StyleSheet } from 'react-native';

import { Card, StreakDots, Text } from '@/components/ui';
import { space } from '@/theme';

/** Empty state: shown until the user has logged pages on at least one day. */
export function StreakCard() {
  return (
    <Card variant="dashed" style={styles.card}>
      <StreakDots days={['today', 'future', 'future', 'future']} />
      <Text variant="secondary" color="textMuted" style={styles.text}>
        Your reading streak starts the first day you log pages.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  text: {
    flex: 1,
  },
});
