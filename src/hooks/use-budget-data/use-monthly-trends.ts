import { useMemo } from 'react';
import { buildMonthlyTrendRange, buildMonthlyTrends } from './utils';
import type { Transaction } from '@/types/budget';

export const useMonthlyTrends = (
  transactions: Transaction[],
  selectedMonth: string,
) => {
  const monthlyTrendRange = useMemo(() => {
    return buildMonthlyTrendRange(selectedMonth);
  }, [selectedMonth]);

  const monthlyTrends = useMemo(() => {
    return buildMonthlyTrends(transactions, monthlyTrendRange);
  }, [monthlyTrendRange, transactions]);

  return {
    monthlyTrendRange,
    monthlyTrends,
  };
};
