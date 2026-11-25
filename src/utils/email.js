/** Trim + lowercase an email. Returns '' for null/undefined. */
export function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

/** Same as normalizeEmail but returns null when empty (for nullable DB columns). */
export function normalizeEmailOrNull(value) {
  return normalizeEmail(value) || null;
}

/**
 * Escape LIKE/ILIKE wildcards so an email is matched literally
 * (e.g. "_" in "john_doe@x.com" must not act as a single-char wildcard).
 */
export function escapeLike(value) {
  return String(value ?? '').replace(/[\\%_]/g, '\\$&');
}

/** Pattern for a case-insensitive exact email match: .ilike('email', emailPattern(x)) */
export function emailPattern(value) {
  return escapeLike(normalizeEmail(value));
}
