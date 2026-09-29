export type BookStatus = 'want-to-read' | 'reading' | 'finished';

export type Book = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
};

export function clampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page)) return 0;
  return Math.min(Math.max(Math.round(page), 0), totalPages);
}

export function progressPercent(book: Pick<Book, 'currentPage' | 'totalPages'>): number {
  if (book.totalPages <= 0) return 0;
  return Math.round((book.currentPage / book.totalPages) * 100);
}

export function bookStatus(book: Pick<Book, 'currentPage' | 'totalPages'>): BookStatus {
  if (book.currentPage <= 0) return 'want-to-read';
  if (book.currentPage >= book.totalPages) return 'finished';
  return 'reading';
}

export function createBook(
  input: { title: string; author: string; totalPages: number },
  now: Date = new Date(),
): Book {
  const timestamp = now.toISOString();
  return {
    id: `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    author: input.author.trim(),
    totalPages: Math.max(1, Math.round(input.totalPages)),
    currentPage: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function withCurrentPage(book: Book, page: number, now: Date = new Date()): Book {
  const currentPage = clampPage(page, book.totalPages);
  const finished = currentPage >= book.totalPages;
  return {
    ...book,
    currentPage,
    updatedAt: now.toISOString(),
    finishedAt: finished ? (book.finishedAt ?? now.toISOString()) : undefined,
  };
}
