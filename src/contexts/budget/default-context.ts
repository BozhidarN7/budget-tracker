import type { BudgetContextType } from './types';
import { getCurrentMonthKey } from '@/utils';

export const defaultBudgetContext: BudgetContextType = {
  transactions: [],
  recurringTransactions: [],
  categories: [],
  goals: [],
  isLoading: true,
  error: null,
  selectedMonth: getCurrentMonthKey(),
  transactionPagination: {
    hasMore: false,
    isLoadingMore: false,
    isLoadingInitial: false,
    error: null,
  },
  setSelectedMonth: () => {},
  refetch: async () => {},
  loadMoreTransactions: async () => {},
  ensureMonthTransactionsLoaded: async () => {},
  refreshSelectedMonthTransactions: async () => {},
  addTransaction: async (_transaction) => {
    throw new Error('BudgetContext not initialized: addTransaction');
  },
  updateTransaction: async (_id, _transaction) => {
    throw new Error('BudgetContext not initialized: updateTransaction');
  },
  removeTransaction: async (_id) => {
    throw new Error('BudgetContext not initialized: removeTransaction');
  },
  addRecurringTransaction: async (_transaction) => {
    throw new Error('BudgetContext not initialized: addRecurringTransaction');
  },
  updateRecurringTransaction: async (_id, _transaction) => {
    throw new Error(
      'BudgetContext not initialized: updateRecurringTransaction',
    );
  },
  removeRecurringTransaction: async (_id) => {
    throw new Error(
      'BudgetContext not initialized: removeRecurringTransaction',
    );
  },
  materializeRecurringTransactions: async () => {
    throw new Error(
      'BudgetContext not initialized: materializeRecurringTransactions',
    );
  },
  addCategory: async (_category) => {
    throw new Error('BudgetContext not initialized: addCategory');
  },
  updateCategory: async (_id, _category) => {
    throw new Error('BudgetContext not initialized: updateCategory');
  },
  removeCategory: async (_id) => {
    throw new Error('BudgetContext not initialized: removeCategory');
  },
  addGoal: async (_goal) => {
    throw new Error('BudgetContext not initialized: addGoal');
  },
  updateGoal: async (_id, _goal) => {
    throw new Error('BudgetContext not initialized: updateGoal');
  },
  removeGoal: async (_id) => {
    throw new Error('BudgetContext not initialized: removeGoal');
  },
};
