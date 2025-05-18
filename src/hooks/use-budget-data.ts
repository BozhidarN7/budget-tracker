'use client';

import { useMemo } from 'react';
import { useBudgetContext } from '@/contexts/budget-context';
import { mockCategories, mockGoals, mockTransactions } from '@/mock';

export default function useBudgetData() {
  const { transactions, categories, goals, isLoading } = useBudgetContext();

  // Use real data if available, otherwise fall back to mock data
  const data = useMemo(() => {
    const transactionsData =
      transactions.length > 0 ? transactions : mockTransactions;
    const categoriesData = categories.length > 0 ? categories : mockCategories;
    const goalsData = goals.length > 0 ? goals : mockGoals;

    return { transactionsData, categoriesData, goalsData, isLoading };
  }, [transactions, categories, goals, isLoading]);

  // Calculate total income
  const totalIncome = data.transactionsData
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses
  const totalExpenses = data.transactionsData
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate net balance
  const netBalance = totalIncome - totalExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = [...data.transactionsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate expenses by category for the pie chart
  const expensesByCategory = data.categoriesData
    .map((category) => ({
      name: category.name,
      value: data.transactionsData
        .filter((t) => t.type === 'expense' && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((category) => category.value > 0);

  // Monthly trends data for the line chart
  const monthlyTrends = [
    {
      month: 'Jan',
      income: 4200,
      expenses: 3100,
    },
    {
      month: 'Feb',
      income: 4500,
      expenses: 3300,
    },
    {
      month: 'Mar',
      income: 4800,
      expenses: 3500,
    },
    {
      month: 'Apr',
      income: 4700,
      expenses: 3600,
    },
    {
      month: 'May',
      income: 5200,
      expenses: 3750,
    },
  ];

  // Category limits data
  const categoryLimits = data.categoriesData
    .filter((category) => category.spent > 0)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3);

  // Savings goal data
  const savingsGoal = 1500;
  const currentSavings = netBalance;

  return {
    transactions: data.transactionsData,
    categories: data.categoriesData,
    goals: data.goalsData,
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
    expensesByCategory,
    monthlyTrends,
    categoryLimits,
    savingsGoal,
    currentSavings,
    isLoading: data.isLoading,
  };
}
