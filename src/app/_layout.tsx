import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/lib/theme';
import { BooksProvider } from '@/store/books';

export default function RootLayout() {
  return (
    <BooksProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'My Books' }} />
        <Stack.Screen name="add" options={{ title: 'Add Book', presentation: 'modal' }} />
        <Stack.Screen name="book/[id]" options={{ title: '' }} />
      </Stack>
    </BooksProvider>
  );
}
