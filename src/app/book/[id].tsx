import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookProgress } from '@/components/BookProgress';
import { ProgressLogger } from '@/components/ProgressLogger';
import { BookCover, Button, Card, SheetGrabber, StatusBadge, Text, TextField } from '@/components/ui';
import { bookStatus, type Book } from '@/lib/books';
import { formatDate } from '@/lib/dates';
import { digitsOnly, joinMeta } from '@/lib/format';
import { colors, radius, space } from '@/theme';
import { useBook, useBooks } from '@/store/books';

const COVER_WIDTH = 96;

/** Native bottom sheet for a book in the library, sized to its content. */
export default function BookSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { removeBook, markOpened } = useBooks();
  const book = useBook(id);
  const found = !!book;

  // The small widget shows the book opened last.
  useEffect(() => {
    if (found) markOpened(id);
  }, [found, id, markOpened]);

  // iOS already adds the bottom inset to fit-to-content sheets; Android doesn't.
  const sheetStyle = [styles.sheet, { paddingBottom: Platform.OS === 'ios' ? space[2] : insets.bottom + space[4] }];

  if (!book) {
    return (
      <View style={sheetStyle}>
        <Text color="textMuted">This book is no longer in your library.</Text>
      </View>
    );
  }

  const status = bookStatus(book);

  const confirmRemove = () => {
    Alert.alert('Remove from list?', `"${book.title}" and its progress will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          router.back();
          removeBook(book.id);
        },
      },
    ]);
  };

  return (
    <View style={sheetStyle}>
      <SheetGrabber style={styles.grabber} />

      <View style={styles.header}>
        <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} seed={book.id} width={COVER_WIDTH} />
        <View style={styles.details}>
          <StatusBadge status={status} />
          <Text variant="sheetTitle" accessibilityRole="header" numberOfLines={3}>
            {book.title}
          </Text>
          <Text variant="secondary" color="textMuted">
            {joinMeta(book.author, `${book.totalPages} pp`)}
          </Text>
          <Text variant="secondary" color="textMuted" style={styles.description}>
            {describe(book)}
          </Text>
        </View>
      </View>

      {status === 'want-to-read' ? <StartReading book={book} /> : null}
      {status === 'reading' ? <InProgress book={book} /> : null}

      <Button label="Remove from list" variant="subtle" onPress={confirmRemove} />
    </View>
  );
}

function StartReading({ book }: { book: Book }) {
  const { startBook } = useBooks();
  const [startPage, setStartPage] = useState('');

  const start = () => {
    startBook(book.id, Number.parseInt(startPage || '0', 10));
    router.back();
  };

  return (
    <>
      <Card style={styles.startCard}>
        <View style={styles.startText}>
          <Text variant="label">Starting page</Text>
          <Text variant="secondary" color="textMuted">
            Leave at 0 to start from the beginning
          </Text>
        </View>
        <TextField
          tone="inset"
          value={startPage}
          onChangeText={(text) => setStartPage(digitsOnly(text))}
          placeholder="0"
          keyboardType="number-pad"
          returnKeyType="done"
          selectTextOnFocus
          accessibilityLabel="Starting page"
          containerStyle={styles.startInput}
          style={styles.startInputText}
        />
      </Card>
      <Button label="Start reading" onPress={start} />
    </>
  );
}

function InProgress({ book }: { book: Book }) {
  const { finishBook } = useBooks();

  return (
    <>
      <Card style={styles.progressCard}>
        <BookProgress book={book} />
        <ProgressLogger book={book} />
      </Card>
      <Button label="Mark as read" onPress={() => finishBook(book.id)} />
    </>
  );
}

function describe(book: Book): string {
  switch (bookStatus(book)) {
    case 'want-to-read':
      return 'On your list';
    case 'reading':
      return `${book.totalPages - book.currentPage} pages to go`;
    case 'finished':
      return book.finishedAt ? `Finished ${formatDate(new Date(book.finishedAt))}` : 'Finished';
  }
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.bg,
    paddingHorizontal: space[4],
    paddingTop: space[2],
    gap: space[3],
  },
  grabber: {
    marginBottom: space[2],
  },
  header: {
    flexDirection: 'row',
    gap: space[4],
    marginBottom: space[1],
  },
  details: {
    flex: 1,
    gap: space[1],
  },
  description: {
    marginTop: space[1],
  },
  startCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    borderRadius: radius.listRow,
  },
  startText: {
    flex: 1,
    gap: 2,
  },
  startInput: {
    width: 84,
  },
  startInputText: {
    textAlign: 'center',
  },
  progressCard: {
    gap: space[2],
  },
});
