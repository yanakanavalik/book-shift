import { useCallback, useMemo, type ReactNode } from 'react';

import {
  clampPage,
  createBook,
  finishReading,
  startReading,
  withCurrentPage,
  type Book,
  type NewBook,
} from '@/lib/books';
import { addToDay, type ReadingLog } from '@/lib/streak';

import { createStoreContext, usePersistedState } from './persisted';

const STORAGE_KEY = 'book-shift/books/v1';
const LOG_STORAGE_KEY = 'book-shift/reading-log/v1';
const LAST_OPENED_STORAGE_KEY = 'book-shift/last-opened/v1';

// Stored as the bare id, not JSON.
const rawId = { decode: (raw: string) => raw, encode: (id: string | null) => id };

type BooksContextValue = {
  books: Book[];
  /** Pages read per day, recorded whenever progress moves forward. Drives the streak. */
  readingLog: ReadingLog;
  /** The book the user opened most recently; the small widget shows it. */
  lastOpenedId: string | null;
  loaded: boolean;
  addBook: (input: NewBook) => Book;
  updateProgress: (id: string, page: number) => void;
  /** Moves a book to Reading at `startPage` (default 0) without logging it as pages read. */
  startBook: (id: string, startPage?: number) => void;
  /** Marks a book as read without logging the remaining pages as read today. */
  finishBook: (id: string) => void;
  removeBook: (id: string) => void;
  markOpened: (id: string) => void;
};

const [Provider, useBooks] = createStoreContext<BooksContextValue>('Books');
export { useBooks };

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks, booksLoaded] = usePersistedState<Book[]>(STORAGE_KEY, [], 'books');
  const [readingLog, setReadingLog, logLoaded] = usePersistedState<ReadingLog>(LOG_STORAGE_KEY, {}, 'reading log');
  const [lastOpenedId, setLastOpenedId, lastOpenedLoaded] = usePersistedState<string | null>(
    LAST_OPENED_STORAGE_KEY,
    null,
    'last opened book',
    rawId,
  );
  const loaded = booksLoaded && logLoaded && lastOpenedLoaded;

  const updateBook = useCallback(
    (id: string, update: (book: Book) => Book) => setBooks((prev) => prev.map((b) => (b.id === id ? update(b) : b))),
    [setBooks],
  );

  const addBook = useCallback<BooksContextValue['addBook']>(
    (input) => {
      const book = createBook(input);
      setBooks((prev) => [book, ...prev]);
      return book;
    },
    [setBooks],
  );

  const updateProgress = useCallback(
    (id: string, page: number) => {
      const book = books.find((b) => b.id === id);
      if (!book) return;
      // Only forward progress counts as reading; corrections backwards don't un-log a day.
      const pagesRead = clampPage(page, book.totalPages) - book.currentPage;
      updateBook(id, (b) => withCurrentPage(b, page));
      if (pagesRead > 0) setReadingLog((prev) => addToDay(prev, pagesRead, new Date()));
    },
    [books, updateBook, setReadingLog],
  );

  const startBook = useCallback(
    (id: string, startPage = 0) => updateBook(id, (b) => startReading(b, startPage)),
    [updateBook],
  );

  const finishBook = useCallback((id: string) => updateBook(id, finishReading), [updateBook]);

  const removeBook = useCallback(
    (id: string) => setBooks((prev) => prev.filter((book) => book.id !== id)),
    [setBooks],
  );

  const value = useMemo(
    () => ({
      books,
      readingLog,
      lastOpenedId,
      loaded,
      addBook,
      updateProgress,
      startBook,
      finishBook,
      removeBook,
      markOpened: setLastOpenedId,
    }),
    [books, readingLog, lastOpenedId, loaded, addBook, updateProgress, startBook, finishBook, removeBook, setLastOpenedId],
  );

  return <Provider value={value}>{children}</Provider>;
}

/** A book by id, or undefined if it isn't in the library. */
export function useBook(id: string | undefined): Book | undefined {
  const { books } = useBooks();
  return id ? books.find((book) => book.id === id) : undefined;
}
