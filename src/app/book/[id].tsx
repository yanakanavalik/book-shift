import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button, Card, ProgressBar, Text } from '@/components/ui';
import { bookStatus, progressPercent } from '@/lib/books';
import { colors, radius, sizes, space, typography } from '@/theme';
import { useBooks } from '@/store/books';

const STATUS_LABEL = {
  'want-to-read': 'To read',
  reading: 'Currently reading',
  finished: 'Read',
} as const;

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books, updateProgress, removeBook } = useBooks();
  const book = books.find((b) => b.id === id);
  // Holds typed text only while the page field is being edited; otherwise it mirrors the book.
  const [pageDraft, setPageDraft] = useState<string | null>(null);

  if (!book) {
    return (
      <View style={styles.center}>
        <Text color="textMuted">This book no longer exists.</Text>
      </View>
    );
  }

  const percent = progressPercent(book);
  const setPage = (page: number) => updateProgress(book.id, page);

  const confirmDelete = () => {
    Alert.alert('Delete book?', `"${book.title}" and its progress will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          router.back();
          removeBook(book.id);
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: book.title }} />

      <View style={styles.headerBlock}>
        <Text variant="kicker" color="accentText">
          {STATUS_LABEL[bookStatus(book)]}
        </Text>
        <Text variant="sheetTitle">{book.title}</Text>
        {book.author ? <Text color="textMuted">{book.author}</Text> : null}
      </View>

      <Card>
        <View style={styles.progressHeader}>
          <Text variant="stat">{percent}%</Text>
          <Text variant="secondary" color="textMuted">
            {book.totalPages - book.currentPage} pages left
          </Text>
        </View>
        <ProgressBar percent={percent} height={8} />
        <Text variant="secondary" color="textMuted">
          p. {book.currentPage} / {book.totalPages}
        </Text>
      </Card>

      <Card style={styles.updateCard}>
        <Text variant="kicker" color="textMuted">
          Update progress
        </Text>
        <View style={styles.stepperRow}>
          <StepButton delta={-10} onPress={() => setPage(book.currentPage - 10)} />
          <StepButton delta={-1} onPress={() => setPage(book.currentPage - 1)} />
          <TextInput
            style={styles.pageInput}
            value={pageDraft ?? String(book.currentPage)}
            onChangeText={(text) => setPageDraft(text.replace(/[^0-9]/g, ''))}
            onEndEditing={() => {
              if (pageDraft !== null) setPage(Number.parseInt(pageDraft || '0', 10));
              setPageDraft(null);
            }}
            keyboardType="number-pad"
            returnKeyType="done"
            selectTextOnFocus
            selectionColor={colors.accent}
            accessibilityLabel="Current page"
          />
          <StepButton delta={1} onPress={() => setPage(book.currentPage + 1)} />
          <StepButton delta={10} onPress={() => setPage(book.currentPage + 10)} />
        </View>
        {bookStatus(book) !== 'finished' ? (
          <Button label="Mark as read" onPress={() => setPage(book.totalPages)} />
        ) : null}
      </Card>

      <Button label="Delete book" variant="link" onPress={confirmDelete} />
    </ScrollView>
  );
}

function StepButton({ delta, onPress }: { delta: number; onPress: () => void }) {
  const label = delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`;
  return (
    <Button
      label={label}
      variant="outline"
      size="sm"
      onPress={onPress}
      style={styles.stepButton}
      accessibilityLabel={`${delta > 0 ? 'Forward' : 'Back'} ${Math.abs(delta)} pages`}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: space[4],
    gap: space[3],
  },
  headerBlock: {
    gap: space[1],
    marginBottom: space[2],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  updateCard: {
    gap: space[3],
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  stepButton: {
    flex: 1,
    paddingHorizontal: 0,
  },
  pageInput: {
    ...typography.label,
    flex: 1.4,
    height: sizes.minTouch,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    textAlign: 'center',
    color: colors.text,
  },
});
