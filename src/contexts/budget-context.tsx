'use client';

import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Category, Goal, Transaction } from '@/types/budget';
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from '@/api/budget-tracker-api/transactions';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '@/api/budget-tracker-api/categories';
import {
  createGoal,
  deleteGoal,
  fetchGoals,
  updateGoal,
} from '@/api/budget-tracker-api/goals';

type BudgetContextType = {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>,
  ) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
};

// Default values
const defaultContext: BudgetContextType = {
  transactions: [],
  categories: [],
  goals: [],
  isLoading: true,
  error: null,
  refetch: async () => {},
  addTransaction: async () => {},
  updateTransaction: async () => {},
  removeTransaction: async () => {},
  addCategory: async () => {},
  updateCategory: async () => {},
  removeCategory: async () => {},
  addGoal: async () => {},
  updateGoal: async () => {},
  removeGoal: async () => {},
};

const BudgetContext = createContext<BudgetContextType>(defaultContext);

export default function BudgetProvider({
  children,
  initialTransactions,
  initialCategories,
  initialGoals,
}: {
  children: React.ReactNode;
  initialTransactions?: Transaction[];
  initialCategories?: Category[];
  initialGoals?: Goal[];
}) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions || [],
  );
  const [categories, setCategories] = useState<Category[]>(
    initialCategories || [],
  );
  const [goals, setGoals] = useState<Goal[]>(initialGoals || []);
  const [isLoading, setIsLoading] = useState(
    !initialTransactions || !initialCategories || !initialGoals,
  );
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [transactionsData, categoriesData, goalsData] = await Promise.all([
        fetchTransactions(),
        fetchCategories(),
        fetchGoals(),
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setGoals(goalsData);
    } catch (err) {
      setError('Failed to fetch budget data');
      console.error('Error fetching budget data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data if no initial data was provided
  useEffect(() => {
    if (!initialTransactions || !initialCategories || !initialGoals) {
      fetchData();
    }
  }, [initialTransactions, initialCategories, initialGoals, fetchData]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await createTransaction(transaction);
      setTransactions((prev) => [...prev, newTransaction]);
    } catch (err) {
      setError('Failed to add transaction');
      throw err;
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      const newGoal = await createGoal(goal);
      setGoals((prev) => [...prev, newGoal]);
    } catch (err) {
      setError('Failed to add goal');
      throw err;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory = await createCategory(category);
      setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      setError('Failed to add category');
      throw err;
    }
  };

  const updateTransactionData = async (
    id: string,
    transaction: Partial<Transaction>,
  ) => {
    try {
      const updatedTransaction = await updateTransaction(id, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
      );
    } catch (err) {
      setError('Failed to update transaction');
      throw err;
    }
  };

  const updateCategoryData = async (
    id: string,
    category: Partial<Category>,
  ) => {
    try {
      const updatedCategory = await updateCategory(id, category);
      setCategories((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedCategory } : t)),
      );
    } catch (err) {
      setError('Failed to update category');
      throw err;
    }
  };

  const updateGoalData = async (id: string, goal: Partial<Goal>) => {
    try {
      const updatedGoal = await updateGoal(id, goal);
      setGoals((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedGoal } : t)),
      );
    } catch (err) {
      setError('Failed to update goal');
      throw err;
    }
  };

  const removeTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete transaction');
      throw err;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      throw err;
    }
  };

  const removeGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete goal');
      throw err;
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        categories,
        goals,
        isLoading,
        error,
        refetch: fetchData,
        addTransaction,
        updateTransaction: updateTransactionData,
        removeTransaction,
        addCategory,
        updateCategory: updateCategoryData,
        removeCategory,
        addGoal,
        updateGoal: updateGoalData,
        removeGoal,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudgetContext = () => useContext(BudgetContext);
