import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing } from '@/lib/theme';
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
        <Field label="Title">
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. The Left Hand of Darkness"
            placeholderTextColor={colors.textMuted}
            autoFocus
            returnKeyType="next"
          />
        </Field>
        <Field label="Author">
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Optional"
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
        </Field>
        <Field label="Total pages">
          <TextInput
            style={styles.input}
            value={pages}
            onChangeText={(text) => setPages(text.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 304"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={save}
          />
        </Field>
        <Pressable
          style={[styles.button, !canSave && styles.buttonDisabled]}
          onPress={save}
          disabled={!canSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  form: {
    padding: spacing.md,
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});
