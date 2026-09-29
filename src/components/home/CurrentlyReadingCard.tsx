import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProgressLogger } from '@/components/ProgressLogger';
import { BookCover, Button, Card, ProgressBar, Text } from '@/components/ui';
import { progressPercent, type Book } from '@/lib/books';
import { space } from '@/theme';

const COVER_WIDTH = 84;

/** A book in progress, with inline page logging. */
export function CurrentlyReadingCard({ book }: { book: Book }) {
  const [logging, setLogging] = useState(false);
  const percent = progressPercent(book);

  return (
    <Card>
      <View style={styles.top}>
        <Link href={{ pathname: '/book/[id]', params: { id: book.id } }} asChild>
          <Pressable accessibilityLabel={`Open ${book.title}`}>
            <BookCover
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              seed={book.id}
              width={COVER_WIDTH}
            />
          </Pressable>
        </Link>

        <View style={styles.details}>
          <View>
            <Text variant="bookTitle" numberOfLines={2}>
              {book.title}
            </Text>
            {book.author ? (
              <Text variant="secondary" color="textMuted" numberOfLines={1}>
                {book.author}
              </Text>
            ) : null}
          </View>

          <View style={styles.progress}>
            <View style={styles.progressLabels}>
              <Text variant="secondary" color="textMuted">
                p. {book.currentPage} / {book.totalPages}
              </Text>
              <Text variant="label">{percent}%</Text>
            </View>
            <ProgressBar percent={percent} />
          </View>

          {logging ? (
            <ProgressLogger
              book={book}
              autoFocus
              onSaved={() => setLogging(false)}
              onCancel={() => setLogging(false)}
            />
          ) : (
            <Button label="Log pages" variant="outline" size="sm" onPress={() => setLogging(true)} />
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    gap: space[4],
  },
  details: {
    flex: 1,
    gap: space[3],
  },
  progress: {
    gap: space[1] + 2,
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
});
