import type React from 'react';
import type {
  Category,
  Goal,
  MaterializationSummary,
  PaginatedTransactionsResponse,
  RecurringTransaction,
  Transaction,
} from '@/types/budget';

// Define the context types
export type BudgetContextType = {
  // State
  // Loaded transactions for the currently selected month.
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  selectedMonth: string;
  transactionPagination: {
    hasMore: boolean;
    isLoadingMore: boolean;
    isLoadingInitial: boolean;
    error: string | null;
  };
  setSelectedMonth: (month: string) => void;
  refetch: () => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  ensureMonthTransactionsLoaded: (month: string) => Promise<void>;
  refreshSelectedMonthTransactions: () => Promise<void>;

  // Transaction operations
  addTransaction: (
    transaction: Omit<Transaction, 'id'>,
  ) => Promise<Transaction>;
  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>,
  ) => Promise<Transaction>;
  removeTransaction: (id: string) => Promise<boolean>;

  // Recurring transaction operations
  addRecurringTransaction: (
    transaction: Omit<RecurringTransaction, 'id'>,
  ) => Promise<RecurringTransaction>;
  updateRecurringTransaction: (
    id: string,
    transaction: Partial<RecurringTransaction>,
  ) => Promise<RecurringTransaction>;
  removeRecurringTransaction: (id: string) => Promise<boolean>;
  materializeRecurringTransactions: () => Promise<MaterializationSummary>;

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
  initialCurrentMonth?: string;
  initialTransactionsPage?: PaginatedTransactionsResponse;
  initialRecurringTransactions?: RecurringTransaction[];
  initialCategories?: Category[];
  initialGoals?: Goal[];
};

// Define the state type
export type BudgetState = {
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  selectedMonth: string;
};
