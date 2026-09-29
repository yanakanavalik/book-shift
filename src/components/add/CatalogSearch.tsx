import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { BookCover, Button, Text, TextField } from '@/components/ui';
import { searchCatalog, type CatalogBook } from '@/lib/openLibrary';
import { colors, radius, space } from '@/theme';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

type SearchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'results'; books: CatalogBook[] }
  | { kind: 'error' };

export type CatalogSearchProps = {
  isAdded: (book: CatalogBook) => boolean;
  onAdd: (book: CatalogBook) => void;
};

export function CatalogSearch({ isAdded, onAdd }: CatalogSearchProps) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({ kind: 'idle' });
  const [retry, setRetry] = useState(0);
  const trimmed = query.trim();
  const active = trimmed.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    // Debounce keystrokes so we only query Open Library once typing pauses.
    const timer = setTimeout(() => {
      setState({ kind: 'loading' });
      searchCatalog(trimmed, controller.signal)
        .then((books) => setState({ kind: 'results', books }))
        .catch((error) => {
          if (!controller.signal.aborted) {
            console.warn(error);
            setState({ kind: 'error' });
          }
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, active, retry]);

  const visible = active ? state : ({ kind: 'idle' } as const);

  return (
    <View style={styles.container}>
      <TextField
        icon={Search}
        value={query}
        onChangeText={setQuery}
        placeholder="Title, author or ISBN"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Search catalog"
      />
      <FlatList
        data={visible.kind === 'results' ? visible.books : []}
        keyExtractor={(book) => book.key}
        renderItem={({ item }) => <ResultRow book={item} added={isAdded(item)} onAdd={() => onAdd(item)} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={<EmptyState state={visible} onRetry={() => setRetry((n) => n + 1)} />}
      />
    </View>
  );
}

function ResultRow({ book, added, onAdd }: { book: CatalogBook; added: boolean; onAdd: () => void }) {
  const meta = [book.author, book.year, book.pages ? `${book.pages} pp` : null].filter(Boolean).join(' · ');
  return (
    <View style={styles.row}>
      <BookCover title={book.title} coverUrl={book.coverUrl} seed={book.key} width={40} />
      <View style={styles.rowText}>
        <Text variant="label" numberOfLines={2}>
          {book.title}
        </Text>
        {meta ? (
          <Text variant="secondary" color="textMuted" numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
      <Button
        label={added ? 'Added' : 'Add'}
        variant="outline"
        size="sm"
        disabled={added}
        onPress={onAdd}
        accessibilityLabel={added ? `${book.title} added` : `Add ${book.title}`}
      />
    </View>
  );
}

function EmptyState({ state, onRetry }: { state: SearchState; onRetry: () => void }) {
  switch (state.kind) {
    case 'idle':
      return (
        <Text color="textMuted" style={styles.message}>
          Search millions of books from Open Library.
        </Text>
      );
    case 'loading':
      return <ActivityIndicator color={colors.accent} style={styles.message} />;
    case 'error':
      return (
        <View style={styles.message}>
          <Text color="textMuted" style={styles.centered}>
            Couldn’t reach the catalog. Check your connection.
          </Text>
          <Button label="Try again" variant="link" onPress={onRetry} />
        </View>
      );
    case 'results':
      return (
        <Text color="textMuted" style={styles.message}>
          No matches. Try another spelling, or enter the book manually.
        </Text>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: space[3],
  },
  list: {
    gap: space[2],
    paddingBottom: space[8],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[2],
    paddingRight: space[3],
    borderRadius: radius.listRow,
    backgroundColor: colors.surface,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  message: {
    marginTop: space[6],
    textAlign: 'center',
  },
  centered: {
    textAlign: 'center',
  },
});
