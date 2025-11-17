'use client';

import type React from 'react';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type {
  BudgetContextType,
  BudgetProviderProps,
  BudgetState,
} from './budget/types';
import { createTransactionOperations } from './budget/transaction-operations';
import { createCategoryOperations } from './budget/category-operations';
import { createGoalOperations } from './budget/goal-operations';
import { fetchBudgetData } from './budget/data-fetching';
import { getCurrentMonthKey } from '@/utils';

// Default values
const defaultContext: BudgetContextType = {
  transactions: [],
  categories: [],
  goals: [],
  isLoading: true,
  error: null,
  selectedMonth: getCurrentMonthKey(),
  setSelectedMonth: () => {},
  refetch: async () => {},

  // Transaction operations
  addTransaction: async (_transaction) => {
    throw new Error('BudgetContext not initialized: addTransaction');
  },
  updateTransaction: async (_id, _transaction) => {
    throw new Error('BudgetContext not initialized: updateTransaction');
  },
  removeTransaction: async (_id) => {
    throw new Error('BudgetContext not initialized: removeTransaction');
  },

  // Category operations
  addCategory: async (_category) => {
    throw new Error('BudgetContext not initialized: addCategory');
  },
  updateCategory: async (_id, _category) => {
    throw new Error('BudgetContext not initialized: updateCategory');
  },
  removeCategory: async (_id) => {
    throw new Error('BudgetContext not initialized: removeCategory');
  },

  // Goal operations
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

const BudgetContext = createContext<BudgetContextType>(defaultContext);

export default function BudgetProvider({
  children,
  initialTransactions,
  initialCategories,
  initialGoals,
}: BudgetProviderProps) {
  // State
  const [state, setState] = useState<BudgetState>({
    transactions: initialTransactions || [],
    categories: initialCategories || [],
    goals: initialGoals || [],
    isLoading: !initialTransactions || !initialCategories || !initialGoals,
    error: null,
    selectedMonth: getCurrentMonthKey(),
  });

  // Destructure state for easier access
  const { transactions, categories, goals, isLoading, error, selectedMonth } =
    state;

  // State setters
  const setTransactions = useCallback(
    (value: React.SetStateAction<typeof transactions>) => {
      setState((prev) => ({
        ...prev,
        transactions:
          typeof value === 'function' ? value(prev.transactions) : value,
      }));
    },
    [],
  );

  const setCategories = useCallback(
    (value: React.SetStateAction<typeof categories>) => {
      setState((prev) => ({
        ...prev,
        categories:
          typeof value === 'function' ? value(prev.categories) : value,
      }));
    },
    [],
  );

  const setGoals = useCallback((value: React.SetStateAction<typeof goals>) => {
    setState((prev) => ({
      ...prev,
      goals: typeof value === 'function' ? value(prev.goals) : value,
    }));
  }, []);

  const setIsLoading = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, isLoading: value }));
  }, []);

  const setError = useCallback((value: string | null) => {
    setState((prev) => ({ ...prev, error: value }));
  }, []);

  const setSelectedMonth = useCallback((value: string) => {
    setState((prev) => ({ ...prev, selectedMonth: value }));
  }, []);

  // Data fetching
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBudgetData();
      setTransactions(data.transactions);
      setCategories(data.categories);
      setGoals(data.goals);
    } catch (err) {
      setError('Failed to fetch budget data');
      console.error('Error fetching budget data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setTransactions, setCategories, setGoals]);

  // Fetch data if no initial data was provided
  useEffect(() => {
    if (!initialTransactions || !initialCategories || !initialGoals) {
      refetch();
    }
  }, [initialTransactions, initialCategories, initialGoals, refetch]);

  // Create operations
  const transactionOps = createTransactionOperations(
    transactions,
    categories,
    setTransactions,
    setCategories,
    setError,
  );

  const categoryOps = createCategoryOperations(
    categories,
    setCategories,
    setError,
    selectedMonth,
  );

  const goalOps = createGoalOperations(setGoals, setError);

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        categories,
        goals,
        isLoading,
        error,
        selectedMonth,
        setSelectedMonth,
        refetch,
        // Transaction operations
        ...transactionOps,
        // Category operations
        ...categoryOps,
        // Goal operations
        ...goalOps,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudgetContext = () => useContext(BudgetContext);
