import type { Category } from '@/types/budget';

export const getExpensesByCategory = (
  categories: Category[],
  selectedMonth: string,
) => {
  return categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const monthData = category.monthlyData[selectedMonth] || {
        limit: 0,
        spent: 0,
      };

      return {
        name: category.name,
        value: monthData.spent,
      };
    })
    .filter((category) => category.value > 0);
};

export const getCategoryLimits = (
  categories: Category[],
  selectedMonth: string,
) => {
  return categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const monthData = category.monthlyData[selectedMonth] || {
        limit: 0,
        spent: 0,
      };

      return {
        id: category.id,
        name: category.name,
        limit: monthData.limit,
        spent: monthData.spent,
        color: category.color,
      };
    })
    .filter((category) => category.spent > 0)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3);
};
