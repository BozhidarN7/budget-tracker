'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBudgetData } from './data-fetching';
import {
  type MonthTransactionPageState,
  type TransactionsByMonth,
  budgetQueryKeys,
  createEmptyMonthState,
  createSeededMonthState,
  fetchMonthTransactions,
} from './month-transactions';
import type { BudgetState } from './types';
import type { PaginatedTransactionsResponse } from '@/types/budget';
import { getCurrentMonthKey } from '@/utils';

type UseMonthTransactionsParams = {
  initialCurrentMonth?: string;
  initialTransactionsPage?: PaginatedTransactionsResponse;
  initialRecurringTransactions?: BudgetState['recurringTransactions'];
  initialCategories?: BudgetState['categories'];
  initialGoals?: BudgetState['goals'];
  setState: React.Dispatch<React.SetStateAction<BudgetState>>;
  setRecurringTransactions: (
    value: React.SetStateAction<BudgetState['recurringTransactions']>,
  ) => void;
  setCategories: (
    value: React.SetStateAction<BudgetState['categories']>,
  ) => void;
  setGoals: (value: React.SetStateAction<BudgetState['goals']>) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setSelectedMonth: (value: string) => void;
};

export function useMonthTransactions({
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
}: UseMonthTransactionsParams) {
  const queryClient = useQueryClient();
  const currentMonth = initialCurrentMonth ?? getCurrentMonthKey();
  const initialSelectedMonthState = initialTransactionsPage
    ? createSeededMonthState(initialTransactionsPage)
    : createEmptyMonthState();
  const [transactionsByMonth, setTransactionsByMonth] =
    useState<TransactionsByMonth>(() => {
      if (!initialTransactionsPage) {
        return {};
      }

      return {
        [currentMonth]: initialSelectedMonthState,
      };
    });

  const updateMonthState = useCallback(
    (
      month: string,
      updater: (prev: MonthTransactionPageState) => MonthTransactionPageState,
    ) => {
      setTransactionsByMonth((prev) => ({
        ...prev,
        [month]: updater(prev[month] ?? createEmptyMonthState()),
      }));
    },
    [],
  );

  const bootstrapQuery = useQuery({
    queryKey: budgetQueryKeys.bootstrap,
    queryFn: fetchBudgetData,
    enabled:
      !initialTransactionsPage ||
      !initialRecurringTransactions ||
      !initialCategories ||
      !initialGoals,
    initialData:
      initialTransactionsPage &&
      initialRecurringTransactions &&
      initialCategories &&
      initialGoals
        ? {
            currentMonth,
            transactionsPage: initialTransactionsPage,
            recurringTransactions: initialRecurringTransactions,
            categories: initialCategories,
            goals: initialGoals,
          }
        : undefined,
  });

  const ensureMonthTransactionsLoaded = useCallback(
    async (month: string) => {
      const monthState = transactionsByMonth[month];

      if (
        monthState &&
        monthState.hasLoaded &&
        !monthState.isStale &&
        !monthState.isLoadingInitial
      ) {
        return;
      }

      updateMonthState(month, (prev) => ({
        ...createEmptyMonthState(),
        items: prev.isStale ? [] : prev.items,
        hasLoaded: false,
        isLoadingInitial: true,
        error: null,
      }));

      try {
        const response = await queryClient.fetchQuery({
          queryKey: budgetQueryKeys.transactions(month),
          queryFn: () => fetchMonthTransactions(month),
        });
        updateMonthState(month, () => createSeededMonthState(response));
      } catch (error) {
        console.error('Failed to fetch month transactions:', error);
        updateMonthState(month, (prev) => ({
          ...prev,
          isLoadingInitial: false,
          error: 'Failed to load transactions for this month',
        }));
      }
    },
    [queryClient, transactionsByMonth, updateMonthState],
  );

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await queryClient.fetchQuery({
        queryKey: budgetQueryKeys.bootstrap,
        queryFn: fetchBudgetData,
      });
      const nextMonthState = createSeededMonthState(data.transactionsPage);

      setRecurringTransactions(data.recurringTransactions);
      setCategories(data.categories);
      setGoals(data.goals);
      setSelectedMonth(data.currentMonth);
      setTransactionsByMonth({
        [data.currentMonth]: nextMonthState,
      });
      queryClient.setQueryData(
        budgetQueryKeys.transactions(data.currentMonth),
        data.transactionsPage,
      );
    } catch (err) {
      setError('Failed to fetch budget data');
      console.error('Error fetching budget data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    queryClient,
    setCategories,
    setError,
    setGoals,
    setIsLoading,
    setRecurringTransactions,
    setSelectedMonth,
  ]);

  useEffect(() => {
    if (
      !bootstrapQuery.data ||
      (!bootstrapQuery.isFetched && !bootstrapQuery.isSuccess)
    ) {
      return;
    }

    const nextMonthState = createSeededMonthState(
      bootstrapQuery.data.transactionsPage,
    );

    setState((prev) => ({
      ...prev,
      recurringTransactions: bootstrapQuery.data.recurringTransactions,
      categories: bootstrapQuery.data.categories,
      goals: bootstrapQuery.data.goals,
      isLoading: false,
      error: null,
      selectedMonth: prev.selectedMonth,
    }));

    setTransactionsByMonth((prev) => {
      const existing = prev[bootstrapQuery.data.currentMonth];

      if (existing && !existing.isStale && existing.hasLoaded) {
        return prev;
      }

      return {
        ...prev,
        [bootstrapQuery.data.currentMonth]: nextMonthState,
      };
    });
  }, [
    bootstrapQuery.data,
    bootstrapQuery.isFetched,
    bootstrapQuery.isSuccess,
    setState,
  ]);

  return {
    bootstrapQuery,
    currentMonth,
    ensureMonthTransactionsLoaded,
    queryClient,
    refetch,
    transactionsByMonth,
    updateMonthState,
  };
}
