import type { Category, Transaction } from '@/types/budget';
import { formatMonthKey, parseDate } from '@/utils';

export const computeSpentByCategory = (
  transactions: Transaction[],
  selectedMonth: string,
) => {
  const map = new Map<string, number>();
  transactions
    .filter((t) => {
      return t.type === 'expense';
    })
    .filter((t) => {
      const d = parseDate(t.date);
      return formatMonthKey(d) === selectedMonth;
    })
    .forEach((t) => {
      const current = map.get(t.category) || 0;
      map.set(t.category, current + t.amount);
    });
  return map;
};

export const getExpensesByCategory = (
  transactions: Transaction[],
  categories: Category[],
  selectedMonth: string,
) => {
  const spentByCat = computeSpentByCategory(transactions, selectedMonth);
  return categories
    .filter((category) => {
      return category.type === 'expense';
    })
    .map((category) => {
      return {
        name: category.name,
        value: spentByCat.get(category.name) || 0,
      };
    })
    .filter((category) => {
      return category.value > 0;
    });
};

export const getCategoryLimits = (
  transactions: Transaction[],
  categories: Category[],
  selectedMonth: string,
) => {
  const spentByCat = computeSpentByCategory(transactions, selectedMonth);
  return categories
    .filter((category) => {
      return category.type === 'expense';
    })
    .map((category) => {
      const monthData = category.monthlyData[selectedMonth] || {
        limit: 0,
        spent: 0,
      };
      return {
        color: category.color,
        id: category.id,
        limit: monthData.limit,
        name: category.name,
        spent: spentByCat.get(category.name) || 0,
      };
    })
    .filter((category) => {
      return category.spent > 0 && category.limit > 0;
    })
    .sort((a, b) => {
      return b.spent / b.limit - a.spent / a.limit;
    })
    .slice(0, 3);
};
