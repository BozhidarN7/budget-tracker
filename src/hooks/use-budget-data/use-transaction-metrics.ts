import { useMemo } from 'react';
import type { Transaction } from '@/types/budget';
import { formatMonthKey, parseDate } from '@/utils';

type TransactionMetricsResult = {
  filteredTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recentTransactions: Transaction[];
};

export const useTransactionMetrics = (
  transactions: Transaction[],
  selectedMonth: string,
): TransactionMetricsResult => {
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parseDate(transaction.date);
      const transactionMonth = formatMonthKey(transactionDate);
      return transactionMonth === selectedMonth;
    });
  }, [selectedMonth, transactions]);

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    filteredTransactions,
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions,
  };
};
