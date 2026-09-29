import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createBook, withCurrentPage, type Book } from '@/lib/books';

const STORAGE_KEY = 'book-shift/books/v1';

type BooksContextValue = {
  books: Book[];
  loaded: boolean;
  addBook: (input: { title: string; author: string; totalPages: number }) => Book;
  updateProgress: (id: string, page: number) => void;
  removeBook: (id: string) => void;
};

const BooksContext = createContext<BooksContextValue | null>(null);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setBooks(JSON.parse(raw) as Book[]);
      })
      .catch((error) => console.warn('Failed to load books', error))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    // Don't overwrite stored data with the empty initial state before it has loaded.
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)).catch((error) =>
      console.warn('Failed to save books', error),
    );
  }, [books, loaded]);

  const addBook = useCallback<BooksContextValue['addBook']>((input) => {
    const book = createBook(input);
    setBooks((prev) => [book, ...prev]);
    return book;
  }, []);

  const updateProgress = useCallback((id: string, page: number) => {
    setBooks((prev) => prev.map((book) => (book.id === id ? withCurrentPage(book, page) : book)));
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  }, []);

  const value = useMemo(
    () => ({ books, loaded, addBook, updateProgress, removeBook }),
    [books, loaded, addBook, updateProgress, removeBook],
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks(): BooksContextValue {
  const context = useContext(BooksContext);
  if (!context) throw new Error('useBooks must be used inside <BooksProvider>');
  return context;
}
