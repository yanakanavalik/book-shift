import { bookStatus, clampPage, createBook, progressPercent, withCurrentPage } from './books';

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
