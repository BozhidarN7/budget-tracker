'use client';

import { useMemo } from 'react';
import { format, startOfDay, startOfWeek, subDays, subWeeks } from 'date-fns';
import useBudgetData from './use-budget-data';
import { formatMonthKey, getLastNMonthKeys, parseDate } from '@/utils';

export default function useStatisticsData() {
  // Get ALL transaction data, not filtered by selected month
  const { allTransactions, categories, goals } = useBudgetData();

  // Use allTransactions instead of transactions throughout the hook
  const transactions = useMemo(() => allTransactions || [], [allTransactions]);

  // Helper function to group transactions by time period
  const groupTransactionsByPeriod = useMemo(() => {
    return (periodType: 'daily' | 'weekly' | 'monthly', count: number) => {
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
  }, [transactions]);

  // Daily spending data (last 7 days)
  const dailySpending = useMemo(
    () => groupTransactionsByPeriod('daily', 7),
    [groupTransactionsByPeriod],
  );

  // Weekly spending data (last 4 weeks)
  const weeklySpending = useMemo(
    () => groupTransactionsByPeriod('weekly', 4),
    [groupTransactionsByPeriod],
  );

  // Monthly spending data (last 6 months)
  const monthlySpending = useMemo(
    () => groupTransactionsByPeriod('monthly', 6),
    [groupTransactionsByPeriod],
  );

  // Category breakdown (all time)
  const categoryBreakdown = useMemo(() => {
    const categoryTotals = new Map<string, number>();

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        const current = categoryTotals.get(transaction.category) || 0;
        categoryTotals.set(transaction.category, current + transaction.amount);
      });

    return Array.from(categoryTotals.entries())
      .map(([name, value]) => ({ name, value }))
      .filter((category) => category.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Category trends over time (last 6 months)
  const categoryTrends = useMemo(() => {
    const lastSixMonths = getLastNMonthKeys(6).reverse();

    return lastSixMonths.map((monthKey) => {
      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = parseDate(transaction.date);
        return formatMonthKey(transactionDate) === monthKey;
      });

      const monthData: Record<string, string | number> = {
        month: format(new Date(monthKey + '-01'), 'MMM'),
      };

      // Get all unique expense categories
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
  }, [transactions]);

  // Category limits (from categories data for current month)
  const categoryLimits = useMemo(() => {
    const currentMonth = formatMonthKey(new Date());

    return categories
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
  }, [categories]);

  // Monthly income vs expenses comparison (last 6 months)
  const monthlyComparison = useMemo(() => {
    return monthlySpending.map((month) => {
      const net = month.income - month.expenses;
      return {
        month: month.period,
        income: month.income,
        expenses: month.expenses,
        net,
      };
    });
  }, [monthlySpending]);

  // Income source breakdown (all time)
  const incomeSourceBreakdown = useMemo(() => {
    const incomeTotals = new Map<string, number>();

    transactions
      .filter((t) => t.type === 'income')
      .forEach((transaction) => {
        const current = incomeTotals.get(transaction.category) || 0;
        incomeTotals.set(transaction.category, current + transaction.amount);
      });

    return Array.from(incomeTotals.entries())
      .map(([source, amount]) => ({ source, amount }))
      .filter((source) => source.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Income vs expense ratio (last 6 months)
  const incomeVsExpenseRatio = useMemo(() => {
    return monthlyComparison.map((month) => ({
      month: month.month,
      ratio: month.expenses > 0 ? month.income / month.expenses : 0,
      baseline: 1,
    }));
  }, [monthlyComparison]);

  // Savings rate (last 6 months)
  const savingsRate = useMemo(() => {
    return monthlyComparison.map((month) => ({
      month: month.month,
      rate: month.income > 0 ? (month.net / month.income) * 100 : 0,
      target: 20, // 20% target savings rate
    }));
  }, [monthlyComparison]);

  // Savings goal progress
  const savingsGoalProgress = useMemo(() => {
    return goals.map((goal) => ({
      name: goal.name,
      value: goal.current,
      target: goal.target,
    }));
  }, [goals]);

  // Savings projection (next 6 months based on current trends)
  const savingsProjection = useMemo(() => {
    // Calculate average monthly savings from last 3 months
    const recentMonths = monthlyComparison.slice(-3);
    const avgMonthlySavings =
      recentMonths.length > 0
        ? recentMonths.reduce((sum, month) => sum + month.net, 0) /
          recentMonths.length
        : 0;

    const currentSavings = goals.reduce((sum, goal) => sum + goal.current, 0);

    const projections = [];
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);

      projections.push({
        month: format(futureDate, 'MMM yyyy'),
        conservative: Math.max(0, currentSavings + avgMonthlySavings * 0.8 * i), // 20% less optimistic
        expected: Math.max(0, currentSavings + avgMonthlySavings * i),
        optimistic: Math.max(0, currentSavings + avgMonthlySavings * 1.2 * i), // 20% more optimistic
      });
    }

    return projections;
  }, [monthlyComparison, goals]);

  // Savings distribution (current savings across different goals)
  const savingsDistribution = useMemo(() => {
    return goals.map((goal) => ({
      name: goal.name,
      current: goal.current,
      target: goal.target,
    }));
  }, [goals]);

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
}
