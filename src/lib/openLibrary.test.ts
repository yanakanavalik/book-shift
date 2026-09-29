import { isIsbn, toCatalogBook } from './openLibrary';

describe('isIsbn', () => {
  it('accepts ISBN-10 and ISBN-13 with or without dashes', () => {
    expect(isIsbn('9780441478026')).toBe(true);
    expect(isIsbn('978-0-441-47802-6')).toBe(true);
    expect(isIsbn('044147806X')).toBe(true);
  });

  it('rejects titles and partial numbers', () => {
    expect(isIsbn('dune')).toBe(false);
    expect(isIsbn('1984')).toBe(false);
  });
});

describe('toCatalogBook', () => {
  it('maps a search doc', () => {
    expect(
      toCatalogBook({
        key: '/works/OL893414W',
        title: 'Dune',
        author_name: ['Frank Herbert'],
        first_publish_year: 1965,
        number_of_pages_median: 608,
        cover_i: 11481354,
      }),
    ).toEqual({
      key: '/works/OL893414W',
      title: 'Dune',
      author: 'Frank Herbert',
      year: 1965,
      pages: 608,
      coverUrl: 'https://covers.openlibrary.org/b/id/11481354-M.jpg',
    });
  });

  it('tolerates missing optional data', () => {
    expect(toCatalogBook({ key: '/works/OL1W', title: 'Untitled Draft', cover_i: -1 })).toEqual({
      key: '/works/OL1W',
      title: 'Untitled Draft',
      author: '',
      year: undefined,
      pages: undefined,
      coverUrl: undefined,
    });
    expect(toCatalogBook({ key: '/works/OL2W' })).toBeNull();
  });
});
