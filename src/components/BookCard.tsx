import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, ProgressBar, Text } from '@/components/ui';
import { progressPercent, type Book } from '@/lib/books';
import { space } from '@/theme';

export function BookCard({ book }: { book: Book }) {
  const percent = progressPercent(book);
  return (
    <Link href={{ pathname: '/book/[id]', params: { id: book.id } }} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <Card>
          <View style={styles.header}>
            <View style={styles.titles}>
              <Text variant="bookTitle" numberOfLines={2}>
                {book.title}
              </Text>
              <Text variant="secondary" color="textMuted">
                {[book.author, `${book.totalPages} pp`].filter(Boolean).join(' · ')}
              </Text>
            </View>
            <Text variant="label" color="accentText">
              {percent}%
            </Text>
          </View>
          <ProgressBar percent={percent} />
          <Text variant="secondary" color="textMuted">
            p. {book.currentPage} / {book.totalPages}
          </Text>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
  },
  titles: {
    flex: 1,
    gap: 2,
  },
});
