import { format } from 'date-fns';

/**
 * Format a month key (YYYY-MM) to a readable format (e.g., "May 2025")
 */
export default function formatMonthKeyToReadable(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1);
  return format(date, 'MMMM yyyy');
}
