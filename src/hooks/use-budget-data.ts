'use client';

import { useMemo } from 'react';
import { useBudgetContext } from '@/contexts/budget-context';
import { mockCategories, mockGoals, mockTransactions } from '@/mock';
import { formatMonthKey, parseDate } from '@/utils';

export default function useBudgetData() {
  const { transactions, categories, goals, isLoading, selectedMonth } =
    useBudgetContext();

  // Use real data if available, otherwise fall back to mock data
  const data = useMemo(() => {
    const transactionsData =
      transactions.length > 0 ? transactions : mockTransactions;
    const categoriesData = categories.length > 0 ? categories : mockCategories;
    const goalsData = goals.length > 0 ? goals : mockGoals;

    return { transactionsData, categoriesData, goalsData, isLoading };
  }, [transactions, categories, goals, isLoading]);

  // Filter transactions for the selected month
  const filteredTransactions = useMemo(() => {
    return data.transactionsData.filter((transaction) => {
      const transactionDate = parseDate(transaction.date);
      const transactionMonth = formatMonthKey(transactionDate);
      return transactionMonth === selectedMonth;
    });
  }, [data.transactionsData, selectedMonth]);

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

  // Savings goal data
  const savingsGoal = 1500;
  const currentSavings = netBalance;

  return {
    transactions: filteredTransactions,
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
    selectedMonth,
  };
}
