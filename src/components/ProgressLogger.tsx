import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, SegmentedControl, Text, TextField } from '@/components/ui';
import { progressPercent, targetPage, type Book, type ProgressInputMode } from '@/lib/books';
import { colors, sizes, space } from '@/theme';
import { useBooks } from '@/store/books';

const MODES = [
  { value: 'pages-read', label: 'Pages read' },
  { value: 'current-page', label: 'Now on page' },
] as const;

export type ProgressLoggerProps = {
  book: Book;
  /** Called after a successful save. */
  onSaved?: () => void;
  /** When provided, shows a Cancel link. */
  onCancel?: () => void;
  autoFocus?: boolean;
  /** `inset` for use on a peach card; `default` on the ground background. */
  tone?: 'default' | 'inset';
};

/** "Pages read" / "Now on page" entry with a live preview of where the book will land. */
export function ProgressLogger({ book, onSaved, onCancel, autoFocus, tone = 'inset' }: ProgressLoggerProps) {
  const { updateProgress } = useBooks();
  const [mode, setMode] = useState<ProgressInputMode>('pages-read');
  const [input, setInput] = useState('');

  const target = targetPage(book, mode, input);
  const canSave = target !== null && target !== book.currentPage;

  const save = () => {
    if (!canSave) return;
    updateProgress(book.id, target);
    setInput('');
    onSaved?.();
  };

  return (
    <View style={styles.logger}>
      <SegmentedControl options={MODES} value={mode} onChange={setMode} size="sm" tone={tone} />
      <View style={styles.inputRow}>
        <TextField
          tone={tone}
          value={input}
          onChangeText={(text) => setInput(text.replace(/[^0-9]/g, ''))}
          placeholder={mode === 'pages-read' ? 'Pages' : 'Page'}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={save}
          autoFocus={autoFocus}
          selectTextOnFocus
          accessibilityLabel={mode === 'pages-read' ? 'Pages read' : 'Current page'}
          containerStyle={styles.input}
        />
        <Button label="Save" size="md" onPress={save} disabled={!canSave} />
      </View>
      {target !== null || onCancel ? (
        <View style={styles.footer}>
          <View style={styles.preview} accessibilityLiveRegion="polite">
            {target !== null ? (
              <>
                <ArrowRight size={sizes.iconSmall} strokeWidth={sizes.iconStroke} color={colors.textMuted} />
                <Text variant="secondary" color="textMuted">
                  p. {target} of {book.totalPages} ·{' '}
                  {progressPercent({ currentPage: target, totalPages: book.totalPages })}%
                </Text>
              </>
            ) : null}
          </View>
          {onCancel ? <Button label="Cancel" variant="link" onPress={onCancel} style={styles.cancel} /> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  logger: {
    gap: space[2],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  input: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: sizes.controlHeightSmall,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  cancel: {
    alignSelf: 'auto',
    paddingHorizontal: 0,
    height: sizes.controlHeightSmall,
  },
});
