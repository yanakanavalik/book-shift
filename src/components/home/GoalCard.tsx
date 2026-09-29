import { Minus, Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, IconButton, Text } from '@/components/ui';
import { goalPace, MAX_GOAL, MIN_GOAL } from '@/lib/goals';
import { fonts, space } from '@/theme';
import { useGoals } from '@/store/goals';

export function GoalCard({ year }: { year: number }) {
  const { goalFor, setGoal } = useGoals();
  const { value, suggested } = goalFor(year);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="kicker">{year} goal</Text>
        {suggested ? (
          <Text variant="secondary" color="accentText" style={styles.suggested}>
            Suggested
          </Text>
        ) : null}
      </View>

      <View style={styles.stepper}>
        <IconButton
          icon={Minus}
          accessibilityLabel="Decrease goal"
          onPress={() => setGoal(year, value - 1)}
          disabled={value <= MIN_GOAL}
        />
        <View style={styles.value} accessible accessibilityLabel={`${value} books this year`}>
          <Text variant="stat">{value}</Text>
          <Text variant="secondary" color="textMuted">
            books this year
          </Text>
        </View>
        <IconButton
          icon={Plus}
          accessibilityLabel="Increase goal"
          onPress={() => setGoal(year, value + 1)}
          disabled={value >= MAX_GOAL}
        />
      </View>

      <Text variant="secondary" color="textMuted">
        {goalPace(value)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggested: {
    fontFamily: fonts.semibold,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1] + 2,
  },
});
