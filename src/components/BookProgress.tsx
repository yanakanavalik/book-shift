import { StyleSheet, View } from 'react-native';

import { ProgressBar, Text } from '@/components/ui';
import { progressPercent, type Book } from '@/lib/books';
import { space } from '@/theme';

/** "p. 120 / 340 · 35%" above a progress bar. */
export function BookProgress({ book }: { book: Book }) {
  const percent = progressPercent(book);
  return (
    <View style={styles.progress}>
      <View style={styles.labels}>
        <Text variant="secondary" color="textMuted">
          p. {book.currentPage} / {book.totalPages}
        </Text>
        <Text variant="label">{percent}%</Text>
      </View>
      <ProgressBar percent={percent} />
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    gap: space[1] + 2,
  },
  labels: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
});
