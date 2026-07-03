import type { Category, Transaction } from '@/types/budget';
import { formatMonthKey, parseDate } from '@/utils';
import { initializeCategoryMonthData } from '@/utils/category-utils';

type SpendChangeMode = 'add' | 'remove';

export function applyCategorySpendChange(
  category: Category,
  transaction: Pick<Transaction, 'amount' | 'category' | 'date' | 'type'>,
  mode: SpendChangeMode,
): Category {
  if (
    category.name !== transaction.category ||
    category.type !== transaction.type
  ) {
    return category;
  }

  const monthKey = formatMonthKey(parseDate(transaction.date));
  const monthlyData = { ...category.monthlyData };
  const monthData =
    monthlyData[monthKey] ?? initializeCategoryMonthData(category, monthKey);
  const spentDelta = mode === 'add' ? transaction.amount : -transaction.amount;

  monthlyData[monthKey] = {
    ...monthData,
    spent: monthData.spent + spentDelta,
  };

  return {
    ...category,
    monthlyData,
  };
}
