/**
 * Date utility functions (Single Responsibility: Localized Date Formatting)
 */

/**
 * Formats an ISO date string into a user-friendly localized date string.
 */
export function formatLocalizedDate(
  isoString?: string,
  locale: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString(locale, options);
  } catch {
    return isoString;
  }
}
