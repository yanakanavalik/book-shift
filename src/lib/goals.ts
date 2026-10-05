import { pluralize } from '@/lib/format';

export const SUGGESTED_GOAL = 24;
export const MIN_GOAL = 1;
export const MAX_GOAL = 365;

export function clampGoal(goal: number): number {
  return Math.min(Math.max(Math.round(goal), MIN_GOAL), MAX_GOAL);
}

/** Human pace for a yearly goal, e.g. "About 2 books a month." */
export function goalPace(goal: number): string {
  const perMonth = goal / 12;
  if (perMonth >= 1) {
    const books = Math.round(perMonth);
    return `About ${pluralize(books, 'book')} a month.`;
  }
  const months = Math.round(12 / goal);
  return months === 1 ? 'About one book a month.' : `About one book every ${months} months.`;
}

/** Books finished in a given calendar year (local time). */
export function booksFinishedIn(year: number, books: { finishedAt?: string }[]): number {
  return books.filter((book) => book.finishedAt && new Date(book.finishedAt).getFullYear() === year).length;
}

