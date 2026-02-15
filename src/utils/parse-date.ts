import { isValid, parse } from 'date-fns';

/**
 * Parse a date string in various formats to a Date object
 */
export default function parseDate(dateString: string): Date {
  // Try different formats
  const monthLabelDate = parse(dateString, 'MMM d, yyyy', new Date());

  if (isValid(monthLabelDate)) {
    return monthLabelDate;
  }

  const isoDate = parse(dateString, 'yyyy-MM-dd', new Date());

  if (isValid(isoDate)) {
    return isoDate;
  }

  const nativeDate = new Date(dateString);

  if (isValid(nativeDate)) {
    return nativeDate;
  }

  // Return current date if parsing fails
  console.error('Failed to parse date:', dateString);
  return new Date();
}
