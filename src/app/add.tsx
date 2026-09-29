import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CatalogSearch } from '@/components/add/CatalogSearch';
import { EMPTY_DRAFT, ManualEntry, type ManualDraft } from '@/components/add/ManualEntry';
import { Button, Chip, SegmentedControl, Text } from '@/components/ui';
import type { BookStatus } from '@/lib/books';
import type { CatalogBook } from '@/lib/openLibrary';
import { colors, radius, space } from '@/theme';
import { useBooks } from '@/store/books';

type Mode = 'search' | 'manual';

const MODES = [
  { value: 'search', label: 'Search catalog' },
  { value: 'manual', label: 'Enter manually' },
] as const;

const STATUSES: { value: BookStatus; label: string }[] = [
  { value: 'want-to-read', label: 'To read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Read' },
];

// iOS presents this screen as a page sheet over the previous screen; Android shows it full screen.
const IS_SHEET = Platform.OS === 'ios';

export default function AddBookScreen() {
  const { books, addBook } = useBooks();
  const [mode, setMode] = useState<Mode>('search');
  const [status, setStatus] = useState<BookStatus>('want-to-read');
  const [draft, setDraft] = useState<ManualDraft>(EMPTY_DRAFT);
  // Bumped to remount the manual form when a catalog pick pre-fills it.
  const [draftVersion, setDraftVersion] = useState(0);

  const isAdded = (book: CatalogBook) => books.some((b) => b.openLibraryKey === book.key);

  const addFromCatalog = (book: CatalogBook) => {
    if (book.pages) {
      addBook({
        title: book.title,
        author: book.author,
        totalPages: book.pages,
        status,
        coverUrl: book.coverUrl,
        openLibraryKey: book.key,
      });
      return;
    }
    // Progress needs a page count; Open Library doesn't have one for every book.
    setDraft({
      title: book.title,
      author: book.author,
      pages: '',
      coverUrl: book.coverUrl,
      openLibraryKey: book.key,
      note: 'The catalog doesn’t list a page count for this book. Add it to track progress.',
    });
    setDraftVersion((v) => v + 1);
    setMode('manual');
  };

  return (
    // SafeAreaView measures its own native view: no top inset inside a sheet, status bar inset when full screen.
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {IS_SHEET ? <View style={styles.grabber} /> : null}

        <View style={styles.header}>
          <Text variant="sheetTitle" accessibilityRole="header">
            Add a book
          </Text>
          <Button label="Cancel" variant="outline" size="sm" onPress={() => router.back()} />
        </View>

        <SegmentedControl options={MODES} value={mode} onChange={setMode} />

        <View style={styles.statusRow} accessibilityRole="radiogroup" accessibilityLabel="Add to">
          <Text variant="secondary" color="textMuted">
            Add to
          </Text>
          {STATUSES.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={status === option.value}
              onPress={() => setStatus(option.value)}
            />
          ))}
        </View>

        <View style={styles.body}>
          {mode === 'search' ? (
            <CatalogSearch isAdded={isAdded} onAdd={addFromCatalog} />
          ) : (
            <ManualEntry
              key={draftVersion}
              initialDraft={draft}
              onSubmit={(book) => {
                addBook({ ...book, status });
                router.back();
              }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
    paddingTop: space[2],
    paddingHorizontal: space[4],
    gap: space[3],
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space[2],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  body: {
    flex: 1,
    marginTop: space[1],
  },
});
