import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookCover, Button, Text, TextField } from '@/components/ui';
import { useNow } from '@/hooks/useNow';
import { clampPage, type Book } from '@/lib/books';
import { digitsOnly, pluralize } from '@/lib/format';
import { elapsedMs, formatClock, isPaused, sessionMinutes, type ReadingSession } from '@/lib/sessions';
import { amountOn } from '@/lib/streak';
import { colors, radius, space } from '@/theme';
import { useBook, useBooks } from '@/store/books';
import { useSessions } from '@/store/sessions';

const COVER_WIDTH = 120;

/** Full-screen reading timer. "Minimize" leaves it running; "End session" pauses and asks for the page. */
export default function SessionScreen() {
  // `book` is set by deep links (e.g. the widget's "Start timer") to start a session directly.
  const { book: bookParam } = useLocalSearchParams<{ book?: string }>();
  // Explicit insets: SafeAreaView can measure zero inside a freshly presented full-screen modal.
  const insets = useSafeAreaInsets();
  const safeArea = { paddingTop: insets.top + space[2], paddingBottom: insets.bottom + space[2] };
  const { active, minutesLog, startSession, pause, resume } = useSessions();
  const book = useBook(active?.bookId ?? bookParam);
  const [ending, setEnding] = useState(false);
  const now = useNow();

  useEffect(() => {
    if (!active && book && bookParam) startSession(book.id, book.currentPage);
  }, [active, book, bookParam, startSession]);

  if (!active || !book) {
    return (
      <View style={[styles.screen, styles.center, safeArea]}>
        <Text color="textMuted">No reading session is running.</Text>
        <Button label="Close" variant="subtle" size="sm" onPress={() => router.back()} />
      </View>
    );
  }

  const paused = isPaused(active);
  const minutesToday = amountOn(minutesLog, now);

  const endSession = () => {
    pause();
    setEnding(true);
  };

  const keepReading = () => {
    resume();
    setEnding(false);
  };

  return (
    <View style={[styles.screen, safeArea]}>
      <View style={styles.header}>
        <Button label="Minimize" variant="subtle" size="sm" onPress={() => router.back()} />
        <Text variant="kicker" color="accentText">
          Reading session
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.cover}>
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            seed={book.id}
            width={COVER_WIDTH}
          />
        </View>
        <View style={styles.titles}>
          <Text variant="bookTitle" style={styles.centered}>
            {book.title}
          </Text>
          <Text variant="secondary" color="textMuted" style={styles.centered}>
            From p. {active.startPage} · {minutesToday}m read so far
          </Text>
        </View>
        <Text variant="timer" accessibilityRole="timer" accessibilityLabel="Time read" style={styles.centered}>
          {formatClock(elapsedMs(active, now))}
        </Text>
        <Text variant="secondaryStrong" color="steelText" accessibilityLiveRegion="polite">
          {paused ? 'Session paused' : 'Reading…'}
        </Text>
      </View>

      {ending ? (
        <EndSessionPanel book={book} session={active} now={now} onKeepReading={keepReading} />
      ) : (
        <View style={styles.actions}>
          <Button
            label={paused ? 'Resume' : 'Pause'}
            variant="subtle"
            onPress={paused ? resume : pause}
            style={[styles.action, styles.pause]}
          />
          <Button label="End session" onPress={endSession} style={styles.action} />
        </View>
      )}
    </View>
  );
}

function EndSessionPanel({
  book,
  session,
  now,
  onKeepReading,
}: {
  book: Book;
  session: ReadingSession;
  now: Date;
  onKeepReading: () => void;
}) {
  const { updateProgress } = useBooks();
  const { finishSession, discardSession } = useSessions();
  const [pageInput, setPageInput] = useState(String(book.currentPage));

  const page = clampPage(Number.parseInt(pageInput || '0', 10), book.totalPages);
  const newPages = Math.max(0, page - book.currentPage);
  const minutes = sessionMinutes(session, now);

  const save = () => {
    finishSession();
    if (page !== book.currentPage) updateProgress(book.id, page);
    router.back();
  };

  const confirmDiscard = () => {
    Alert.alert('Discard this session?', 'The time won’t be added to today.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          discardSession();
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.panel}>
        <Text variant="label">What page are you on now?</Text>
        <View style={styles.pageRow}>
          <TextField
            value={pageInput}
            onChangeText={(text) => setPageInput(digitsOnly(text))}
            keyboardType="number-pad"
            returnKeyType="done"
            selectTextOnFocus
            autoFocus
            accessibilityLabel="Current page"
            containerStyle={styles.pageInput}
          />
          <Text variant="secondary" color="textMuted">
            of {book.totalPages}
          </Text>
        </View>
        <Text variant="secondary" color="textMuted">
          {minutes} min · {newPages > 0 ? pluralize(newPages, 'new page') : 'no new pages'}
        </Text>
        <Button label="Save session" onPress={save} />
        <View style={styles.panelLinks}>
          <Button label="Keep reading" variant="plain" inline onPress={onKeepReading} />
          <Button label="Discard session" variant="link" inline onPress={confirmDiscard} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceSteel,
    paddingHorizontal: space[4],
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[3],
  },
  cover: {
    borderRadius: radius.cover,
    shadowColor: colors.text,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginBottom: space[2],
  },
  titles: {
    alignItems: 'center',
    gap: 2,
  },
  centered: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: space[3],
  },
  action: {
    flex: 1,
  },
  pause: {
    backgroundColor: colors.bg,
  },
  panel: {
    backgroundColor: colors.bg,
    borderRadius: radius.cards,
    padding: space[4],
    gap: space[3],
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  pageInput: {
    flex: 1,
  },
  panelLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
