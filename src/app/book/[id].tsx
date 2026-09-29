import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProgressBar } from '@/components/ProgressBar';
import { bookStatus, progressPercent } from '@/lib/books';
import { colors, spacing } from '@/lib/theme';
import { useBooks } from '@/store/books';

const STATUS_LABEL = {
  'want-to-read': 'Not started',
  reading: 'Reading',
  finished: 'Finished',
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
        <Text style={styles.muted}>This book no longer exists.</Text>
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
        <Text style={styles.title}>{book.title}</Text>
        {book.author ? <Text style={styles.author}>{book.author}</Text> : null}
        <Text style={styles.status}>{STATUS_LABEL[bookStatus(book)]}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.percent}>{percent}%</Text>
        <ProgressBar percent={percent} height={12} />
        <Text style={styles.muted}>
          Page {book.currentPage} of {book.totalPages} · {book.totalPages - book.currentPage} left
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Update progress</Text>
        <View style={styles.stepperRow}>
          <StepButton label="−10" onPress={() => setPage(book.currentPage - 10)} />
          <StepButton label="−1" onPress={() => setPage(book.currentPage - 1)} />
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
            accessibilityLabel="Current page"
          />
          <StepButton label="+1" onPress={() => setPage(book.currentPage + 1)} />
          <StepButton label="+10" onPress={() => setPage(book.currentPage + 10)} />
        </View>
        {bookStatus(book) !== 'finished' ? (
          <Pressable style={styles.primaryButton} onPress={() => setPage(book.totalPages)}>
            <Text style={styles.primaryButtonText}>Mark as finished</Text>
          </Pressable>
        ) : null}
      </View>

      <Pressable onPress={confirmDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete book</Text>
      </Pressable>
    </ScrollView>
  );
}

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.stepButton, pressed && { opacity: 0.6 }]}
      accessibilityLabel={`${label} pages`}
    >
      <Text style={styles.stepText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  headerBlock: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  author: {
    fontSize: 17,
    color: colors.textMuted,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  percent: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  muted: {
    fontSize: 14,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.track,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  pageInput: {
    flex: 1.4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  primaryButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 16,
  },
});
