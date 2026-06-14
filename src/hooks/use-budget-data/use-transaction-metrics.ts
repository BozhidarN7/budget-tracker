import { useMemo } from 'react';
import type { Transaction } from '@/types/budget';
import { formatMonthKey, parseDate } from '@/utils';

type TransactionMetricsResult = {
  loadedTransactions: Transaction[];
  selectedMonthTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recentTransactions: Transaction[];
};

export const getTransactionMetrics = (
  loadedTransactions: Transaction[],
  selectedMonth: string,
): TransactionMetricsResult => {
  // The canonical transaction list is already selected-month scoped.
  // Keep a defensive filter in place so mock fallbacks or stale data do not
  // leak rows from other months into derived metrics.
  const selectedMonthTransactions = loadedTransactions.filter((transaction) => {
    const transactionDate = parseDate(transaction.date);
    const transactionMonth = formatMonthKey(transactionDate);
    return transactionMonth === selectedMonth;
  });

  const totalIncome = selectedMonthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = selectedMonthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const recentTransactions = [...selectedMonthTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    loadedTransactions,
    selectedMonthTransactions,
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
  };
};

export const useTransactionMetrics = (
  loadedTransactions: Transaction[],
  selectedMonth: string,
): TransactionMetricsResult => {
  return useMemo(() => {
    return getTransactionMetrics(loadedTransactions, selectedMonth);
  }, [loadedTransactions, selectedMonth]);
};
