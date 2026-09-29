import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'book-shift/onboarding/v1';

type OnboardingContextValue = {
  loaded: boolean;
  hasSeenWelcome: boolean;
  completeWelcome: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setHasSeenWelcome(raw === 'done'))
      .catch((error) => console.warn('Failed to load onboarding state', error))
      .finally(() => setLoaded(true));
  }, []);

  const completeWelcome = useCallback(() => {
    setHasSeenWelcome(true);
    AsyncStorage.setItem(STORAGE_KEY, 'done').catch((error) =>
      console.warn('Failed to save onboarding state', error),
    );
  }, []);

  const value = useMemo(
    () => ({ loaded, hasSeenWelcome, completeWelcome }),
    [loaded, hasSeenWelcome, completeWelcome],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  return context;
}
