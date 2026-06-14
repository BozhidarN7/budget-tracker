import { useMemo } from 'react';
import { buildMonthlyTrendRange, getDashboardSummary } from './utils';
import type { Category } from '@/types/budget';

export const useMonthlyTrends = (
  categories: Category[],
  selectedMonth: string,
) => {
  const monthlyTrendRange = useMemo(() => {
    return buildMonthlyTrendRange(selectedMonth);
  }, [selectedMonth]);

  const monthlyTrends = useMemo(() => {
    return getDashboardSummary(categories, monthlyTrendRange, selectedMonth)
      .monthlyTrends;
  }, [categories, monthlyTrendRange, selectedMonth]);

  return {
    monthlyTrendRange,
    monthlyTrends,
  };
};
