'use client';

import { useState } from 'react';
import type { Category, Goal, Transaction } from '@/types/budget';

// Mock data for the budget tracker
const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salary',
    amount: 3500,
    date: 'May 1, 2023',
    category: 'Salary',
    type: 'income',
  },
  {
    id: '2',
    description: 'Freelance Work',
    amount: 1200,
    date: 'May 5, 2023',
    category: 'Freelance',
    type: 'income',
  },
  {
    id: '3',
    description: 'Grocery Shopping',
    amount: 120.5,
    date: 'May 7, 2023',
    category: 'Food',
    type: 'expense',
  },
  {
    id: '4',
    description: 'Electricity Bill',
    amount: 85.2,
    date: 'May 10, 2023',
    category: 'Utilities',
    type: 'expense',
  },
  {
    id: '5',
    description: 'Movie Tickets',
    amount: 35.0,
    date: 'May 12, 2023',
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '6',
    description: 'Gas',
    amount: 45.75,
    date: 'May 15, 2023',
    category: 'Transport',
    type: 'expense',
  },
  {
    id: '7',
    description: 'Restaurant Dinner',
    amount: 78.9,
    date: 'May 18, 2023',
    category: 'Food',
    type: 'expense',
  },
  {
    id: '8',
    description: 'Online Course',
    amount: 199.99,
    date: 'May 20, 2023',
    category: 'Education',
    type: 'expense',
  },
  {
    id: '9',
    description: 'Mobile Phone Bill',
    amount: 65.0,
    date: 'May 22, 2023',
    category: 'Utilities',
    type: 'expense',
  },
  {
    id: '10',
    description: 'Bonus',
    amount: 500,
    date: 'May 25, 2023',
    category: 'Salary',
    type: 'income',
  },
];

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food',
    limit: 500,
    spent: 199.4,
    color: '#ef4444',
  },
  {
    id: '2',
    name: 'Transport',
    limit: 200,
    spent: 45.75,
    color: '#f59e0b',
  },
  {
    id: '3',
    name: 'Entertainment',
    limit: 150,
    spent: 35.0,
    color: '#10b981',
  },
  {
    id: '4',
    name: 'Utilities',
    limit: 300,
    spent: 150.2,
    color: '#3b82f6',
  },
  {
    id: '5',
    name: 'Education',
    limit: 200,
    spent: 199.99,
    color: '#8b5cf6',
  },
  {
    id: '6',
    name: 'Shopping',
    limit: 300,
    spent: 0,
    color: '#ec4899',
  },
];

const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 10000,
    current: 5000,
    targetDate: 'Dec 31, 2023',
    description: 'Save for unexpected expenses',
  },
  {
    id: '2',
    name: 'New Laptop',
    target: 2000,
    current: 1200,
    targetDate: 'Aug 15, 2023',
    description: 'Replace old laptop',
  },
  {
    id: '3',
    name: 'Vacation',
    target: 3000,
    current: 1500,
    targetDate: 'Jun 30, 2024',
    description: 'Summer vacation fund',
  },
];

export default function useBudgetData() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [categories] = useState<Category[]>(mockCategories);
  const [goals] = useState<Goal[]>(mockGoals);

  // Calculate total income
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate net balance
  const netBalance = totalIncome - totalExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate expenses by category for the pie chart
  const expensesByCategory = categories
    .map((category) => ({
      name: category.name,
      value: transactions
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
  const categoryLimits = categories
    .filter((category) => category.spent > 0)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3);

  // Savings goal data
  const savingsGoal = 1500;
  const currentSavings = netBalance;

  return {
    transactions,
    categories,
    goals,
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
    expensesByCategory,
    monthlyTrends,
    categoryLimits,
    savingsGoal,
    currentSavings,
  };
}
