import { Minus, Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, IconButton, StatValue, Text } from '@/components/ui';
import { goalPace, MAX_GOAL, MIN_GOAL } from '@/lib/goals';
import { space } from '@/theme';
import { useGoals } from '@/store/goals';

/** Goal with −/+ steppers; used on the empty Home screen and the goal sheet. */
export function GoalEditorCard({ year }: { year: number }) {
  const { goalFor, setGoal } = useGoals();
  const { value, suggested } = goalFor(year);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="kicker">{year} goal</Text>
        {suggested ? (
          <Text variant="secondaryStrong" color="accentText">
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
        <StatValue
          value={value}
          unit="books this year"
          accessibilityLabel={`${value} books this year`}
          style={styles.value}
        />
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
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  value: {
    flex: 1,
  },
});
