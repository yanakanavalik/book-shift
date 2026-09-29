import { router } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

import { BookGridItem } from '@/components/BookGridItem';
import { useTabScreenPadding } from '@/components/tabScreen';
import { Button, SegmentedControl, Text, TextField } from '@/components/ui';
import { countByStatus, filterBooks, type BookFilter } from '@/lib/books';
import { space } from '@/theme';
import { useBooks } from '@/store/books';

const COLUMNS = 3;
const SCREEN_EDGE = space[4];
const COLUMN_GAP = space[3];

export default function LibraryScreen() {
  const padding = useTabScreenPadding();
  const { width: windowWidth } = useWindowDimensions();
  const { books } = useBooks();
  const [filter, setFilter] = useState<BookFilter>('all');
  const [query, setQuery] = useState('');

  const counts = countByStatus(books);
  const visible = useMemo(() => filterBooks(books, filter, query), [books, filter, query]);
  const itemWidth = Math.floor((windowWidth - SCREEN_EDGE * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS);

  const filters = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'reading', label: 'Reading', count: counts.reading },
    { value: 'finished', label: 'Read', count: counts.finished },
    { value: 'want-to-read', label: 'To read', count: counts['want-to-read'] },
  ] as const;

  return (
    <FlatList
      data={visible}
      keyExtractor={(book) => book.id}
      numColumns={COLUMNS}
      renderItem={({ item }) => <BookGridItem book={item} width={itemWidth} />}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.list, padding]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.titles}>
              <Text variant="kicker" color="accentText">
                {books.length} {books.length === 1 ? 'book' : 'books'}
              </Text>
              <Text variant="screenTitle" accessibilityRole="header">
                My books
              </Text>
            </View>
            <Button label="Add book" icon={Plus} onPress={() => router.push('/add')} style={styles.addButton} />
          </View>
          {books.length > 0 ? (
            <>
              <TextField
                icon={Search}
                value={query}
                onChangeText={setQuery}
                placeholder="Search title or author"
                autoCorrect={false}
                returnKeyType="search"
                clearButtonMode="while-editing"
                accessibilityLabel="Search my books"
              />
              <SegmentedControl options={filters} value={filter} onChange={setFilter} size="sm" />
            </>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        books.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="sheetTitle">No books yet</Text>
            <Text color="textMuted" style={styles.centered}>
              Add the book you&apos;re reading to start tracking progress.
            </Text>
          </View>
        ) : (
          <View style={styles.empty}>
            <Text color="textMuted" style={styles.centered}>
              {query.trim() ? `No books match “${query.trim()}”.` : 'No books here yet.'}
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_EDGE,
    gap: space[6],
    flexGrow: 1,
  },
  row: {
    gap: COLUMN_GAP,
  },
  header: {
    gap: space[3],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space[3],
  },
  titles: {
    flexShrink: 1,
    gap: space[1],
  },
  addButton: {
    paddingHorizontal: space[4],
  },
  empty: {
    alignItems: 'center',
    gap: space[2],
    paddingTop: space[8],
    paddingHorizontal: space[6],
  },
  centered: {
    textAlign: 'center',
  },
});
