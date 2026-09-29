import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { useTabScreenPadding } from '@/components/tabScreen';
import { Button, Text } from '@/components/ui';
import { bookStatus } from '@/lib/books';
import { space } from '@/theme';
import { useBooks } from '@/store/books';

const STATUS_ORDER = { reading: 0, 'want-to-read': 1, finished: 2 } as const;

export default function LibraryScreen() {
  const padding = useTabScreenPadding();
  const { books } = useBooks();

  const sorted = useMemo(
    () =>
      [...books].sort(
        (a, b) =>
          STATUS_ORDER[bookStatus(a)] - STATUS_ORDER[bookStatus(b)] ||
          b.updatedAt.localeCompare(a.updatedAt),
      ),
    [books],
  );

  const readingCount = books.filter((b) => bookStatus(b) === 'reading').length;
  const finishedCount = books.filter((b) => bookStatus(b) === 'finished').length;

  return (
    <FlatList
      data={sorted}
      keyExtractor={(book) => book.id}
      renderItem={({ item }) => <BookCard book={item} />}
      contentContainerStyle={[styles.list, padding]}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text variant="screenTitle" accessibilityRole="header">
              My books
            </Text>
            <Button
              label="Add"
              variant="outline"
              size="sm"
              accessibilityLabel="Add book"
              onPress={() => router.push('/add')}
            />
          </View>
          {books.length > 0 ? (
            <Text variant="kicker" color="accentText">
              {readingCount} reading · {finishedCount} read
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text variant="sheetTitle">No books yet</Text>
          <Text color="textMuted" style={styles.emptyText}>
            Add the book you&apos;re reading to start tracking progress.
          </Text>
          <Button label="Add a book" icon={Plus} onPress={() => router.push('/add')} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: space[4],
    gap: space[3],
    flexGrow: 1,
  },
  header: {
    gap: space[2],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    padding: space[6],
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: space[2],
  },
});
