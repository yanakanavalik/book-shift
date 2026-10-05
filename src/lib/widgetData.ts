import { bookStatus, progressPercent, type Book } from '@/lib/books';
import { booksFinishedIn } from '@/lib/goals';
import { readingActivity, type MinutesLog } from '@/lib/sessions';
import { addDays, currentStreak, dateKey, recentDays, type ReadingLog, type StreakDay } from '@/lib/streak';
import { colors, coverStyleFor, palette } from '@/theme';

/** Must match `scheme` in app.json. Widgets only run in development/production builds, where it applies. */
const APP_URL = 'bookshift://';

/**
 * Colors handed to the widget. Widget code runs in an isolated runtime and can't import the theme,
 * so the design tokens travel with the props.
 */
export const WIDGET_COLORS = {
  background: colors.bg,
  surface: colors.surface,
  text: colors.text,
  textMuted: colors.textMuted,
  accent: colors.accent,
  accentText: colors.accentText,
  onAccent: colors.onAccent,
  track: colors.track,
  divider: colors.divider,
  readTodayChip: colors.selected,
  notReadChip: palette.tangerine,
  streakRead: colors.streakRead,
  streakMissed: colors.streakMissed,
  streakToday: colors.streakToday,
  streakEmpty: colors.streakFuture,
} as const;

export type WidgetColors = typeof WIDGET_COLORS;

export type WidgetBook = {
  id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  percent: number;
  cover: { background: string; text: string; border?: string };
  url: string;
  /** Opens the session sheet and starts timing this book. */
  timerUrl: string;
};

export type ReadingWidgetProps = {
  /** `empty` when nothing is in progress: widgets show "Add a book to start". */
  state: 'empty' | 'active';
  colors: WidgetColors;
  today: {
    readToday: boolean;
    /** Minutes read today with the timer, e.g. "34m". */
    value: string;
  };
  streak: {
    days: number;
    label: string;
    week: { letter: string; state: StreakDay }[];
  };
  /** The book opened most recently in the app, or the most recently updated one in progress. */
  current: WidgetBook | null;
  /** Up to three books in progress, current first. */
  reading: WidgetBook[];
  goal: { year: number; finished: number; target: number };
  urls: { home: string; add: string };
};

export type WidgetInput = {
  books: Book[];
  readingLog: ReadingLog;
  minutesLog: MinutesLog;
  goal: number;
  lastOpenedId: string | null;
  now: Date;
};

const MAX_READING = 3;

function toWidgetBook(book: Book): WidgetBook {
  const cover = coverStyleFor(book.id);
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    currentPage: book.currentPage,
    totalPages: book.totalPages,
    percent: progressPercent(book),
    cover: { background: cover.background, text: cover.text, border: 'border' in cover ? cover.border : undefined },
    url: `${APP_URL}book/${book.id}`,
    timerUrl: `${APP_URL}session?book=${encodeURIComponent(book.id)}`,
  };
}

export function buildWidgetProps({
  books,
  readingLog,
  minutesLog,
  goal,
  lastOpenedId,
  now,
}: WidgetInput): ReadingWidgetProps {
  const inProgress = books
    .filter((book) => bookStatus(book) === 'reading')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const current = inProgress.find((book) => book.id === lastOpenedId) ?? inProgress[0] ?? null;
  const reading = current ? [current, ...inProgress.filter((book) => book !== current)].slice(0, MAX_READING) : [];

  // Logging pages or reading with the timer both count as a day read.
  const activity = readingActivity(readingLog, minutesLog);
  const readToday = !!activity[dateKey(now)];
  const streak = currentStreak(activity, now);

  return {
    state: current ? 'active' : 'empty',
    colors: WIDGET_COLORS,
    today: { readToday, value: `${minutesLog[dateKey(now)] ?? 0}m` },
    streak: {
      days: streak,
      label: readToday
        ? `${streak}-day streak`
        : streak > 0
          ? `Keep your ${streak}-day streak`
          : 'Start a streak today',
      week: recentDays(activity, now),
    },
    current: current ? toWidgetBook(current) : null,
    reading: reading.map(toWidgetBook),
    goal: { year: now.getFullYear(), finished: booksFinishedIn(now.getFullYear(), books), target: goal },
    urls: { home: APP_URL, add: `${APP_URL}add` },
  };
}

const TIMELINE_DAYS = 3;

/**
 * Now plus the next few midnights, so "Read today" and the streak roll over even if the app isn't opened.
 */
export function buildWidgetTimeline(input: WidgetInput): { date: Date; props: ReadingWidgetProps }[] {
  const midnights = Array.from({ length: TIMELINE_DAYS }, (_, i) => addDays(input.now, i + 1));
  return [input.now, ...midnights].map((date) => ({ date, props: buildWidgetProps({ ...input, now: date }) }));
}
