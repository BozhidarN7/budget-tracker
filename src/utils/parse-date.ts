import { parse } from 'date-fns';

/**
 * Parse a date string in various formats to a Date object
 */
export default function parseDate(dateString: string): Date {
  // Try different formats
  try {
    // Format: "May 1, 2023"
    return parse(dateString, 'MMM d, yyyy', new Date());
  } catch (_error) {
    try {
      // Format: "2023-05-01"
      return parse(dateString, 'yyyy-MM-dd', new Date());
    } catch (_error) {
      // Return current date if parsing fails
      console.error('Failed to parse date:', dateString);
      return new Date();
    }
  }
}
