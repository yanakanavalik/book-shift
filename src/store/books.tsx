import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  clampPage,
  createBook,
  finishReading,
  startReading,
  withCurrentPage,
  type Book,
  type NewBook,
} from '@/lib/books';
import { logPages, type ReadingLog } from '@/lib/streak';

const STORAGE_KEY = 'book-shift/books/v1';
const LOG_STORAGE_KEY = 'book-shift/reading-log/v1';

type BooksContextValue = {
  books: Book[];
  /** Pages read per day, recorded whenever progress moves forward. Drives the streak. */
  readingLog: ReadingLog;
  loaded: boolean;
  addBook: (input: NewBook) => Book;
  updateProgress: (id: string, page: number) => void;
  /** Moves a book to Reading at `startPage` (default 0) without logging it as pages read. */
  startBook: (id: string, startPage?: number) => void;
  /** Marks a book as read without logging the remaining pages as read today. */
  finishBook: (id: string) => void;
  removeBook: (id: string) => void;
};

const BooksContext = createContext<BooksContextValue | null>(null);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [readingLog, setReadingLog] = useState<ReadingLog>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([STORAGE_KEY, LOG_STORAGE_KEY])
      .then(([[, rawBooks], [, rawLog]]) => {
        if (rawBooks) setBooks(JSON.parse(rawBooks) as Book[]);
        if (rawLog) setReadingLog(JSON.parse(rawLog) as ReadingLog);
      })
      .catch((error) => console.warn('Failed to load books', error))
      .finally(() => setLoaded(true));
  }, []);

  // Don't overwrite stored data with the empty initial state before it has loaded.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)).catch((error) =>
      console.warn('Failed to save books', error),
    );
  }, [books, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(readingLog)).catch((error) =>
      console.warn('Failed to save reading log', error),
    );
  }, [readingLog, loaded]);

  const addBook = useCallback<BooksContextValue['addBook']>((input) => {
    const book = createBook(input);
    setBooks((prev) => [book, ...prev]);
    return book;
  }, []);

  const updateProgress = useCallback(
    (id: string, page: number) => {
      const book = books.find((b) => b.id === id);
      if (!book) return;
      // Only forward progress counts as reading; corrections backwards don't un-log a day.
      const pagesRead = clampPage(page, book.totalPages) - book.currentPage;
      setBooks((prev) => prev.map((b) => (b.id === id ? withCurrentPage(b, page) : b)));
      if (pagesRead > 0) setReadingLog((prev) => logPages(prev, pagesRead, new Date()));
    },
    [books],
  );

  const startBook = useCallback((id: string, startPage = 0) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? startReading(b, startPage) : b)));
  }, []);

  const finishBook = useCallback((id: string) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? finishReading(b) : b)));
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  }, []);

  const value = useMemo(
    () => ({ books, readingLog, loaded, addBook, updateProgress, startBook, finishBook, removeBook }),
    [books, readingLog, loaded, addBook, updateProgress, startBook, finishBook, removeBook],
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks(): BooksContextValue {
  const context = useContext(BooksContext);
  if (!context) throw new Error('useBooks must be used inside <BooksProvider>');
  return context;
}
