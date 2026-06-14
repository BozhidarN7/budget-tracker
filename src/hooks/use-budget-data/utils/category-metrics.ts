import type { Category } from '@/types/budget';
import { formatMonthKeyToReadable, getPreviousMonthKey } from '@/utils';

type MonthlyTotals = {
  expenses: number;
  income: number;
  net: number;
};

type MonthlyTrend = {
  expenses: number;
  income: number;
  month: string;
  monthKey: string;
};

type DashboardSummary = {
  currentMonth: MonthlyTotals;
  previousMonth: MonthlyTotals;
  monthlyTrends: MonthlyTrend[];
};

const getCategorySpentForMonth = (category: Category, monthKey: string) => {
  return category.monthlyData[monthKey]?.spent ?? 0;
};

const getTotalsForMonth = (
  categories: Category[],
  monthKey: string,
): MonthlyTotals => {
  const income = categories
    .filter((category) => category.type === 'income')
    .reduce(
      (sum, category) => sum + getCategorySpentForMonth(category, monthKey),
      0,
    );

  const expenses = categories
    .filter((category) => category.type === 'expense')
    .reduce(
      (sum, category) => sum + getCategorySpentForMonth(category, monthKey),
      0,
    );

  return {
    expenses,
    income,
    net: income - expenses,
  };
};

export const getDashboardSummary = (
  categories: Category[],
  monthRange: string[],
  selectedMonth: string,
): DashboardSummary => {
  const currentMonth = getTotalsForMonth(categories, selectedMonth);
  const previousMonth = getTotalsForMonth(
    categories,
    getPreviousMonthKey(selectedMonth),
  );

  const monthlyTrends = monthRange.map((monthKey) => {
    const totals = getTotalsForMonth(categories, monthKey);

    return {
      expenses: totals.expenses,
      income: totals.income,
      month: formatMonthKeyToReadable(monthKey),
      monthKey,
    };
  });

  return {
    currentMonth,
    monthlyTrends,
    previousMonth,
  };
};

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
