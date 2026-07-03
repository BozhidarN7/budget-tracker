import type { MonthTransactionPageState } from './month-transactions';
import { sortTransactionsByDateDesc } from './month-transactions';
import type { Category, Transaction } from '@/types/budget';
import {
  updateTransaction as apiUpdateTransaction,
  createTransaction,
  deleteTransaction,
} from '@/api/budget-tracker-api/transactions';
import { updateCategory as apiUpdateCategory } from '@/api/budget-tracker-api/categories';
import { formatMonthKey, parseDate } from '@/utils';
import { applyCategorySpendChange } from '@/utils/transactions/apply-category-spend-change';

function getMonthKey(transaction: Pick<Transaction, 'date'>) {
  return formatMonthKey(parseDate(transaction.date));
}

// Transaction update/delete operations still own client-side category spend updates.
// Add operations now trust the server mutation response as source of truth.
// Recurring materialization updates category spend on the backend.
export const updateCategorySpending = async (
  categories: Category[],
  transaction: Transaction,
  isAdding = true,
): Promise<Category[]> => {
  const updatedCategories = categories.map((category) =>
    applyCategorySpendChange(
      category,
      transaction,
      isAdding ? 'add' : 'remove',
    ),
  );

  const categoryToUpdate = categories.find(
    (c) => c.name === transaction.category && c.type === transaction.type,
  );

  if (categoryToUpdate) {
    try {
      const updatedCategory = updatedCategories.find(
        (category) => category.id === categoryToUpdate.id,
      );

      if (!updatedCategory) {
        return updatedCategories;
      }

      await apiUpdateCategory(categoryToUpdate.id, {
        monthlyData: updatedCategory.monthlyData,
      });
    } catch (error) {
      console.error('Failed to update category in database:', error);
    }
  }

  return updatedCategories;
};

// Create transaction operations factory
export const createTransactionOperations = (
  transactions: Transaction[],
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
  setError: (value: string | null) => void,
  selectedMonth: string,
  updateMonthState: (
    month: string,
    updater: (prev: MonthTransactionPageState) => MonthTransactionPageState,
  ) => void,
  markMonthStale: (month: string) => void,
) => {
  // Add transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const createResult = await createTransaction(transaction);
      const newTransaction = createResult.transaction;

      if (getMonthKey(newTransaction) === selectedMonth) {
        updateMonthState(selectedMonth, (prev) => ({
          ...prev,
          items: sortTransactionsByDateDesc([...prev.items, newTransaction]),
          hasLoaded: prev.hasLoaded,
        }));
      } else {
        markMonthStale(getMonthKey(newTransaction));
      }

      setCategories(createResult.categories);

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

      const mergedTransaction = {
        ...originalTransaction,
        ...updatedTransaction,
      } as Transaction;
      const originalMonth = getMonthKey(originalTransaction);
      const nextMonth = getMonthKey(mergedTransaction);

      if (originalMonth === selectedMonth && nextMonth === selectedMonth) {
        updateMonthState(selectedMonth, (prev) => ({
          ...prev,
          items: sortTransactionsByDateDesc(
            prev.items.map((item) =>
              item.id === id ? { ...item, ...mergedTransaction } : item,
            ),
          ),
        }));
      } else {
        if (originalMonth === selectedMonth) {
          updateMonthState(selectedMonth, (prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
          }));
        }

        markMonthStale(originalMonth);
        markMonthStale(nextMonth);
      }

      // Add spending to the new/updated category
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

      if (getMonthKey(transaction) === selectedMonth) {
        updateMonthState(selectedMonth, (prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
        }));
      } else {
        markMonthStale(getMonthKey(transaction));
      }

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
