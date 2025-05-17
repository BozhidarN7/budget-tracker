'use client';

import { useMemo } from 'react';
import useBudgetData from './use-budget-data';

export default function useStatisticsData() {
  const { transactions, categories, goals } = useBudgetData();

  // Daily spending data
  const dailySpending = useMemo(
    () => [
      { period: 'May 1', expenses: 120, transactions: 2 },
      { period: 'May 2', expenses: 85, transactions: 3 },
      { period: 'May 3', expenses: 150, transactions: 4 },
      { period: 'May 4', expenses: 75, transactions: 2 },
      { period: 'May 5', expenses: 200, transactions: 5 },
      { period: 'May 6', expenses: 65, transactions: 2 },
      { period: 'May 7', expenses: 180, transactions: 3 },
    ],
    [],
  );

  // Weekly spending data
  const weeklySpending = useMemo(
    () => [
      { period: 'Week 1', expenses: 650, transactions: 12 },
      { period: 'Week 2', expenses: 720, transactions: 15 },
      { period: 'Week 3', expenses: 590, transactions: 10 },
      { period: 'Week 4', expenses: 810, transactions: 14 },
    ],
    [],
  );

  // Monthly spending data
  const monthlySpending = useMemo(
    () => [
      { period: 'Jan', expenses: 2800, transactions: 45 },
      { period: 'Feb', expenses: 2600, transactions: 42 },
      { period: 'Mar', expenses: 3100, transactions: 50 },
      { period: 'Apr', expenses: 2900, transactions: 48 },
      { period: 'May', expenses: 3200, transactions: 52 },
    ],
    [],
  );

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    return categories
      .map((category) => ({
        name: category.name,
        value: transactions
          .filter((t) => t.type === 'expense' && t.category === category.name)
          .reduce((sum, t) => sum + t.amount, 0),
      }))
      .filter((category) => category.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [categories, transactions]);

  // Category trends over time
  const categoryTrends = useMemo(
    () => [
      {
        month: 'Jan',
        Food: 450,
        Transport: 180,
        Entertainment: 120,
        Utilities: 250,
        Education: 150,
      },
      {
        month: 'Feb',
        Food: 420,
        Transport: 190,
        Entertainment: 140,
        Utilities: 230,
        Education: 180,
      },
      {
        month: 'Mar',
        Food: 480,
        Transport: 200,
        Entertainment: 160,
        Utilities: 260,
        Education: 200,
      },
      {
        month: 'Apr',
        Food: 460,
        Transport: 210,
        Entertainment: 150,
        Utilities: 240,
        Education: 190,
      },
      {
        month: 'May',
        Food: 500,
        Transport: 220,
        Entertainment: 170,
        Utilities: 270,
        Education: 210,
      },
    ],
    [],
  );

  // Category limits
  const categoryLimits = useMemo(() => {
    return categories.map((category) => ({
      name: category.name,
      spent: category.spent,
      limit: category.limit,
      color: category.color,
    }));
  }, [categories]);

  // Monthly income vs expenses comparison
  const monthlyComparison = useMemo(
    () => [
      { month: 'Jan', income: 4200, expenses: 2800, net: 1400 },
      { month: 'Feb', income: 4500, expenses: 2600, net: 1900 },
      { month: 'Mar', income: 4800, expenses: 3100, net: 1700 },
      { month: 'Apr', income: 4700, expenses: 2900, net: 1800 },
      { month: 'May', income: 5200, expenses: 3200, net: 2000 },
    ],
    [],
  );

  // Income source breakdown
  const incomeSourceBreakdown = useMemo(
    () => [
      { source: 'Salary', amount: 3500 },
      { source: 'Freelance', amount: 1200 },
      { source: 'Investments', amount: 350 },
      { source: 'Side Business', amount: 150 },
    ],
    [],
  );

  // Income vs expense ratio
  const incomeVsExpenseRatio = useMemo(
    () => [
      { month: 'Jan', ratio: 1.5, baseline: 1 },
      { month: 'Feb', ratio: 1.73, baseline: 1 },
      { month: 'Mar', ratio: 1.55, baseline: 1 },
      { month: 'Apr', ratio: 1.62, baseline: 1 },
      { month: 'May', ratio: 1.63, baseline: 1 },
    ],
    [],
  );

  // Savings rate
  const savingsRate = useMemo(
    () => [
      { month: 'Jan', rate: 33, target: 20 },
      { month: 'Feb', rate: 42, target: 20 },
      { month: 'Mar', rate: 35, target: 20 },
      { month: 'Apr', rate: 38, target: 20 },
      { month: 'May', rate: 38, target: 20 },
    ],
    [],
  );

  // Savings goal progress
  const savingsGoalProgress = useMemo(() => {
    return goals.map((goal) => ({
      name: goal.name,
      value: goal.current,
    }));
  }, [goals]);

  // Savings projection
  const savingsProjection = useMemo(
    () => [
      { month: 'Jun', optimistic: 2300, expected: 2000, conservative: 1800 },
      { month: 'Jul', optimistic: 4800, expected: 4000, conservative: 3500 },
      { month: 'Aug', optimistic: 7500, expected: 6000, conservative: 5100 },
      { month: 'Sep', optimistic: 10400, expected: 8000, conservative: 6600 },
      { month: 'Oct', optimistic: 13500, expected: 10000, conservative: 8000 },
      { month: 'Nov', optimistic: 16800, expected: 12000, conservative: 9300 },
      { month: 'Dec', optimistic: 20300, expected: 14000, conservative: 10500 },
    ],
    [],
  );

  // Savings distribution
  const savingsDistribution = useMemo(
    () => [
      { name: 'Emergency Fund', current: 5000, target: 10000 },
      { name: 'Retirement', current: 15000, target: 50000 },
      { name: 'Vacation', current: 1500, target: 3000 },
      { name: 'New Laptop', current: 1200, target: 2000 },
    ],
    [],
  );

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
