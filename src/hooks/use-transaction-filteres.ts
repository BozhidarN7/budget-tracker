'use client';

import { useMemo, useState } from 'react';
import type { Transaction } from '@/types/budget';
import { parseDate } from '@/utils';

export interface TransactionFilters {
  search: string;
  category: string;
  type: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

export default function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    category: 'all',
    type: 'all',
    dateFrom: undefined,
    dateTo: undefined,
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (transaction.category !== filters.category) return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'all') {
        if (transaction.type !== filters.type) return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const transactionDate = parseDate(transaction.date);

        if (filters.dateFrom && transactionDate < filters.dateFrom) {
          return false;
        }

        if (filters.dateTo && transactionDate > filters.dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filters]);

  const updateFilter = (key: keyof TransactionFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      type: 'all',
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  return {
    filters,
    filteredTransactions,
    updateFilter,
    clearFilters,
  };
}
