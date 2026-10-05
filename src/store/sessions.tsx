import { useCallback, useMemo, type ReactNode } from 'react';

import {
  createSession,
  normalizeSession,
  pauseSession,
  resumeSession,
  sessionMinutes,
  type MinutesLog,
  type ReadingSession,
} from '@/lib/sessions';
import { addToDay } from '@/lib/streak';

import { createStoreContext, usePersistedState } from './persisted';

const STORAGE_KEY = 'book-shift/sessions/v1';

type Stored = { active: ReadingSession | null; minutesLog: MinutesLog };

const storedSessions = {
  decode: (raw: string): Stored => {
    const stored = JSON.parse(raw) as Stored;
    return { ...stored, active: stored.active ? normalizeSession(stored.active) : null };
  },
  encode: (state: Stored) => JSON.stringify(state),
};

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

const [Provider, useSessions] = createStoreContext<SessionsContextValue>('Sessions');
export { useSessions };

/** Credits a session's minutes to the day it ends. */
function credit(log: MinutesLog, session: ReadingSession | null, now: Date): MinutesLog {
  return session ? addToDay(log, sessionMinutes(session, now), now) : log;
}

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [state, setState, loaded] = usePersistedState<Stored>(
    STORAGE_KEY,
    { active: null, minutesLog: {} },
    'reading sessions',
    storedSessions,
  );

  const updateActive = useCallback(
    (update: (session: ReadingSession, now: Date) => ReadingSession) =>
      setState((prev) => (prev.active ? { ...prev, active: update(prev.active, new Date()) } : prev)),
    [setState],
  );

  const startSession = useCallback(
    (bookId: string, startPage: number) => {
      const now = new Date();
      setState((prev) => ({
        active: createSession(bookId, startPage, now),
        minutesLog: credit(prev.minutesLog, prev.active, now),
      }));
    },
    [setState],
  );

  const pause = useCallback(() => updateActive(pauseSession), [updateActive]);
  const resume = useCallback(() => updateActive(resumeSession), [updateActive]);

  const finishSession = useCallback(() => {
    if (!state.active) return 0;
    const now = new Date();
    const minutes = sessionMinutes(state.active, now);
    setState((prev) => ({ active: null, minutesLog: credit(prev.minutesLog, prev.active, now) }));
    return minutes;
  }, [state.active, setState]);

  const discardSession = useCallback(() => setState((prev) => ({ ...prev, active: null })), [setState]);

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

  return <Provider value={value}>{children}</Provider>;
}
