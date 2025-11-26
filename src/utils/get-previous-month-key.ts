import formatMonthKey from './format-month-key';

/**
 * Get the previous month key from a given month key
 * @param {string} monthKey - Month key in YYYY-MM format
 * @returns Previous month key in YYYY-MM format
 */
export default function getPreviousMonthKey(monthKey: string): string {
  const [year, month] = monthKey
    .split('-')
    .map((value) => Number.parseInt(value, 10));

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return monthKey;
  }

  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - 1);

  return formatMonthKey(date);
}
