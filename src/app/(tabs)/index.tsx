import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CurrentlyReadingCard } from '@/components/home/CurrentlyReadingCard';
import { EmptyShelfCard } from '@/components/home/EmptyShelfCard';
import { GoalEditorCard } from '@/components/home/GoalEditorCard';
import { GoalSummaryCard } from '@/components/home/GoalSummaryCard';
import { StartReadingCard } from '@/components/home/StartReadingCard';
import { StreakCard } from '@/components/home/StreakCard';
import { StreakSummaryCard } from '@/components/home/StreakSummaryCard';
import { TodayCard } from '@/components/home/TodayCard';
import { SessionChipOverlay } from '@/components/SessionChip';
import { useTabScreenPadding } from '@/components/tabScreen';
import { LinkButton, Text } from '@/components/ui';
import { booksWithStatus } from '@/lib/books';
import { formatLongDate, greeting } from '@/lib/dates';
import { pad2 } from '@/lib/format';
import { space } from '@/theme';
import { useBooks } from '@/store/books';

export default function HomeScreen() {
  const padding = useTabScreenPadding();
  const { books } = useBooks();
  const now = new Date();
  const year = now.getFullYear();

  return (
    <>
      <ScrollView contentContainerStyle={[styles.content, padding]} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text variant="kicker" color="accentText">
            {formatLongDate(now)}
          </Text>
          <Text variant="screenTitle" accessibilityRole="header">
            {greeting(now)}
          </Text>
        </View>

        {books.length === 0 ? (
          <>
            <EmptyShelfCard />
            <GoalEditorCard year={year} />
            <StreakCard />
          </>
        ) : (
          <>
            <CurrentlyReading />
            <View style={styles.statsRow}>
              <GoalSummaryCard year={year} />
              <StreakSummaryCard now={now} />
            </View>
            <TodayCard now={now} />
            <LinkButton label={`All my books · ${books.length}`} onPress={() => router.navigate('/books')} />
          </>
        )}
      </ScrollView>
      <SessionChipOverlay />
    </>
  );
}

function CurrentlyReading() {
  const { books } = useBooks();
  const reading = booksWithStatus(books, 'reading');

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="kicker">Currently reading</Text>
        <Text variant="kicker" accessibilityLabel={`${reading.length} books`}>
          {pad2(reading.length)}
        </Text>
      </View>
      {reading.length > 0 ? (
        reading.map((book) => <CurrentlyReadingCard key={book.id} book={book} />)
      ) : (
        <StartReadingCard />
      )}
    </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space[2],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: space[3],
  },
});
