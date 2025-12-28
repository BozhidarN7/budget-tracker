'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { Goal } from '@/types/budget';
import { useBudgetContext } from '@/contexts/budget-context';
import { mockCategories, mockGoals, mockTransactions } from '@/mock';
import {
  formatMonthKey,
  formatMonthKeyToReadable,
  getCurrentMonthKey,
  getPreviousMonthKey,
  parseDate,
} from '@/utils';
import { ensureCategoriesMonthData } from '@/utils/category-utils';

const MONTHLY_TRENDS_LIMIT = 6;
const MONTHLY_GOAL_TOKEN = 'monthly';

const isMonthlyGoal = (goal: Goal): boolean =>
  goal.name.toLowerCase().includes(MONTHLY_GOAL_TOKEN);

const getGoalMonthKey = (goal: Goal): string =>
  formatMonthKey(parseDate(goal.targetDate));

const findMonthlyGoalForMonth = (
  goals: Goal[],
  monthKey: string,
): Goal | undefined => goals.find((goal) => getGoalMonthKey(goal) === monthKey);

export default function useBudgetData() {
  const { transactions, categories, goals, isLoading, selectedMonth, addGoal } =
    useBudgetContext();
  const isUsingMockGoals = goals.length === 0;

  // Use real data if available, otherwise fall back to mock data
  const data = useMemo(() => {
    const transactionsData =
      transactions.length > 0 ? transactions : mockTransactions;
    const categoriesData = categories.length > 0 ? categories : mockCategories;
    const goalsData = goals.length > 0 ? goals : mockGoals;

    // Ensure all categories have data for the selected month with inherited limits
    const categoriesWithMonthData = ensureCategoriesMonthData(
      categoriesData,
      selectedMonth,
    );

    return {
      transactionsData,
      categoriesData: categoriesWithMonthData,
      goalsData,
      isLoading,
    };
  }, [transactions, categories, goals, isLoading, selectedMonth]);
  const actualMonthlyGoals = useMemo(
    () => goals.filter(isMonthlyGoal),
    [goals],
  );
  const monthlyGoalsForView = useMemo(
    () => data.goalsData.filter(isMonthlyGoal),
    [data.goalsData],
  );
  const monthlyGoalForSelectedMonth = useMemo(() => {
    return findMonthlyGoalForMonth(monthlyGoalsForView, selectedMonth) ?? null;
  }, [monthlyGoalsForView, selectedMonth]);
  const existingMonthlyGoalForSelectedMonth = useMemo(() => {
    return findMonthlyGoalForMonth(actualMonthlyGoals, selectedMonth) ?? null;
  }, [actualMonthlyGoals, selectedMonth]);
  // Filter transactions for the selected month
  const filteredTransactions = useMemo(() => {
    return data.transactionsData.filter((transaction) => {
      const transactionDate = parseDate(transaction.date);
      const transactionMonth = formatMonthKey(transactionDate);
      return transactionMonth === selectedMonth;
    });
  }, [data.transactionsData, selectedMonth]);

  // All transactions (unfiltered) for statistics
  const allTransactions = data.transactionsData;

  // Calculate total income for the selected month
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses for the selected month
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate net balance for the selected month
  const netBalance = totalIncome - totalExpenses;

  // Get recent transactions (last 5) for the selected month
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate expenses by category for the pie chart
  const expensesByCategory = data.categoriesData
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

  const monthlyTrendRange = useMemo(() => {
    const months: string[] = [];
    const [yearStr, monthStr] = selectedMonth.split('-');
    const baseYear = Number.parseInt(yearStr, 10);
    const baseMonthIndex = Number.parseInt(monthStr, 10) - 1;

    for (let offset = MONTHLY_TRENDS_LIMIT - 1; offset >= 0; offset -= 1) {
      const date = new Date(baseYear, baseMonthIndex - offset, 1);
      months.push(formatMonthKey(date));
    }

    return months;
  }, [selectedMonth]);

  // Monthly trends data for the line chart
  const monthlyTrends = useMemo(() => {
    const monthBuckets = new Map<
      string,
      {
        income: number;
        expenses: number;
      }
    >();

    data.transactionsData.forEach((transaction) => {
      const monthKey = formatMonthKey(parseDate(transaction.date));
      const bucket = monthBuckets.get(monthKey) ?? { income: 0, expenses: 0 };

      if (transaction.type === 'income') {
        bucket.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        bucket.expenses += transaction.amount;
      }

      monthBuckets.set(monthKey, bucket);
    });

    return monthlyTrendRange.map((monthKey) => {
      const bucket = monthBuckets.get(monthKey) ?? { income: 0, expenses: 0 };

      return {
        monthKey,
        month: formatMonthKeyToReadable(monthKey),
        income: bucket.income,
        expenses: bucket.expenses,
      };
    });
  }, [data.transactionsData, monthlyTrendRange]);

  // Category limits data for the selected month
  const categoryLimits = data.categoriesData
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

  const primaryGoal = monthlyGoalForSelectedMonth;

  const derivedTarget = primaryGoal
    ? (primaryGoal.displayTarget ?? primaryGoal.target ?? 0)
    : 0;
  const derivedCurrent = primaryGoal
    ? (primaryGoal.displayCurrent ?? primaryGoal.current ?? 0)
    : 0;
  const savingsProgress =
    derivedTarget > 0 ? (derivedCurrent / derivedTarget) * 100 : 0;

  const savingsBreakdown = {
    totalIncome,
    totalExpenses,
    availableForSavings: netBalance,
  };
  const autoCreationPlan = useMemo(() => {
    const currentMonthKey = getCurrentMonthKey();

    if (
      isUsingMockGoals ||
      isLoading ||
      selectedMonth !== currentMonthKey ||
      existingMonthlyGoalForSelectedMonth
    ) {
      return null;
    }

    const previousMonthKey = getPreviousMonthKey(selectedMonth);
    const exactPreviousGoal = findMonthlyGoalForMonth(
      actualMonthlyGoals,
      previousMonthKey,
    );

    const fallbackPreviousGoal = actualMonthlyGoals
      .filter((goal) => getGoalMonthKey(goal) < selectedMonth)
      .sort((a, b) => getGoalMonthKey(b).localeCompare(getGoalMonthKey(a)))[0];

    const sourceGoal = exactPreviousGoal ?? fallbackPreviousGoal;

    if (!sourceGoal) {
      return null;
    }

    const targetAmount = sourceGoal.displayTarget ?? sourceGoal.target ?? 0;
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = Number.parseInt(yearStr, 10);
    const month = Number.parseInt(monthStr, 10);
    const targetDateLabel = format(new Date(year, month, 0), 'MMM d, yyyy');

    const goalPayload: Omit<Goal, 'id'> = {
      name: `Monthly Savings Goal - ${formatMonthKeyToReadable(selectedMonth)}`,
      target: targetAmount,
      current: 0,
      targetDate: targetDateLabel,
      description: sourceGoal.description ?? 'Monthly savings goal',
    };

    return {
      monthKey: selectedMonth,
      goal: goalPayload,
    };
  }, [
    actualMonthlyGoals,
    existingMonthlyGoalForSelectedMonth,
    isLoading,
    isUsingMockGoals,
    selectedMonth,
  ]);

  useQuery({
    queryKey: ['goals', 'auto-monthly', autoCreationPlan?.monthKey ?? 'idle'],
    queryFn: async () => {
      if (!autoCreationPlan) {
        return null;
      }
      addGoal(autoCreationPlan.goal);
      return null;
    },
    enabled: Boolean(autoCreationPlan),
    retry: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    transactions: filteredTransactions,
    allTransactions,
    categories: data.categoriesData,
    goals: data.goalsData,
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
    expensesByCategory,
    monthlyTrends,
    categoryLimits,
    savingsGoal: derivedTarget,
    currentSavings: derivedCurrent,
    primaryGoal,
    savingsProgress,
    savingsBreakdown,
    isLoading: data.isLoading,
    selectedMonth,
  };
}
