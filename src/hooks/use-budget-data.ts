'use client';

import {
  getCategoryLimits,
  getExpensesByCategory,
} from './use-budget-data/utils/category-metrics';
import { useBudgetSources } from './use-budget-data/use-budget-sources';
import { useMonthlyGoals } from './use-budget-data/use-monthly-goals';
import { useMonthlyTrends } from './use-budget-data/use-monthly-trends';
import { useRecurringInstances } from './use-budget-data/use-recurring-instances';
import { useRecurringReminders } from './use-budget-data/use-recurring-reminders';
import { useTransactionMetrics } from './use-budget-data/use-transaction-metrics';
import { useBudgetContext } from '@/contexts/budget-context';

export default function useBudgetData() {
  const {
    transactions,
    recurringTransactions,
    categories,
    goals,
    isLoading,
    selectedMonth,
    addGoal,
  } = useBudgetContext();

  const data = useBudgetSources({
    transactions,
    recurringTransactions,
    categories,
    goals,
    isLoading,
    selectedMonth,
  });

  const { recurringInstances } = useRecurringInstances(
    {
      recurringTransactions: data.recurringData,
      selectedMonth,
    },
    data.transactionsData,
  );

  const upcomingRecurringReminders = useRecurringReminders({
    recurringTransactions: data.recurringData,
  });

  const {
    materializedTransactions,
    selectedMonthTransactions,
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
  } = useTransactionMetrics(data.transactionsData, selectedMonth);

  const { monthlyTrends } = useMonthlyTrends(
    data.transactionsData,
    selectedMonth,
  );

  const { derivedCurrent, derivedTarget, primaryGoal, savingsProgress } =
    useMonthlyGoals({
      goals: data.goalsData,
      isLoading: data.isLoading,
      selectedMonth,
      addGoal,
    });

  const expensesByCategory = getExpensesByCategory(
    data.categoriesData,
    selectedMonth,
  );
  const categoryLimits = getCategoryLimits(data.categoriesData, selectedMonth);

  const savingsBreakdown = {
    totalIncome,
    totalExpenses,
    availableForSavings: netBalance,
  };

  return {
    transactions: selectedMonthTransactions,
    materializedTransactions,
    recurringTransactions: data.recurringData,
    recurringInstances,
    upcomingRecurringReminders,
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
