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

  const { recurringInstances, combinedTransactions, eligibleRecurringInstances } =
    useRecurringInstances(
      {
        recurringTransactions: data.recurringData,
        selectedMonth,
      },
      data.transactionsData,
    );

  const upcomingRecurringReminders = useRecurringReminders({
    recurringTransactions: data.recurringData,
  });

  const eligibleCombinedTransactions = [
    ...data.transactionsData,
    ...eligibleRecurringInstances,
  ];

  const {
    filteredTransactions,
    recentTransactions,
  } = useTransactionMetrics(combinedTransactions, selectedMonth);

  const {
    totalIncome,
    totalExpenses,
    netBalance,
  } = useTransactionMetrics(eligibleCombinedTransactions, selectedMonth);

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
    categories: data.categoriesData,
    currentSavings: derivedCurrent,
    eligibleRecurringInstances,
    eligibleTransactions: eligibleCombinedTransactions,
    goals: data.goalsData,
    isLoading: data.isLoading,
    monthlyTrends,
    netBalance,
    primaryGoal,
    recentTransactions,
    recurringInstances,
    recurringTransactions: data.recurringData,
    savingsBreakdown,
    savingsGoal: derivedTarget,
    savingsProgress,
    selectedMonth,
    totalExpenses,
    totalIncome,
    transactions: filteredTransactions,
    upcomingRecurringReminders,
    allTransactions: combinedTransactions,
    categoryLimits,
    expensesByCategory,
  };
}
