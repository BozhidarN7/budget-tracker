import formatMonthKey from './format-month-key';

/**
 * Get the current month key in YYYY-MM format
 */
export default function getCurrentMonthKey(): string {
  return formatMonthKey(new Date());
}
