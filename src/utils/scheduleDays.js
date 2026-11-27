/**
 * Shared multi-day schedule parsing & formatting helpers.
 * Supports values like:
 *   "Monday, Wednesday, Friday"
 *   "M-W-F", "MWF", "T-Th", "TTH", "Mon/Wed/Fri"
 *   or an array of day names.
 */
export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const SHORT_CODE_MAP = {
  Monday: 'M',
  Tuesday: 'T',
  Wednesday: 'W',
  Thursday: 'Th',
  Friday: 'F',
};

/** Parse any day_of_week string or array into an ordered list of canonical weekday names. */
export function parseScheduleDays(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    const set = new Set(input.map(d => String(d).trim()).filter(d => WEEKDAYS.includes(d)));
    return WEEKDAYS.filter(d => set.has(d));
  }

  const raw = String(input).trim();
  if (!raw) return [];

  const lower = raw.toLowerCase();
  const matched = new Set();

  // Direct full/abbreviated day names
  if (/\bmon(day)?\b/i.test(lower)) matched.add('Monday');
  if (/\btue(s|sday)?\b/i.test(lower)) matched.add('Tuesday');
  if (/\bwed(nesday)?\b/i.test(lower)) matched.add('Wednesday');
  if (/\bthu(rs|rsday)?\b/i.test(lower)) matched.add('Thursday');
  if (/\bfri(day)?\b/i.test(lower)) matched.add('Friday');

  // Compact codes like M-W-F, MWF, T-Th, TTh, M-F
  if (matched.size === 0) {
    const compact = raw.replace(/[^a-z]/gi, '').toUpperCase();
    if (compact === 'MF' || compact === 'MTWTHF') {
      return [...WEEKDAYS];
    }
    let i = 0;
    while (i < compact.length) {
      if (compact.slice(i, i + 2) === 'TH') {
        matched.add('Thursday');
        i += 2;
      } else if (compact[i] === 'M') {
        matched.add('Monday');
        i += 1;
      } else if (compact[i] === 'T') {
        matched.add('Tuesday');
        i += 1;
      } else if (compact[i] === 'W') {
        matched.add('Wednesday');
        i += 1;
      } else if (compact[i] === 'F') {
        matched.add('Friday');
        i += 1;
      } else {
        i += 1;
      }
    }
  }

  return WEEKDAYS.filter(d => matched.has(d));
}

/** True if a schedule entry covers a given weekday (e.g. "Monday"). */
export function scheduleIncludesDay(dayOfWeekValue, targetDay) {
  return parseScheduleDays(dayOfWeekValue).includes(targetDay);
}

/** Format an array or string of days for DB storage: "Monday, Wednesday, Friday". */
export function serializeScheduleDays(days) {
  const list = parseScheduleDays(days);
  return list.join(', ');
}

/** Short display code like "M-W-F" or "T-Th" for tables and badges. */
export function formatDaysShort(days) {
  const list = parseScheduleDays(days);
  if (list.length === 0) return '—';
  if (list.length === 5) return 'M-T-W-Th-F';
  return list.map(d => SHORT_CODE_MAP[d] || d.slice(0, 2)).join('-');
}

/** Format 24h "HH:MM" or "HH:MM:SS" to "h:mm AM/PM". */
export function formatTime12h(t) {
  if (!t) return '';
  const [hStr, mStr = '00'] = String(t).split(':');
  const h = Number(hStr);
  if (Number.isNaN(h)) return String(t);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(mStr).slice(0, 2).padStart(2, '0')} ${suffix}`;
}
