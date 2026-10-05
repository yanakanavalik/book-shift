import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { BooksProvider, useBooks } from '@/store/books';
import { GoalsProvider, useGoals } from '@/store/goals';
import { OnboardingProvider, useOnboarding } from '@/store/onboarding';
import { SessionsProvider, useSessions } from '@/store/sessions';
import { colors, fontAssets, radius } from '@/theme';
import { useWidgetSync } from '@/widgets/useWidgetSync';

SplashScreen.preventAutoHideAsync();

const sheetOptions = {
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  sheetCornerRadius: radius.sheet,
  sheetGrabberVisible: false,
} as const;

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <BooksProvider>
        <GoalsProvider>
          <SessionsProvider>
            <StatusBar style="dark" />
            <RootStack />
          </SessionsProvider>
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
  const { loaded: sessionsLoaded } = useSessions();
  useWidgetSync();
  // If fonts fail to load, fall back to the system font rather than blocking the app.
  const ready = (fontsLoaded || !!fontError) && onboardingLoaded && booksLoaded && goalsLoaded && sessionsLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  // Keep the splash up so returning users don't see the welcome screen, an empty library or unstyled text flash.
  if (!ready) return null;

  return (
    // Every screen draws its own title, so the native header is off throughout.
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Protected guard={!hasSeenWelcome}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>
      <Stack.Protected guard={hasSeenWelcome}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" options={{ presentation: 'modal' }} />
        <Stack.Screen name="goal" options={{ presentation: 'modal' }} />
        {/* Native sheet (UISheetPresentationController on iOS), sized to its content. */}
        <Stack.Screen name="book/[id]" options={sheetOptions} />
        <Stack.Screen
          name="session"
          options={{ presentation: 'fullScreenModal', contentStyle: { backgroundColor: colors.surfaceSteel } }}
        />
      </Stack.Protected>
    </Stack>
  );
}
