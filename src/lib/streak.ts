/** Pages read per local day, keyed by `YYYY-MM-DD`. */
export type ReadingLog = Record<string, number>;

/**
 * - `read`: pages logged that day
 * - `missed`: no pages, after the first day anything was logged
 * - `today` / `todayRead`: today, before and after logging pages
 * - `future`: later this week
 * - `empty`: before the first logged day — not counted as missed
 */
export type StreakDay = 'read' | 'missed' | 'today' | 'todayRead' | 'future' | 'empty';

export function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Calendar arithmetic (not milliseconds) so DST changes don't skip or repeat a day.
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function logPages(log: ReadingLog, pages: number, date: Date): ReadingLog {
  if (pages <= 0) return log;
  const key = dateKey(date);
  return { ...log, [key]: (log[key] ?? 0) + pages };
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

/** Monday-first calendar of the last `weeks` weeks, ending with the current week. */
export function streakCalendar(log: ReadingLog, today: Date, weeks = 3): StreakDay[] {
  const todayKey = dateKey(today);
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = addDays(today, -mondayOffset - 7 * (weeks - 1));
  // ISO date strings sort chronologically.
  const firstLogged = Object.keys(log)
    .filter((key) => log[key] > 0)
    .sort()[0];

  return Array.from({ length: weeks * 7 }, (_, i) => {
    const key = dateKey(addDays(start, i));
    if (key === todayKey) return log[key] ? 'todayRead' : 'today';
    if (key > todayKey) return 'future';
    if (log[key]) return 'read';
    return firstLogged && key > firstLogged ? 'missed' : 'empty';
  });
}

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** The last `count` days ending today, oldest first, with weekday initials, e.g. for a one-row streak. */
export function recentDays(log: ReadingLog, today: Date, count = 7): { letter: string; state: StreakDay }[] {
  const todayKey = dateKey(today);
  const firstLogged = Object.keys(log)
    .filter((key) => log[key] > 0)
    .sort()[0];
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(today, i - count + 1);
    const key = dateKey(date);
    const state: StreakDay =
      key === todayKey
        ? log[key]
          ? 'todayRead'
          : 'today'
        : log[key]
          ? 'read'
          : firstLogged && key > firstLogged
            ? 'missed'
            : 'empty';
    return { letter: WEEKDAY_LETTERS[date.getDay()], state };
  });
}
