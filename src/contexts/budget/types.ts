import type React from 'react';
import type { Category, Goal, Transaction } from '@/types/budget';

// Define the context types
export type BudgetContextType = {
  // State
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  refetch: () => Promise<void>;

  // Transaction operations
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>,
  ) => Promise<void>;
  removeTransaction: (id: string) => Promise<boolean>;

  // Category operations
  addCategory: (
    category: Omit<Category, 'id' | 'monthlyData'> & { limit?: number },
  ) => Promise<void>;
  updateCategory: (
    id: string,
    category: Partial<Omit<Category, 'monthlyData'>> & { limit?: number },
  ) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  // Goal operations
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
};

// Define the provider props
export type BudgetProviderProps = {
  children: React.ReactNode;
  initialTransactions?: Transaction[];
  initialCategories?: Category[];
  initialGoals?: Goal[];
};

// Define the state type
export type BudgetState = {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  selectedMonth: string;
};
