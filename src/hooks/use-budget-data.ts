'use client';

import {
  getCategoryLimits,
  getDashboardSummary,
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
    transactionPagination,
    recurringTransactions,
    categories,
    goals,
    isLoading,
    loadMoreTransactions,
    refreshSelectedMonthTransactions,
    ensureMonthTransactionsLoaded,
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

  const { loadedTransactions, selectedMonthTransactions, recentTransactions } =
    useTransactionMetrics(data.transactionsData, selectedMonth);

  const { monthlyTrends } = useMonthlyTrends(
    data.categoriesData,
    selectedMonth,
  );

  const dashboardSummary = getDashboardSummary(
    data.categoriesData,
    monthlyTrends.map((trend) => trend.monthKey),
    selectedMonth,
  );

  const totalIncome = dashboardSummary.currentMonth.income;
  const totalExpenses = dashboardSummary.currentMonth.expenses;
  const netBalance = dashboardSummary.currentMonth.net;

  const { derivedTarget, primaryGoal } = useMonthlyGoals({
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

  const savingsProgress =
    derivedTarget > 0 ? (netBalance / derivedTarget) * 100 : 0;

  return {
    transactions: selectedMonthTransactions,
    loadedTransactions,
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
    dashboardSummary,
    monthlyTrends,
    categoryLimits,
    savingsGoal: derivedTarget,
    currentSavings: netBalance,
    primaryGoal,
    savingsProgress,
    savingsBreakdown,
    isLoading: data.isLoading,
    loadMoreTransactions,
    refreshSelectedMonthTransactions,
    ensureMonthTransactionsLoaded,
    selectedMonth,
    transactionPagination,
  };
}
