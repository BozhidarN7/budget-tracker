'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllTransactions } from '@/api/budget-tracker-api/transactions';
import type { Transaction } from '@/types/budget';

export const statisticsQueryKeys = {
  transactions: ['statistics', 'transactions', 'all'] as const,
};

type UseStatisticsTransactionsParams = {
  initialTransactions: Transaction[];
};

export function useStatisticsTransactions({
  initialTransactions,
}: UseStatisticsTransactionsParams) {
  return useQuery({
    queryKey: statisticsQueryKeys.transactions,
    queryFn: fetchAllTransactions,
    initialData: initialTransactions,
  });
}
