// Open Library search: https://openlibrary.org/dev/docs/api/search
// Usage guidelines ask apps to identify themselves, cache responses and avoid bulk requests.

const SEARCH_URL = 'https://openlibrary.org/search.json';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';
const USER_AGENT = 'BookShift/1.0 (+https://github.com/yanakanavalik/book-shift)';
const FIELDS = 'key,title,author_name,first_publish_year,number_of_pages_median,cover_i';
const LIMIT = 20;

export type CatalogBook = {
  key: string;
  title: string;
  author: string;
  year?: number;
  pages?: number;
  coverUrl?: string;
};

type SearchDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  cover_i?: number;
};

export function isIsbn(query: string): boolean {
  const digits = query.replace(/[-\s]/g, '');
  return /^(\d{9}[\dXx]|\d{13})$/.test(digits);
}

export function coverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `${COVERS_URL}/${coverId}-${size}.jpg`;
}

export function toCatalogBook(doc: SearchDoc): CatalogBook | null {
  if (!doc.key || !doc.title) return null;
  return {
    key: doc.key,
    title: doc.title,
    author: doc.author_name?.slice(0, 2).join(', ') ?? '',
    year: doc.first_publish_year,
    pages: doc.number_of_pages_median && doc.number_of_pages_median > 0 ? doc.number_of_pages_median : undefined,
    coverUrl: doc.cover_i && doc.cover_i > 0 ? coverUrl(doc.cover_i) : undefined,
  };
}

// Session cache so retyping or toggling tabs doesn't refetch.
const cache = new Map<string, CatalogBook[]>();

export async function searchCatalog(query: string, signal?: AbortSignal): Promise<CatalogBook[]> {
  const trimmed = query.trim();
  const cacheKey = trimmed.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({ fields: FIELDS, limit: String(LIMIT) });
  if (isIsbn(trimmed)) params.set('isbn', trimmed.replace(/[-\s]/g, ''));
  else params.set('q', trimmed);

  const response = await fetch(`${SEARCH_URL}?${params}`, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal,
  });
  if (!response.ok) throw new Error(`Open Library search failed (${response.status})`);

  const json = (await response.json()) as { docs?: SearchDoc[] };
  const results = (json.docs ?? []).map(toCatalogBook).filter((book): book is CatalogBook => book !== null);
  cache.set(cacheKey, results);
  return results;
}
