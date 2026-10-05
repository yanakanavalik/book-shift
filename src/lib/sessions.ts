import { pad2 } from '@/lib/format';
import { amountOn, currentStreak, type DayLog, type ReadingLog } from '@/lib/streak';

/** Minutes read per local day. */
export type MinutesLog = DayLog;

/**
 * A reading session that can be paused. Time only accrues while running (`resumedAt` set).
 * Timestamps are ISO strings so a session survives the app being closed.
 */
export type ReadingSession = {
  bookId: string;
  startedAt: string;
  /** The page the reader was on when the session started. */
  startPage: number;
  /** Time read before the current run. */
  accumulatedMs: number;
  /** When the current run began; null while paused. */
  resumedAt: string | null;
};

export function createSession(bookId: string, startPage: number, now: Date): ReadingSession {
  const iso = now.toISOString();
  return { bookId, startedAt: iso, startPage, accumulatedMs: 0, resumedAt: iso };
}

/** Accepts sessions saved before pausing existed (no `accumulatedMs`). */
export function normalizeSession(session: ReadingSession): ReadingSession {
  if (typeof session.accumulatedMs === 'number') return session;
  return { ...session, startPage: session.startPage ?? 0, accumulatedMs: 0, resumedAt: session.startedAt };
}

export function isPaused(session: ReadingSession): boolean {
  return session.resumedAt === null;
}

export function elapsedMs(session: ReadingSession, now: Date): number {
  const running = session.resumedAt ? Math.max(0, now.getTime() - new Date(session.resumedAt).getTime()) : 0;
  return session.accumulatedMs + running;
}

export function pauseSession(session: ReadingSession, now: Date): ReadingSession {
  if (isPaused(session)) return session;
  return { ...session, accumulatedMs: elapsedMs(session, now), resumedAt: null };
}

export function resumeSession(session: ReadingSession, now: Date): ReadingSession {
  if (!isPaused(session)) return session;
  return { ...session, resumedAt: now.toISOString() };
}

/** Whole minutes credited for a session; any time read rounds up to the next minute. */
export function sessionMinutes(session: ReadingSession, now: Date): number {
  return Math.ceil(elapsedMs(session, now) / 60_000);
}

/** "00:02", "12:34", or "1:02:03" after an hour. */
export function formatClock(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0 ? `${hours}:${pad2(minutes)}:${pad2(seconds)}` : `${pad2(minutes)}:${pad2(seconds)}`;
}

/** Days with any reading — pages logged or time read — for streaks. */
export function readingActivity(pagesLog: ReadingLog, minutesLog: MinutesLog): ReadingLog {
  const activity: ReadingLog = { ...pagesLog };
  for (const [key, minutes] of Object.entries(minutesLog)) {
    if (minutes > 0) activity[key] = (activity[key] ?? 0) + minutes;
  }
  return activity;
}

/** Streak state as of `now`; logging pages or reading with the timer both count as a day read. */
export function readingStreak(pagesLog: ReadingLog, minutesLog: MinutesLog, now: Date) {
  const activity = readingActivity(pagesLog, minutesLog);
  return { activity, days: currentStreak(activity, now), readToday: amountOn(activity, now) > 0 };
}
