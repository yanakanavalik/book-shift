import { useCallback, useMemo, type ReactNode } from 'react';

import { createStoreContext, usePersistedState } from './persisted';

const STORAGE_KEY = 'book-shift/onboarding/v1';

// Stored as the string "done" once the welcome screen has been seen.
const doneFlag = { decode: (raw: string) => raw === 'done', encode: (seen: boolean) => (seen ? 'done' : null) };

type OnboardingContextValue = {
  loaded: boolean;
  hasSeenWelcome: boolean;
  completeWelcome: () => void;
};

const [Provider, useOnboarding] = createStoreContext<OnboardingContextValue>('Onboarding');
export { useOnboarding };

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasSeenWelcome, setHasSeenWelcome, loaded] = usePersistedState(
    STORAGE_KEY,
    false,
    'onboarding state',
    doneFlag,
  );

  const completeWelcome = useCallback(() => setHasSeenWelcome(true), [setHasSeenWelcome]);

  const value = useMemo(
    () => ({ loaded, hasSeenWelcome, completeWelcome }),
    [loaded, hasSeenWelcome, completeWelcome],
  );

  return <Provider value={value}>{children}</Provider>;
}
