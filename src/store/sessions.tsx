import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  createSession,
  logMinutes,
  normalizeSession,
  pauseSession,
  resumeSession,
  sessionMinutes,
  type MinutesLog,
  type ReadingSession,
} from '@/lib/sessions';

const STORAGE_KEY = 'book-shift/sessions/v1';

type Stored = { active: ReadingSession | null; minutesLog: MinutesLog };

type SessionsContextValue = {
  loaded: boolean;
  /** The current reading session, running or paused. Only one at a time. */
  active: ReadingSession | null;
  minutesLog: MinutesLog;
  /** Starts timing a book from `startPage`; credits any session already open. */
  startSession: (bookId: string, startPage: number) => void;
  pause: () => void;
  resume: () => void;
  /** Ends the session and credits its minutes to today. Returns the minutes credited. */
  finishSession: () => number;
  /** Ends the session without crediting any time. */
  discardSession: () => void;
};

const SessionsContext = createContext<SessionsContextValue | null>(null);

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<Stored>({ active: null, minutesLog: {} });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const stored = JSON.parse(raw) as Stored;
        setState({ ...stored, active: stored.active ? normalizeSession(stored.active) : null });
      })
      .catch((error) => console.warn('Failed to load reading sessions', error))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    // Don't overwrite stored data with the empty initial state before it has loaded.
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) =>
      console.warn('Failed to save reading sessions', error),
    );
  }, [state, loaded]);

  const startSession = useCallback((bookId: string, startPage: number) => {
    const now = new Date();
    setState((prev) => ({
      active: createSession(bookId, startPage, now),
      minutesLog: prev.active ? logMinutes(prev.minutesLog, sessionMinutes(prev.active, now), now) : prev.minutesLog,
    }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => (prev.active ? { ...prev, active: pauseSession(prev.active, new Date()) } : prev));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => (prev.active ? { ...prev, active: resumeSession(prev.active, new Date()) } : prev));
  }, []);

  const finishSession = useCallback(() => {
    if (!state.active) return 0;
    const now = new Date();
    const minutes = sessionMinutes(state.active, now);
    setState((prev) => ({ active: null, minutesLog: logMinutes(prev.minutesLog, minutes, now) }));
    return minutes;
  }, [state.active]);

  const discardSession = useCallback(() => {
    setState((prev) => ({ ...prev, active: null }));
  }, []);

  const value = useMemo(
    () => ({
      loaded,
      active: state.active,
      minutesLog: state.minutesLog,
      startSession,
      pause,
      resume,
      finishSession,
      discardSession,
    }),
    [loaded, state, startSession, pause, resume, finishSession, discardSession],
  );

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}

export function useSessions(): SessionsContextValue {
  const context = useContext(SessionsContext);
  if (!context) throw new Error('useSessions must be used inside <SessionsProvider>');
  return context;
}
