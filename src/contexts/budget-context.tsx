'use client';

import type React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useState } from 'react';
import type { BudgetProviderProps, BudgetState } from './budget/types';
import { defaultBudgetContext } from './budget/default-context';
import { createTransactionOperations } from './budget/transaction-operations';
import { createRecurringTransactionOperations } from './budget/recurring-transaction-operations';
import { createCategoryOperations } from './budget/category-operations';
import { createGoalOperations } from './budget/goal-operations';
import {
  budgetQueryKeys,
  createEmptyMonthState,
  fetchMonthTransactions,
  sortTransactionsByDateDesc,
} from './budget/month-transactions';
import { useMonthTransactions } from './budget/use-month-transactions';
import { getCurrentMonthKey } from '@/utils';
import type { PaginatedTransactionsResponse } from '@/types/budget';

const BudgetContext = createContext(defaultBudgetContext);

export default function BudgetProvider({
  children,
  initialCurrentMonth,
  initialTransactionsPage,
  initialRecurringTransactions,
  initialCategories,
  initialGoals,
}: BudgetProviderProps) {
  const queryClient = useQueryClient();
  const currentMonth = initialCurrentMonth ?? getCurrentMonthKey();

  // State
  const [state, setState] = useState<BudgetState>({
    recurringTransactions: initialRecurringTransactions || [],
    categories: initialCategories || [],
    goals: initialGoals || [],
    isLoading:
      !initialTransactionsPage ||
      !initialRecurringTransactions ||
      !initialCategories ||
      !initialGoals,
    error: null,
    selectedMonth: currentMonth,
  });

  // Destructure state for easier access
  const {
    recurringTransactions,
    categories,
    goals,
    isLoading,
    error,
    selectedMonth,
  } = state;

  // State setters
  const setRecurringTransactions = useCallback(
    (value: React.SetStateAction<typeof recurringTransactions>) => {
      setState((prev) => ({
        ...prev,
        recurringTransactions:
          typeof value === 'function'
            ? value(prev.recurringTransactions)
            : value,
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

  const {
    bootstrapQuery,
    ensureMonthTransactionsLoaded,
    refetch,
    transactionsByMonth,
    updateMonthState,
  } = useMonthTransactions({
    initialCurrentMonth,
    initialTransactionsPage,
    initialRecurringTransactions,
    initialCategories,
    initialGoals,
    setState,
    setRecurringTransactions,
    setCategories,
    setGoals,
    setIsLoading,
    setError,
    setSelectedMonth,
  });

  const selectedMonthState =
    transactionsByMonth[selectedMonth] ?? createEmptyMonthState();

  const loadMoreTransactions = useCallback(async () => {
    const monthState =
      transactionsByMonth[selectedMonth] ?? createEmptyMonthState();

    if (!monthState.nextCursor || monthState.isLoadingMore) {
      return;
    }

    updateMonthState(selectedMonth, (prev) => ({
      ...prev,
      isLoadingMore: true,
      error: null,
    }));

    try {
      const response = await fetchMonthTransactions(
        selectedMonth,
        monthState.nextCursor,
      );
      queryClient.setQueryData(
        budgetQueryKeys.transactions(selectedMonth),
        (prev?: PaginatedTransactionsResponse) => ({
          items: sortTransactionsByDateDesc([
            ...(prev?.items ?? monthState.items),
            ...response.items,
          ]),
          nextCursor: response.nextCursor ?? null,
        }),
      );
      updateMonthState(selectedMonth, (prev) => ({
        ...prev,
        items: sortTransactionsByDateDesc([...prev.items, ...response.items]),
        nextCursor: response.nextCursor ?? null,
        isLoadingMore: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to load more transactions:', error);
      updateMonthState(selectedMonth, (prev) => ({
        ...prev,
        isLoadingMore: false,
        error: 'Failed to load more transactions',
      }));
    }
  }, [queryClient, selectedMonth, transactionsByMonth, updateMonthState]);

  const refreshSelectedMonthTransactions = useCallback(async () => {
    updateMonthState(selectedMonth, () => ({
      ...createEmptyMonthState(),
      isStale: true,
    }));

    await queryClient.invalidateQueries({
      queryKey: budgetQueryKeys.transactions(selectedMonth),
    });
    await ensureMonthTransactionsLoaded(selectedMonth);
  }, [
    ensureMonthTransactionsLoaded,
    queryClient,
    selectedMonth,
    updateMonthState,
  ]);

  const currentTransactions = selectedMonthState.items;

  const markMonthStale = useCallback(
    (month: string) => {
      updateMonthState(month, (prev) => ({
        ...prev,
        isStale: true,
      }));
    },
    [updateMonthState],
  );

  // Create operations
  const transactionOps = createTransactionOperations(
    currentTransactions,
    categories,
    setCategories,
    setError,
    selectedMonth,
    updateMonthState,
    markMonthStale,
  );

  const recurringTransactionOps = createRecurringTransactionOperations(
    recurringTransactions,
    setRecurringTransactions,
    setError,
    refetch,
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
        transactions: currentTransactions,
        recurringTransactions,
        categories,
        goals,
        isLoading:
          isLoading ||
          bootstrapQuery.isFetching ||
          selectedMonthState.isLoadingInitial,
        error: error ?? bootstrapQuery.error?.message ?? null,
        selectedMonth,
        transactionPagination: {
          hasMore: selectedMonthState.nextCursor !== null,
          isLoadingMore: selectedMonthState.isLoadingMore,
          isLoadingInitial: selectedMonthState.isLoadingInitial,
          error: selectedMonthState.error,
        },
        setSelectedMonth,
        refetch,
        loadMoreTransactions,
        ensureMonthTransactionsLoaded,
        refreshSelectedMonthTransactions,
        // Transaction operations
        ...transactionOps,
        // Recurring transaction operations
        ...recurringTransactionOps,
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
