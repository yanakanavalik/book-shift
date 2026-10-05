import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Button, Text, TextField } from '@/components/ui';
import type { NewBook } from '@/lib/books';
import { digitsOnly } from '@/lib/format';
import { space } from '@/theme';

export type ManualDraft = {
  title: string;
  author: string;
  pages: string;
  coverUrl?: string;
  openLibraryKey?: string;
  /** Shown above the form, e.g. why a catalog pick needs more details. */
  note?: string;
};

export const EMPTY_DRAFT: ManualDraft = { title: '', author: '', pages: '' };

export type ManualEntryProps = {
  initialDraft: ManualDraft;
  onSubmit: (book: Omit<NewBook, 'status'>) => void;
};

export function ManualEntry({ initialDraft, onSubmit }: ManualEntryProps) {
  const [draft, setDraft] = useState(initialDraft);
  const update = (patch: Partial<ManualDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const totalPages = Number.parseInt(draft.pages, 10);
  const canSave = draft.title.trim().length > 0 && Number.isFinite(totalPages) && totalPages > 0;
  // A catalog pick arrives with its title filled in; jump straight to what's missing.
  const focusPages = initialDraft.title.length > 0 && initialDraft.pages.length === 0;

  const save = () => {
    if (!canSave) return;
    onSubmit({
      title: draft.title,
      author: draft.author,
      totalPages,
      coverUrl: draft.coverUrl,
      openLibraryKey: draft.openLibraryKey,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      {draft.note ? (
        <Text variant="secondary" color="accentText">
          {draft.note}
        </Text>
      ) : null}
      <TextField
        label="Title"
        value={draft.title}
        onChangeText={(title) => update({ title })}
        placeholder="e.g. The Salt Road"
        autoFocus={!focusPages}
        returnKeyType="next"
      />
      <TextField
        label="Author"
        value={draft.author}
        onChangeText={(author) => update({ author })}
        placeholder="Optional"
        returnKeyType="next"
      />
      <TextField
        label="Total pages"
        value={draft.pages}
        onChangeText={(text) => update({ pages: digitsOnly(text) })}
        placeholder="e.g. 340"
        keyboardType="number-pad"
        autoFocus={focusPages}
        returnKeyType="done"
        onSubmitEditing={save}
      />
      <Button label="Add a book" onPress={save} disabled={!canSave} style={styles.submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: space[4],
    paddingBottom: space[8],
  },
  submit: {
    marginTop: space[2],
  },
});
