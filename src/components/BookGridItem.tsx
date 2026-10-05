import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { BookCover, Text } from '@/components/ui';
import { bookStatus, progressPercent, STATUS_LABELS, type Book } from '@/lib/books';
import { bookHref } from '@/lib/routes';
import { space } from '@/theme';

/** Cover with title, status and length underneath; opens the book. */
export function BookGridItem({ book, width }: { book: Book; width: number }) {
  const status = bookStatus(book);
  const statusText = status === 'reading' ? `Reading · ${progressPercent(book)}%` : STATUS_LABELS[status];

  // Width lives on a plain wrapper: `Link asChild` doesn't reliably forward function-style `style`.
  return (
    <View style={{ width }}>
      <Link href={bookHref(book.id)} asChild>
        <Pressable
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          accessibilityLabel={`${book.title}${book.author ? ` by ${book.author}` : ''}, ${statusText}, ${book.totalPages} pages`}
        >
          <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} seed={book.id} width={width} />
          <Text variant="secondaryStrong" numberOfLines={2} style={styles.title}>
            {book.title}
          </Text>
          <Text variant="secondary" color="textMuted">
            {statusText}
          </Text>
          <Text variant="secondary" color="textMuted">
            {book.totalPages} pp
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    marginTop: space[2],
  },
});
