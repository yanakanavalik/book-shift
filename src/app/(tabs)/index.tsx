import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { EmptyShelfCard } from '@/components/home/EmptyShelfCard';
import { GoalCard } from '@/components/home/GoalCard';
import { StreakCard } from '@/components/home/StreakCard';
import { useTabScreenPadding } from '@/components/tabScreen';
import { Button, Card, Text } from '@/components/ui';
import { bookStatus } from '@/lib/books';
import { formatLongDate, greeting } from '@/lib/dates';
import { space } from '@/theme';
import { useBooks } from '@/store/books';

export default function HomeScreen() {
  const padding = useTabScreenPadding();
  const { books } = useBooks();
  const now = new Date();
  const reading = books.filter((book) => bookStatus(book) === 'reading');

  return (
    <ScrollView contentContainerStyle={[styles.content, padding]}>
      <View style={styles.header}>
        <Text variant="kicker" color="accentText">
          {formatLongDate(now)}
        </Text>
        <Text variant="screenTitle" accessibilityRole="header">
          {greeting(now)}
        </Text>
      </View>

      {books.length === 0 ? (
        <EmptyShelfCard />
      ) : (
        // Placeholder until the populated Home design lands.
        <View style={styles.section}>
          <Text variant="kicker" color="accentText">
            Currently reading
          </Text>
          {reading.length > 0 ? (
            reading.map((book) => <BookCard key={book.id} book={book} />)
          ) : (
            <Card>
              <Text color="textMuted">Nothing in progress. Pick your next book from your shelf.</Text>
              <Button label="Go to My books" variant="outline" size="sm" onPress={() => router.push('/books')} />
            </Card>
          )}
        </View>
      )}

      <GoalCard year={now.getFullYear()} />
      <StreakCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space[4],
    gap: space[3],
  },
  header: {
    gap: space[1],
    marginBottom: space[1],
  },
  section: {
    gap: space[3],
  },
});
