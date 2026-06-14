'use client';

import { useMemo } from 'react';
import { format, startOfDay, startOfWeek, subDays, subWeeks } from 'date-fns';
import useBudgetData from './use-budget-data';
import { useStatisticsTransactions } from './use-statistics-transactions';
import type { Category, Goal, Transaction } from '@/types/budget';
import { formatMonthKey, getLastNMonthKeys, parseDate } from '@/utils';

type StatisticsInput = {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
};

export const getStatisticsData = ({
  transactions,
  categories,
  goals,
}: StatisticsInput) => {
  const groupTransactionsByPeriod = (
    periodType: 'daily' | 'weekly' | 'monthly',
    count: number,
  ) => {
    const now = new Date();
    const periods: Array<{
      period: string;
      expenses: number;
      income: number;
      transactions: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      let periodStart: Date;
      let periodEnd: Date;
      let periodLabel: string;

      switch (periodType) {
        case 'daily':
          periodStart = startOfDay(subDays(now, i));
          periodEnd = new Date(periodStart);
          periodEnd.setHours(23, 59, 59, 999);
          periodLabel = format(periodStart, 'MMM d');
          break;
        case 'weekly':
          periodStart = startOfWeek(subWeeks(now, i));
          periodEnd = new Date(periodStart);
          periodEnd.setDate(periodEnd.getDate() + 6);
          periodEnd.setHours(23, 59, 59, 999);
          periodLabel = `Week ${format(periodStart, 'MMM d')}`;
          break;
        case 'monthly':
          periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
          periodEnd.setHours(23, 59, 59, 999);
          periodLabel = format(periodStart, 'MMM');
          break;
      }

      const periodTransactions = transactions.filter((transaction) => {
        const transactionDate = parseDate(transaction.date);
        return transactionDate >= periodStart && transactionDate <= periodEnd;
      });

      const expenses = periodTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const income = periodTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      periods.unshift({
        period: periodLabel,
        expenses,
        income,
        transactions: periodTransactions.length,
      });
    }

    return periods;
  };

  const dailySpending = groupTransactionsByPeriod('daily', 7);
  const weeklySpending = groupTransactionsByPeriod('weekly', 4);
  const monthlySpending = groupTransactionsByPeriod('monthly', 6);

  const categoryBreakdown = Array.from(
    transactions
      .filter((t) => t.type === 'expense')
      .reduce((totals, transaction) => {
        const current = totals.get(transaction.category) || 0;
        totals.set(transaction.category, current + transaction.amount);
        return totals;
      }, new Map<string, number>())
      .entries(),
  )
    .map(([name, value]) => ({ name, value }))
    .filter((category) => category.value > 0)
    .sort((a, b) => b.value - a.value);

  const categoryTrends = getLastNMonthKeys(6)
    .reverse()
    .map((monthKey) => {
      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = parseDate(transaction.date);
        return formatMonthKey(transactionDate) === monthKey;
      });

      const monthData: Record<string, string | number> = {
        month: format(new Date(monthKey + '-01'), 'MMM'),
      };

      const expenseCategories = Array.from(
        new Set(
          transactions
            .filter((t) => t.type === 'expense')
            .map((t) => t.category),
        ),
      );

      expenseCategories.forEach((category) => {
        const categoryTotal = monthTransactions
          .filter((t) => t.type === 'expense' && t.category === category)
          .reduce((sum, t) => sum + t.amount, 0);
        monthData[category] = categoryTotal;
      });

      return monthData;
    });

  const currentMonth = formatMonthKey(new Date());
  const categoryLimits = categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const monthData = category.monthlyData[currentMonth] || {
        limit: 0,
        spent: 0,
      };
      return {
        name: category.name,
        spent: monthData.spent,
        limit: monthData.limit,
        color: category.color,
      };
    })
    .filter((category) => category.limit > 0)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit);

  const monthlyComparison = monthlySpending.map((month) => {
    const net = month.income - month.expenses;
    return {
      month: month.period,
      income: month.income,
      expenses: month.expenses,
      net,
    };
  });

  const incomeSourceBreakdown = Array.from(
    transactions
      .filter((t) => t.type === 'income')
      .reduce((totals, transaction) => {
        const current = totals.get(transaction.category) || 0;
        totals.set(transaction.category, current + transaction.amount);
        return totals;
      }, new Map<string, number>())
      .entries(),
  )
    .map(([source, amount]) => ({ source, amount }))
    .filter((source) => source.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const incomeVsExpenseRatio = monthlyComparison.map((month) => ({
    month: month.month,
    ratio: month.expenses > 0 ? month.income / month.expenses : 0,
    baseline: 1,
  }));

  const savingsRate = monthlyComparison.map((month) => ({
    month: month.month,
    rate: month.income > 0 ? (month.net / month.income) * 100 : 0,
    target: 20,
  }));

  const savingsGoalProgress = goals.map((goal) => ({
    name: goal.name,
    value: goal.current,
    target: goal.target,
  }));

  const recentMonths = monthlyComparison.slice(-3);
  const avgMonthlySavings =
    recentMonths.length > 0
      ? recentMonths.reduce((sum, month) => sum + month.net, 0) /
        recentMonths.length
      : 0;

  const currentSavings = goals.reduce((sum, goal) => sum + goal.current, 0);
  const savingsProjection = [];

  for (let i = 1; i <= 6; i++) {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + i);

    savingsProjection.push({
      month: format(futureDate, 'MMM yyyy'),
      conservative: Math.max(0, currentSavings + avgMonthlySavings * 0.8 * i),
      expected: Math.max(0, currentSavings + avgMonthlySavings * i),
      optimistic: Math.max(0, currentSavings + avgMonthlySavings * 1.2 * i),
    });
  }

  const savingsDistribution = goals.map((goal) => ({
    name: goal.name,
    current: goal.current,
    target: goal.target,
  }));

  return {
    dailySpending,
    weeklySpending,
    monthlySpending,
    categoryBreakdown,
    categoryTrends,
    categoryLimits,
    monthlyComparison,
    incomeSourceBreakdown,
    incomeVsExpenseRatio,
    savingsRate,
    savingsGoalProgress,
    savingsProjection,
    savingsDistribution,
  };
};

type UseStatisticsDataParams = {
  initialTransactions?: Transaction[];
};

export default function useStatisticsData({
  initialTransactions = [],
}: UseStatisticsDataParams = {}) {
  const { categories, goals } = useBudgetData();
  const { data: transactions = [] } = useStatisticsTransactions({
    initialTransactions,
  });

  return useMemo(() => {
    return getStatisticsData({
      transactions,
      categories,
      goals,
    });
  }, [categories, goals, transactions]);
}
