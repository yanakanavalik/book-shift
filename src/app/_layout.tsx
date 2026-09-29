import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { BooksProvider, useBooks } from '@/store/books';
import { GoalsProvider, useGoals } from '@/store/goals';
import { OnboardingProvider, useOnboarding } from '@/store/onboarding';
import { colors, fontAssets, fonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <BooksProvider>
        <GoalsProvider>
          <StatusBar style="dark" />
          <RootStack />
        </GoalsProvider>
      </BooksProvider>
    </OnboardingProvider>
  );
}

function RootStack() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const { loaded: onboardingLoaded, hasSeenWelcome } = useOnboarding();
  const { loaded: booksLoaded } = useBooks();
  const { loaded: goalsLoaded } = useGoals();
  // If fonts fail to load, fall back to the system font rather than blocking the app.
  const ready = (fontsLoaded || !!fontError) && onboardingLoaded && booksLoaded && goalsLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  // Keep the splash up so returning users don't see the welcome screen, an empty library or unstyled text flash.
  if (!ready) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Protected guard={!hasSeenWelcome}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={hasSeenWelcome}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ title: 'Add a book', presentation: 'modal' }} />
        <Stack.Screen name="book/[id]" options={{ title: '' }} />
      </Stack.Protected>
    </Stack>
  );
}
