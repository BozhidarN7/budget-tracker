import { useMemo } from 'react';
import type { Transaction } from '@/types/budget';
import { formatMonthKey, parseDate } from '@/utils';

type TransactionMetricsResult = {
  materializedTransactions: Transaction[];
  selectedMonthTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recentTransactions: Transaction[];
};

export const getTransactionMetrics = (
  materializedTransactions: Transaction[],
  selectedMonth: string,
): TransactionMetricsResult => {
  const selectedMonthTransactions = materializedTransactions.filter(
    (transaction) => {
      const transactionDate = parseDate(transaction.date);
      const transactionMonth = formatMonthKey(transactionDate);
      return transactionMonth === selectedMonth;
    },
  );

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
    materializedTransactions,
    selectedMonthTransactions,
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
  };
};

export const useTransactionMetrics = (
  materializedTransactions: Transaction[],
  selectedMonth: string,
): TransactionMetricsResult => {
  return useMemo(() => {
    return getTransactionMetrics(materializedTransactions, selectedMonth);
  }, [materializedTransactions, selectedMonth]);
};
