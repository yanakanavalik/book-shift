import {
  bookStatus,
  clampPage,
  countByStatus,
  createBook,
  filterBooks,
  progressPercent,
  startReading,
  targetPage,
  withCurrentPage,
} from './books';

const now = new Date('2026-09-29T12:00:00Z');

describe('clampPage', () => {
  it('keeps the page within 0..totalPages', () => {
    expect(clampPage(-5, 300)).toBe(0);
    expect(clampPage(450, 300)).toBe(300);
    expect(clampPage(12.6, 300)).toBe(13);
    expect(clampPage(NaN, 300)).toBe(0);
  });
});

describe('progressPercent', () => {
  it('rounds to a whole percent', () => {
    expect(progressPercent({ currentPage: 1, totalPages: 3 })).toBe(33);
    expect(progressPercent({ currentPage: 300, totalPages: 300 })).toBe(100);
  });
});

describe('bookStatus', () => {
  it('derives status from the current page', () => {
    expect(bookStatus({ currentPage: 0, totalPages: 100 })).toBe('want-to-read');
    expect(bookStatus({ currentPage: 50, totalPages: 100 })).toBe('reading');
    expect(bookStatus({ currentPage: 100, totalPages: 100 })).toBe('finished');
  });
});

describe('withCurrentPage', () => {
  const book = createBook({ title: ' Dune ', author: 'Frank Herbert', totalPages: 412 }, now);

  it('trims input when creating a book', () => {
    expect(book.title).toBe('Dune');
    expect(book.currentPage).toBe(0);
  });

  it('sets finishedAt on the last page and clears it when going back', () => {
    const finished = withCurrentPage(book, 999, now);
    expect(finished.currentPage).toBe(412);
    expect(finished.finishedAt).toBe(now.toISOString());

    const reopened = withCurrentPage(finished, 200, now);
    expect(reopened.finishedAt).toBeUndefined();
  });
});

describe('status', () => {
  const base = { title: 'Dune', author: 'Frank Herbert', totalPages: 412 };

  it('creates books with the chosen status', () => {
    expect(bookStatus(createBook(base, now))).toBe('want-to-read');
    expect(bookStatus(createBook({ ...base, status: 'reading' }, now))).toBe('reading');

    const read = createBook({ ...base, status: 'finished' }, now);
    expect(bookStatus(read)).toBe('finished');
    expect(read.currentPage).toBe(412);
    expect(read.finishedAt).toBe(now.toISOString());
  });

  it('keeps a just-started book as reading at page 0', () => {
    const reading = createBook({ ...base, status: 'reading' }, now);
    expect(bookStatus(withCurrentPage(reading, 0, now))).toBe('reading');
  });

  it('follows the page once progress is logged', () => {
    const toRead = createBook(base, now);
    expect(bookStatus(withCurrentPage(toRead, 10, now))).toBe('reading');
    expect(bookStatus(withCurrentPage(toRead, 412, now))).toBe('finished');
  });

  it('derives status for books saved before it was stored', () => {
    expect(bookStatus({ currentPage: 5, totalPages: 10 })).toBe('reading');
  });
});

describe('library filtering', () => {
  const at = (day: number) => new Date(2026, 8, day);
  const library = [
    createBook({ title: 'Cien años de soledad', author: 'Gabriel García Márquez', totalPages: 417 }, at(1)),
    withCurrentPage(createBook({ title: 'Dune', author: 'Frank Herbert', totalPages: 412 }, at(2)), 100, at(3)),
    createBook({ title: 'The Salt Road', author: 'Mara Ellison', totalPages: 340, status: 'finished' }, at(4)),
  ];

  it('counts books per status', () => {
    expect(countByStatus(library)).toEqual({ all: 3, reading: 1, finished: 1, 'want-to-read': 1 });
  });

  it('filters by status', () => {
    expect(filterBooks(library, 'reading', '').map((b) => b.title)).toEqual(['Dune']);
  });

  it('searches title and author, ignoring case and accents', () => {
    expect(filterBooks(library, 'all', 'garcia').map((b) => b.title)).toEqual(['Cien años de soledad']);
    expect(filterBooks(library, 'all', 'ANOS').map((b) => b.title)).toEqual(['Cien años de soledad']);
    expect(filterBooks(library, 'finished', 'dune')).toEqual([]);
  });

  it('lists the most recently updated first', () => {
    expect(filterBooks(library, 'all', '').map((b) => b.title)).toEqual(['The Salt Road', 'Dune', 'Cien años de soledad']);
  });
});

describe('targetPage', () => {
  const book = { currentPage: 40, totalPages: 312 };

  it('adds pages read to the current page', () => {
    expect(targetPage(book, 'pages-read', '3')).toBe(43);
  });

  it('jumps to the page the reader is on', () => {
    expect(targetPage(book, 'current-page', '120')).toBe(120);
    expect(targetPage(book, 'current-page', '12')).toBe(12);
  });

  it('stops at the last page', () => {
    expect(targetPage(book, 'pages-read', '500')).toBe(312);
  });

  it('ignores empty input', () => {
    expect(targetPage(book, 'pages-read', '')).toBeNull();
  });
});

describe('startReading', () => {
  it('moves a to-read book to reading at page 0', () => {
    const book = createBook({ title: 'Salt and Signal', author: 'June Okonkwo', totalPages: 398 }, now);
    const started = startReading(book, 0, new Date('2026-09-30T08:00:00Z'));
    expect(bookStatus(started)).toBe('reading');
    expect(started.currentPage).toBe(0);
    expect(started.updatedAt).toBe('2026-09-30T08:00:00.000Z');
  });

  it('can start partway through, but not past the last page', () => {
    const book = createBook({ title: 'Salt and Signal', author: 'June Okonkwo', totalPages: 398 }, now);
    expect(startReading(book, 120, now).currentPage).toBe(120);
    expect(bookStatus(startReading(book, 999, now))).toBe('reading');
    expect(startReading(book, 999, now).currentPage).toBe(397);
  });
});
