import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, TextField } from '@/components/ui';
import { space } from '@/theme';
import { useBooks } from '@/store/books';

export default function AddBookScreen() {
  const { addBook } = useBooks();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');

  const totalPages = Number.parseInt(pages, 10);
  const canSave = title.trim().length > 0 && Number.isFinite(totalPages) && totalPages > 0;

  const save = () => {
    if (!canSave) return;
    addBook({ title, author, totalPages });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. The Salt Road"
          autoFocus
          returnKeyType="next"
        />
        <TextField
          label="Author"
          value={author}
          onChangeText={setAuthor}
          placeholder="Optional"
          returnKeyType="next"
        />
        <TextField
          label="Total pages"
          value={pages}
          onChangeText={(text) => setPages(text.replace(/[^0-9]/g, ''))}
          placeholder="e.g. 340"
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={save}
        />
        <Button label="Add a book" onPress={save} disabled={!canSave} style={styles.submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  form: {
    padding: space[4],
    gap: space[4],
  },
  submit: {
    marginTop: space[2],
  },
});
