import { pad2 } from '@/lib/format';

/** An amount per local day, keyed by `YYYY-MM-DD`. */
export type DayLog = Record<string, number>;

/** Pages read per local day. */
export type ReadingLog = DayLog;

/**
 * - `read`: pages logged that day
 * - `missed`: no pages, after the first day anything was logged
 * - `today` / `todayRead`: today, before and after logging pages
 * - `future`: later this week
 * - `empty`: before the first logged day — not counted as missed
 */
export type StreakDay = 'read' | 'missed' | 'today' | 'todayRead' | 'future' | 'empty';

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

// Calendar arithmetic (not milliseconds) so DST changes don't skip or repeat a day.
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The amount logged on a day, or 0. */
export function amountOn(log: DayLog, date: Date): number {
  return log[dateKey(date)] ?? 0;
}

/** Adds `amount` (pages, minutes) to the day; non-positive amounts are ignored. */
export function addToDay(log: DayLog, amount: number, date: Date): DayLog {
  if (amount <= 0) return log;
  const key = dateKey(date);
  return { ...log, [key]: (log[key] ?? 0) + amount };
}

/** Consecutive days with pages logged, ending today — or yesterday, so the streak survives until today is over. */
export function currentStreak(log: ReadingLog, today: Date): number {
  let day = log[dateKey(today)] ? today : addDays(today, -1);
  let streak = 0;
  while (log[dateKey(day)]) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

/** Classifies each day for streak displays. */
function streakDays(log: ReadingLog, today: Date, days: Date[]): StreakDay[] {
  const todayKey = dateKey(today);
  // ISO date strings sort chronologically.
  const firstLogged = Object.keys(log)
    .filter((key) => log[key] > 0)
    .sort()[0];

  return days.map((date) => {
    const key = dateKey(date);
    if (key === todayKey) return log[key] ? 'todayRead' : 'today';
    if (key > todayKey) return 'future';
    if (log[key]) return 'read';
    return firstLogged && key > firstLogged ? 'missed' : 'empty';
  });
}

/** Monday-first calendar of the last `weeks` weeks, ending with the current week. */
export function streakCalendar(log: ReadingLog, today: Date, weeks = 3): StreakDay[] {
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = addDays(today, -mondayOffset - 7 * (weeks - 1));
  const days = Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
  return streakDays(log, today, days);
}

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** The last `count` days ending today, oldest first, with weekday initials, e.g. for a one-row streak. */
export function recentDays(log: ReadingLog, today: Date, count = 7): { letter: string; state: StreakDay }[] {
  const days = Array.from({ length: count }, (_, i) => addDays(today, i - count + 1));
  const states = streakDays(log, today, days);
  return days.map((date, i) => ({ letter: WEEKDAY_LETTERS[date.getDay()], state: states[i] }));
}
