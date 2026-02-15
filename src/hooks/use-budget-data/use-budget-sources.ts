import { useMemo } from 'react';
import type {
  Category,
  Goal,
  RecurringTransaction,
  Transaction,
} from '@/types/budget';
import {
  mockCategories,
  mockGoals,
  mockRecurringTransactions,
  mockTransactions,
} from '@/mock';
import { ensureCategoriesMonthData } from '@/utils/category-utils';

type BudgetSourcesInput = {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  goals: Goal[];
  isLoading: boolean;
  selectedMonth: string;
};

export const useBudgetSources = ({
  transactions,
  recurringTransactions,
  categories,
  goals,
  isLoading,
  selectedMonth,
}: BudgetSourcesInput) => {
  return useMemo(() => {
    const transactionsData =
      transactions.length > 0 ? transactions : mockTransactions;
    const categoriesData = categories.length > 0 ? categories : mockCategories;
    const goalsData = goals.length > 0 ? goals : mockGoals;
    const recurringData =
      recurringTransactions.length > 0
        ? recurringTransactions
        : mockRecurringTransactions;

    const categoriesWithMonthData = ensureCategoriesMonthData(
      categoriesData,
      selectedMonth,
    );

    return {
      transactionsData,
      categoriesData: categoriesWithMonthData,
      goalsData,
      recurringData,
      isLoading,
    };
  }, [
    categories,
    goals,
    isLoading,
    recurringTransactions,
    selectedMonth,
    transactions,
  ]);
};

export type BudgetSourcesResult = ReturnType<typeof useBudgetSources>;
