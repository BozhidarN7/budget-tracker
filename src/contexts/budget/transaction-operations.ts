import type React from 'react';
import type { Category, Transaction } from '@/types/budget';
import {
  updateTransaction as apiUpdateTransaction,
  createTransaction,
  deleteTransaction,
} from '@/api/budget-tracker-api/transactions';
import { updateCategory as apiUpdateCategory } from '@/api/budget-tracker-api/categories';
import { formatMonthKey, parseDate } from '@/utils';

// Helper function to update category spending
export const updateCategorySpending = async (
  categories: Category[],
  transaction: Transaction,
  isAdding = true,
): Promise<Category[]> => {
  const { category: categoryName, amount, type, date } = transaction;
  const transactionDate = parseDate(date);
  const monthKey = formatMonthKey(transactionDate);

  // First, create an updated categories array for the local state
  const updatedCategories = categories.map((category) => {
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

  // Then, find the category that needs to be updated in the database
  const categoryToUpdate = categories.find(
    (c) => c.name === categoryName && c.type === type,
  );
  if (categoryToUpdate) {
    try {
      const monthlyData = { ...categoryToUpdate.monthlyData };

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

      // Call the API to update the category in the database
      await apiUpdateCategory(categoryToUpdate.id, {
        monthlyData,
      });
    } catch (error) {
      console.error('Failed to update category in database:', error);
      // Don't throw the error here to prevent transaction operations from failing
      // Just log it and continue
    }
  }

  return updatedCategories;
};

// Create transaction operations factory
export const createTransactionOperations = (
  transactions: Transaction[],
  categories: Category[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
  setError: (value: string | null) => void,
) => {
  // Add transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await createTransaction(transaction);
      setTransactions((prev) => [...prev, newTransaction]);

      // Update category spending and save to database
      const updatedCategories = await updateCategorySpending(
        categories,
        newTransaction as Transaction,
      );
      setCategories(updatedCategories);

      return newTransaction;
    } catch (err) {
      setError('Failed to add transaction');
      throw err;
    }
  };

  // Update transaction
  const updateTransaction = async (
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
      const categoriesAfterRemoval = await updateCategorySpending(
        categories,
        originalTransaction,
        false,
      );
      setCategories(categoriesAfterRemoval);

      const updatedTransaction = await apiUpdateTransaction(id, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
      );

      // Add spending to the new/updated category
      const mergedTransaction = {
        ...originalTransaction,
        ...updatedTransaction,
      } as Transaction;
      const finalCategories = await updateCategorySpending(
        categoriesAfterRemoval,
        mergedTransaction,
      );
      setCategories(finalCategories);

      return updatedTransaction;
    } catch (err) {
      setError('Failed to update transaction');
      throw err;
    }
  };

  // Remove transaction
  const removeTransaction = async (id: string) => {
    try {
      // Get the transaction to update category spending correctly
      const transaction = transactions.find((t) => t.id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      // Remove spending from the category and update database
      const updatedCategories = await updateCategorySpending(
        categories,
        transaction,
        false,
      );
      setCategories(updatedCategories);

      return true;
    } catch (err) {
      setError('Failed to delete transaction');
      throw err;
    }
  };

  return {
    addTransaction,
    updateTransaction,
    removeTransaction,
  };
};
