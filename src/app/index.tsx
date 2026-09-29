import { Link, Stack } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { bookStatus } from '@/lib/books';
import { colors, spacing } from '@/lib/theme';
import { useBooks } from '@/store/books';

const STATUS_ORDER = { reading: 0, 'want-to-read': 1, finished: 2 } as const;

export default function LibraryScreen() {
  const { books, loaded } = useBooks();

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

  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/add" asChild>
              <Pressable hitSlop={12} accessibilityLabel="Add book">
                <Text style={styles.headerButton}>Add</Text>
              </Pressable>
            </Link>
          ),
        }}
      />
      <FlatList
        data={sorted}
        keyExtractor={(book) => book.id}
        renderItem={({ item }) => <BookCard book={item} />}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          books.length > 0 ? (
            <Text style={styles.summary}>
              {readingCount} reading · {finishedCount} finished
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No books yet</Text>
            <Text style={styles.emptyText}>Add the book you&apos;re reading to start tracking progress.</Text>
            <Link href="/add" asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Add a book</Text>
              </Pressable>
            </Link>
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
    flexGrow: 1,
  },
  summary: {
    fontSize: 14,
    color: colors.textMuted,
  },
  headerButton: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});
