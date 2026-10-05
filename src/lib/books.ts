export type BookStatus = 'want-to-read' | 'reading' | 'finished';

export const STATUS_LABELS: Record<BookStatus, string> = {
  'want-to-read': 'To read',
  reading: 'Reading',
  finished: 'Read',
};

export type Book = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  /** Optional for books saved before status was stored; see `bookStatus`. */
  status?: BookStatus;
  coverUrl?: string;
  /** Open Library work key, e.g. "/works/OL893414W", for books added from the catalog. */
  openLibraryKey?: string;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
};

export type NewBook = {
  title: string;
  author: string;
  totalPages: number;
  status?: BookStatus;
  coverUrl?: string;
  openLibraryKey?: string;
};

export function clampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page)) return 0;
  return Math.min(Math.max(Math.round(page), 0), totalPages);
}

export function progressPercent(book: Pick<Book, 'currentPage' | 'totalPages'>): number {
  if (book.totalPages <= 0) return 0;
  return Math.round((book.currentPage / book.totalPages) * 100);
}

export function bookStatus(book: Pick<Book, 'currentPage' | 'totalPages' | 'status'>): BookStatus {
  if (book.status) return book.status;
  if (book.currentPage <= 0) return 'want-to-read';
  if (book.currentPage >= book.totalPages) return 'finished';
  return 'reading';
}

export function createBook(input: NewBook, now: Date = new Date()): Book {
  const timestamp = now.toISOString();
  const totalPages = Math.max(1, Math.round(input.totalPages));
  const status = input.status ?? 'want-to-read';
  const finished = status === 'finished';
  return {
    id: `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    author: input.author.trim(),
    totalPages,
    currentPage: finished ? totalPages : 0,
    status,
    coverUrl: input.coverUrl,
    openLibraryKey: input.openLibraryKey,
    createdAt: timestamp,
    updatedAt: timestamp,
    finishedAt: finished ? timestamp : undefined,
  };
}

export function withCurrentPage(book: Book, page: number, now: Date = new Date()): Book {
  const currentPage = clampPage(page, book.totalPages);
  const finished = currentPage >= book.totalPages;
  // Page 0 keeps a "reading" book as reading (just started); otherwise the page decides.
  const status: BookStatus = finished
    ? 'finished'
    : currentPage > 0 || bookStatus(book) === 'reading'
      ? 'reading'
      : 'want-to-read';
  return {
    ...book,
    currentPage,
    status,
    updatedAt: now.toISOString(),
    finishedAt: finished ? (book.finishedAt ?? now.toISOString()) : undefined,
  };
}

/**
 * Marks a book as being read, e.g. "Start" on a to-read book. `startPage` is where the reader already is
 * (0 = from the beginning); it isn't logged as pages read today.
 */
export function startReading(book: Book, startPage = 0, now: Date = new Date()): Book {
  const currentPage = Math.min(clampPage(startPage, book.totalPages), book.totalPages - 1);
  return { ...book, status: 'reading', currentPage, finishedAt: undefined, updatedAt: now.toISOString() };
}

/** Marks a book as read (last page) without treating the jump as pages read today. */
export function finishReading(book: Book, now: Date = new Date()): Book {
  return withCurrentPage(book, book.totalPages, now);
}

export type BookFilter = 'all' | BookStatus;

/** Library view: status filter plus case- and accent-insensitive title/author search, newest activity first. */
export function filterBooks(books: Book[], filter: BookFilter, query: string): Book[] {
  const needle = normalize(query.trim());
  return books
    .filter((book) => filter === 'all' || bookStatus(book) === filter)
    .filter((book) => !needle || normalize(`${book.title} ${book.author}`).includes(needle))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Books with one status, newest activity first. */
export function booksWithStatus(books: Book[], status: BookStatus): Book[] {
  return filterBooks(books, status, '');
}

export function countByStatus(books: Book[]): Record<BookFilter, number> {
  const counts: Record<BookFilter, number> = { all: books.length, reading: 0, finished: 0, 'want-to-read': 0 };
  for (const book of books) counts[bookStatus(book)]++;
  return counts;
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase();
}

export type ProgressInputMode = 'pages-read' | 'current-page';

/**
 * The page a progress entry lands on: "pages read" adds to the current page, "now on page" sets it.
 * Returns null for empty or invalid input.
 */
export function targetPage(
  book: Pick<Book, 'currentPage' | 'totalPages'>,
  mode: ProgressInputMode,
  input: string,
): number | null {
  const value = Number.parseInt(input, 10);
  if (!Number.isFinite(value) || value < 0) return null;
  return clampPage(mode === 'pages-read' ? book.currentPage + value : value, book.totalPages);
}
