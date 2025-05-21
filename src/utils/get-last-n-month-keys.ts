import formatMonthKey from './format-month-key';

/**
 * Get an array of month keys for the last N months
 */
export default function getLastNMonthKeys(n: number): string[] {
  const months = [];
  const today = new Date();

  for (let i = 0; i < n; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(formatMonthKey(date));
  }

  return months;
}
