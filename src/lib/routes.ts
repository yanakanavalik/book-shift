/** Typed href for a book's sheet. */
export function bookHref(id: string) {
  return { pathname: '/book/[id]', params: { id } } as const;
}
