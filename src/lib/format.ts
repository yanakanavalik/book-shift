/** "1 page", "3 pages". */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Joins the non-empty parts with a middle dot, e.g. "Ursula K. Le Guin · 1969 · 304 pp". */
export function joinMeta(...parts: (string | number | null | undefined | false)[]): string {
  return parts.filter(Boolean).join(' · ');
}

/** Strips everything but digits, for number-pad text fields. */
export function digitsOnly(text: string): string {
  return text.replace(/[^0-9]/g, '');
}

/** Zero-pads to two digits, e.g. 7 → "07". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
