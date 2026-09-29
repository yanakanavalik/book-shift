import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '@/components/ProgressBar';
import { progressPercent, type Book } from '@/lib/books';
import { colors, spacing } from '@/lib/theme';

export function BookCard({ book }: { book: Book }) {
  const percent = progressPercent(book);
  return (
    <Link href={{ pathname: '/book/[id]', params: { id: book.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.header}>
          <View style={styles.titles}>
            <Text style={styles.title} numberOfLines={2}>
              {book.title}
            </Text>
            {book.author ? <Text style={styles.author}>{book.author}</Text> : null}
          </View>
          <Text style={styles.percent}>{percent}%</Text>
        </View>
        <ProgressBar percent={percent} />
        <Text style={styles.pages}>
          Page {book.currentPage} of {book.totalPages}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  author: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  percent: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  pages: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
