import { describe, expect, it } from 'vitest';
import { getStatisticsData } from './use-statistics-data';
import type { Category, Goal, Transaction } from '@/types/budget';

const buildTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => {
  return {
    id: 'txn-1',
    description: 'Rent',
    amount: 1200,
    currency: 'USD',
    date: '2025-06-01',
    category: 'Housing',
    type: 'expense',
    ...overrides,
  };
};

describe('useStatisticsData', () => {
  it('derives charts and ratios from loaded selected-month transactions only', () => {
    const loadedTransactions: Transaction[] = [
      buildTransaction(),
      buildTransaction({
        id: 'txn-2',
        description: 'Paycheck',
        amount: 3000,
        date: '2025-06-03',
        category: 'Salary',
        type: 'income',
      }),
    ];

    const categories: Category[] = [];
    const goals: Goal[] = [];

    const result = getStatisticsData({
      loadedTransactions,
      categories,
      goals,
    });

    expect(result.categoryBreakdown).toEqual([
      { name: 'Housing', value: 1200 },
    ]);
    expect(result.incomeSourceBreakdown).toEqual([
      { source: 'Salary', amount: 3000 },
    ]);
  });

  it('ignores future recurring instances that are not part of the loaded stream', () => {
    const loadedTransactions: Transaction[] = [
      buildTransaction({
        id: 'txn-1',
        amount: 400,
        category: 'Utilities',
        date: '2025-06-02',
      }),
    ];

    const result = getStatisticsData({
      loadedTransactions,
      categories: [],
      goals: [],
    });

    expect(result.categoryBreakdown).toEqual([
      { name: 'Utilities', value: 400 },
    ]);
    expect(result.incomeSourceBreakdown).toEqual([]);
  });
});
