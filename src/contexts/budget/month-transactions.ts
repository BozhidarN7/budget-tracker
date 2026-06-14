import {
  TRANSACTIONS_PAGE_SIZE,
  fetchTransactions,
} from '@/api/budget-tracker-api/transactions';
import { parseDate } from '@/utils';
import type {
  PaginatedTransactionsResponse,
  Transaction,
} from '@/types/budget';

export type MonthTransactionPageState = {
  items: Transaction[];
  nextCursor: string | null;
  hasLoaded: boolean;
  isLoadingInitial: boolean;
  isLoadingMore: boolean;
  error: string | null;
  isStale: boolean;
};

export type TransactionsByMonth = Record<string, MonthTransactionPageState>;

export const budgetQueryKeys = {
  bootstrap: ['budget', 'bootstrap'] as const,
  transactions: (month: string) => ['budget', 'transactions', month] as const,
};

export function createEmptyMonthState(): MonthTransactionPageState {
  return {
    items: [],
    nextCursor: null,
    hasLoaded: false,
    isLoadingInitial: false,
    isLoadingMore: false,
    error: null,
    isStale: false,
  };
}

export function sortTransactionsByDateDesc(transactions: Transaction[]) {
  return [...transactions].sort(
    (left, right) =>
      parseDate(right.date).getTime() - parseDate(left.date).getTime(),
  );
}

export function createSeededMonthState(
  page: PaginatedTransactionsResponse,
): MonthTransactionPageState {
  return {
    items: sortTransactionsByDateDesc(page.items),
    nextCursor: page.nextCursor ?? null,
    hasLoaded: true,
    isLoadingInitial: false,
    isLoadingMore: false,
    error: null,
    isStale: false,
  };
}

export async function fetchMonthTransactions(month: string, cursor?: string) {
  return fetchTransactions({
    monthKey: month,
    limit: TRANSACTIONS_PAGE_SIZE,
    cursor,
  });
}
