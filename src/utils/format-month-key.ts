import { format } from 'date-fns';
/**
 * Format a date to YYYY-MM format for monthly data keys
 */
export default function formatMonthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}
