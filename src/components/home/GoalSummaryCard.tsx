import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, GoalDots, StatValue, Text } from '@/components/ui';
import { booksFinishedIn } from '@/lib/goals';
import { sizes, space } from '@/theme';
import { useBooks } from '@/store/books';
import { useGoals } from '@/store/goals';

export function GoalSummaryCard({ year }: { year: number }) {
  const { books } = useBooks();
  const { goalFor } = useGoals();
  const goal = goalFor(year).value;
  const finished = booksFinishedIn(year, books);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="kicker">{year} goal</Text>
        <Button label="Edit" variant="outline" size="sm" onPress={() => router.push('/goal')} />
      </View>
      <StatValue value={finished} unit={`/ ${goal} books`} accessibilityLabel={`${finished} of ${goal} books read`} />
      <GoalDots finished={finished} goal={goal} />
      <Text variant="secondaryStrong" color="accentText">
        {finished >= goal ? 'Goal reached' : `${goal - finished} to go`}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: sizes.controlHeightSmall,
  },
});
