import { Link, router } from 'expo-router';
import { Timer } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BookProgress } from '@/components/BookProgress';
import { ProgressLogger } from '@/components/ProgressLogger';
import { BookCover, Button, Card, IconButton, Text } from '@/components/ui';
import type { Book } from '@/lib/books';
import { bookHref } from '@/lib/routes';
import { space } from '@/theme';
import { useBooks } from '@/store/books';
import { useSessions } from '@/store/sessions';

const COVER_WIDTH = 84;

/** A book in progress: reading timer, inline page logging, and marking it finished. */
export function CurrentlyReadingCard({ book }: { book: Book }) {
  const { finishBook } = useBooks();
  const { active, startSession } = useSessions();
  const [logging, setLogging] = useState(false);
  const timing = active?.bookId === book.id;

  const openTimer = () => {
    if (!timing) startSession(book.id, book.currentPage);
    router.push('/session');
  };

  return (
    <Card>
      <View style={styles.top}>
        <Link href={bookHref(book.id)} asChild>
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
          <View style={styles.titleRow}>
            <View style={styles.titles}>
              <Text variant="bookTitle" numberOfLines={2}>
                {book.title}
              </Text>
              {book.author ? (
                <Text variant="secondary" color="textMuted" numberOfLines={1}>
                  {book.author}
                </Text>
              ) : null}
            </View>
            <IconButton
              icon={Timer}
              tone="steel"
              active={timing}
              onPress={openTimer}
              accessibilityLabel={timing ? 'Show reading timer' : `Start reading timer for ${book.title}`}
            />
          </View>

          <BookProgress book={book} />

          {logging ? (
            <ProgressLogger
              book={book}
              autoFocus
              onSaved={() => setLogging(false)}
              onCancel={() => setLogging(false)}
            />
          ) : (
            <View style={styles.actions}>
              <Button label="Log pages" size="md" onPress={() => setLogging(true)} style={styles.action} />
              <Button
                label="Finished"
                variant="subtle"
                size="md"
                onPress={() => finishBook(book.id)}
                accessibilityLabel={`Mark ${book.title} as finished`}
                style={styles.action}
              />
            </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
  },
  titles: {
    flex: 1,
    gap: space[1],
  },
  actions: {
    flexDirection: 'row',
    gap: space[2],
  },
  action: {
    flex: 1,
    paddingHorizontal: space[2],
  },
});
