import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { BookCover, Button, Card, Text } from '@/components/ui';
import { filterBooks } from '@/lib/books';
import { space } from '@/theme';
import { useBooks } from '@/store/books';

const MAX_SUGGESTIONS = 3;

/** Shown when nothing is in progress: suggests to-read books to start. */
export function StartReadingCard() {
  const { books, startBook } = useBooks();
  const toRead = filterBooks(books, 'want-to-read', '').slice(0, MAX_SUGGESTIONS);

  if (toRead.length === 0) {
    return (
      <Card>
        <Text color="textMuted">Nothing on the go. Add a book to start your next read.</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text color="textMuted">Nothing on the go. Start one from your list:</Text>
      {toRead.map((book) => (
        <View key={book.id} style={styles.row}>
          <Link href={{ pathname: '/book/[id]', params: { id: book.id } }} asChild>
            <Pressable style={styles.book} accessibilityLabel={`Open ${book.title}`}>
              <BookCover title={book.title} coverUrl={book.coverUrl} seed={book.id} width={36} />
              <View style={styles.text}>
                <Text variant="label" numberOfLines={1}>
                  {book.title}
                </Text>
                <Text variant="secondary" color="textMuted" numberOfLines={1}>
                  {[book.author, `${book.totalPages} pp`].filter(Boolean).join(' · ')}
                </Text>
              </View>
            </Pressable>
          </Link>
          <Button label="Start" size="sm" onPress={() => startBook(book.id)} accessibilityLabel={`Start ${book.title}`} />
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  book: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
