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
import { formatMonthKey, getCurrentMonthKey, parseDate } from '@/utils';

type BudgetContextType = {
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
  removeTransaction: (id: string) => Promise<void>;
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
  addTransaction: async () => {},
  updateTransaction: async () => {},
  removeTransaction: async () => {},
  // Category operations
  addCategory: async () => {},
  updateCategory: async () => {},
  removeCategory: async () => {},
  // Goal operations
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
  const [selectedMonth, setSelectedMonth] =
    useState<string>(getCurrentMonthKey());

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

  // Helper function to update category spending when transactions change
  const updateCategorySpending = useCallback(
    (transaction: Transaction, isAdding = true) => {
      const { category: categoryName, amount, type, date } = transaction;
      const transactionDate = parseDate(date);
      const monthKey = formatMonthKey(transactionDate);

      setCategories((prevCategories) => {
        return prevCategories.map((category) => {
          if (category.name === categoryName && category.type === type) {
            const monthlyData = { ...category.monthlyData };

            // Initialize month data if it doesn't exist
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = {
                limit: 0,
                spent: 0,
              };
            }

            // Update spent amount
            const currentSpent = monthlyData[monthKey].spent || 0;
            monthlyData[monthKey] = {
              ...monthlyData[monthKey],
              spent: isAdding ? currentSpent + amount : currentSpent - amount,
            };

            return {
              ...category,
              monthlyData,
            };
          }
          return category;
        });
      });
    },
    [],
  );

  // Transaction operations
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await createTransaction(transaction);
      setTransactions((prev) => [...prev, newTransaction]);

      // Update category spending
      updateCategorySpending(newTransaction);
    } catch (err) {
      setError('Failed to add transaction');
      throw err;
    }
  };

  const updateTransactionData = async (
    id: string,
    transaction: Partial<Transaction>,
  ) => {
    try {
      // Get the original transaction to update category spending correctly
      const originalTransaction = transactions.find((t) => t.id === id);
      if (!originalTransaction) {
        throw new Error('Transaction not found');
      }

      // Remove spending from the original category
      updateCategorySpending(originalTransaction, false);

      const updatedTransaction = await updateTransaction(id, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
      );

      // Add spending to the new/updated category
      const mergedTransaction = {
        ...originalTransaction,
        ...updatedTransaction,
      };
      updateCategorySpending(mergedTransaction);
    } catch (err) {
      setError('Failed to update transaction');
      throw err;
    }
  };

  const removeTransaction = async (id: string) => {
    try {
      // Get the transaction to update category spending correctly
      const transaction = transactions.find((t) => t.id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      // Remove spending from the category
      updateCategorySpending(transaction, false);
    } catch (err) {
      setError('Failed to delete transaction');
      throw err;
    }
  };

  // Category operations
  const addCategory = async (
    category: Omit<Category, 'id' | 'monthlyData'> & { limit?: number },
  ) => {
    try {
      const currentMonth = getCurrentMonthKey();
      const monthlyData = {
        [currentMonth]: {
          limit: category.limit || 0,
          spent: 0,
        },
      };

      const newCategory = await createCategory({
        name: category.name,
        color: category.color,
        type: category.type,
        monthlyData,
      });

      setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      setError('Failed to add category');
      throw err;
    }
  };

  const updateCategory = async (
    id: string,
    category: Partial<Omit<Category, 'monthlyData'>> & { limit?: number },
  ) => {
    try {
      const existingCategory = categories.find((c) => c.id === id);
      if (!existingCategory) {
        throw new Error('Category not found');
      }

      const updatedData: Partial<Category> = { ...category };

      // If limit is provided, update only the current month's limit
      if (category.limit !== undefined) {
        const currentMonth = selectedMonth;
        const monthlyData = { ...existingCategory.monthlyData };

        // Initialize month data if it doesn't exist
        if (!monthlyData[currentMonth]) {
          monthlyData[currentMonth] = {
            limit: 0,
            spent: 0,
          };
        }

        monthlyData[currentMonth] = {
          ...monthlyData[currentMonth],
          limit: category.limit,
        };

        updatedData.monthlyData = monthlyData;
        delete updatedData.limit; // Remove limit from the update object
      }

      const updatedCategory = await updateCategory(id, updatedData);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
      );
    } catch (err) {
      setError('Failed to update category');
      throw err;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      throw err;
    }
  };

  // Goal operations
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      const newGoal = await createGoal(goal);
      setGoals((prev) => [...prev, newGoal]);
    } catch (err) {
      setError('Failed to add goal');
      throw err;
    }
  };

  const updateGoalData = async (id: string, goal: Partial<Goal>) => {
    try {
      const updatedGoal = await updateGoal(id, goal);
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...updatedGoal } : g)),
      );
    } catch (err) {
      setError('Failed to update goal');
      throw err;
    }
  };

  const removeGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
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
        selectedMonth,
        setSelectedMonth,
        refetch: fetchData,
        // Transaction operations
        addTransaction,
        updateTransaction: updateTransactionData,
        removeTransaction,
        // Category operations
        addCategory,
        updateCategory,
        removeCategory,
        // Goal operations
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
