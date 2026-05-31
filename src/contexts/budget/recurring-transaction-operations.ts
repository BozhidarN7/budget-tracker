import type React from 'react';
import { toast } from 'sonner';
import type {
  MaterializationSummary,
  RecurringTransaction,
} from '@/types/budget';
import {
  materializeRecurringTransactions as apiMaterializeRecurringTransactions,
  updateRecurringTransaction as apiUpdateRecurringTransaction,
  createRecurringTransaction,
  deleteRecurringTransaction,
} from '@/api/budget-tracker-api/recurring-transactions';

export const createRecurringTransactionOperations = (
  recurringTransactions: RecurringTransaction[],
  setRecurringTransactions: React.Dispatch<
    React.SetStateAction<RecurringTransaction[]>
  >,
  setError: (value: string | null) => void,
  refetch: () => Promise<void>,
) => {
  const addRecurringTransaction = async (
    transaction: Omit<RecurringTransaction, 'id'>,
  ) => {
    try {
      const newRecurringTransaction =
        await createRecurringTransaction(transaction);
      setRecurringTransactions((prev) => [...prev, newRecurringTransaction]);
      return newRecurringTransaction;
    } catch (err) {
      setError('Failed to add recurring transaction');
      throw err;
    }
  };

  const updateRecurringTransaction = async (
    id: string,
    transaction: Partial<RecurringTransaction>,
  ) => {
    try {
      const updatedRecurringTransaction = await apiUpdateRecurringTransaction(
        id,
        transaction,
      );
      setRecurringTransactions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedRecurringTransaction } : item,
        ),
      );
      return updatedRecurringTransaction;
    } catch (err) {
      setError('Failed to update recurring transaction');
      throw err;
    }
  };

  const removeRecurringTransaction = async (id: string) => {
    try {
      await deleteRecurringTransaction(id);
      setRecurringTransactions((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete recurring transaction');
      throw err;
    }
  };

  const materializeRecurringTransactions =
    async (): Promise<MaterializationSummary> => {
      try {
        const summary = await apiMaterializeRecurringTransactions();
        toast.success(
          `Sync complete: ${summary.processed} processed, ${summary.created} created, ${summary.skipped} skipped, ${summary.failures} failures`,
        );
        await refetch();
        return summary;
      } catch (err) {
        setError('Failed to materialize recurring transactions');
        toast.error('Failed to sync recurring transactions');
        throw err;
      }
    };

  return {
    addRecurringTransaction,
    updateRecurringTransaction,
    removeRecurringTransaction,
    materializeRecurringTransactions,
  };
};
