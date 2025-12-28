import getPreviousMonthKey from './get-previous-month-key';
import type { Category } from '@/types/budget';

/**
 * Get the most recent month with data (limit > 0) for a category
 * @param category - The category to search
 * @returns Month key with data or null if none found
 */
export function getMostRecentMonthWithData(category: Category): string | null {
  const monthKeys = Object.keys(category.monthlyData).sort().reverse();
  return (
    monthKeys.find((monthKey) => {
      const data = category.monthlyData[monthKey];
      return data && data.limit > 0;
    }) || null
  );
}

/**
 * Initialize month data for a category with smart inheritance
 * @param category - The category to initialize data for
 * @param monthKey - The month key to initialize
 * @returns Month data with inherited limit if applicable
 */
export function initializeCategoryMonthData(
  category: Category,
  monthKey: string,
): { limit: number; spent: number } {
  // If this month already has data, return it
  if (category.monthlyData[monthKey]) {
    return category.monthlyData[monthKey];
  }

  // For expense categories, try to inherit limit from previous months
  if (category.type === 'expense') {
    // First, try the previous month
    const previousMonth = getPreviousMonthKey(monthKey);
    if (category.monthlyData[previousMonth]?.limit > 0) {
      return {
        limit: category.monthlyData[previousMonth].limit,
        spent: 0,
      };
    }

    // If previous month doesn't have a limit, find the most recent month with a limit
    const recentMonthWithData = getMostRecentMonthWithData(category);
    if (
      recentMonthWithData &&
      category.monthlyData[recentMonthWithData]?.limit > 0
    ) {
      return {
        limit: category.monthlyData[recentMonthWithData].limit,
        spent: 0,
      };
    }
  }

  // Default fallback
  return {
    limit: 0,
    spent: 0,
  };
}

/**
 * Get month data for a category with inheritance logic
 * @param category - The category to get data for
 * @param monthKey - The month key to get data for
 * @returns Month data with inherited limit if applicable
 */
export function getCategoryMonthDataWithInheritance(
  category: Category,
  monthKey: string,
): { limit: number; spent: number } {
  return initializeCategoryMonthData(category, monthKey);
}

/**
 * Check if a category's month data is inherited (not explicitly set for that month)
 * @param category - The category to check
 * @param monthKey - The month key to check
 * @returns True if the data is inherited, false if explicitly set
 */
export function isCategoryMonthDataInherited(
  category: Category,
  monthKey: string,
): boolean {
  // If the month data exists in the category, it's not inherited
  if (category.monthlyData[monthKey]) {
    return false;
  }

  // If it's an expense category and we can find data to inherit, it's inherited
  if (category.type === 'expense') {
    const previousMonth = getPreviousMonthKey(monthKey);
    if (category.monthlyData[previousMonth]?.limit > 0) {
      return true;
    }

    const recentMonthWithData = getMostRecentMonthWithData(category);
    if (
      recentMonthWithData &&
      category.monthlyData[recentMonthWithData]?.limit > 0
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Ensure all categories have month data for a specific month with inheritance
 * @param categories - Array of categories to process
 * @param selectedMonth - The month to ensure data for
 * @returns Categories with month data ensured
 */
export function ensureCategoriesMonthData(
  categories: Category[],
  selectedMonth: string,
): Category[] {
  return categories.map((category) => {
    // If the month data already exists, return as is
    if (category.monthlyData[selectedMonth]) {
      return category;
    }

    // Create new month data with inherited limits
    const newMonthlyData = { ...category.monthlyData };
    newMonthlyData[selectedMonth] = initializeCategoryMonthData(
      category,
      selectedMonth,
    );

    return {
      ...category,
      monthlyData: newMonthlyData,
    };
  });
}
