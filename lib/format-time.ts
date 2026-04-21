/**
 * Parses a 24-hour clock string (e.g. "08:30", "14:5") from the API.
 * Returns null if the string cannot be parsed as a valid time.
 */
export function parseTime24h(time: string): { hours: number; minutes: number } | null {
  const trimmed = time.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (!match) return null;
  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  return { hours, minutes };
}

/**
 * Formats a 24h "HH:MM" reminder time as a locale-aware 12h string (AM/PM).
 * Falls back to the original string if parsing fails.
 */
export function formatTime12h(time24: string, locale: string): string {
  const parsed = parseTime24h(time24);
  if (!parsed) return time24;

  const d = new Date(2000, 0, 1, parsed.hours, parsed.minutes, 0, 0);
  const tag = locale === 'ar' ? 'ar-EG' : 'en-US';

  return d.toLocaleTimeString(tag, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
