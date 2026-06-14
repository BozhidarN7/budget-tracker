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
  it('derives charts and ratios from all supplied transactions', () => {
    const transactions: Transaction[] = [
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
      transactions,
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

  it('only uses transactions explicitly supplied to the statistics dataset', () => {
    const transactions: Transaction[] = [
      buildTransaction({
        id: 'txn-1',
        amount: 400,
        category: 'Utilities',
        date: '2025-06-02',
      }),
    ];

    const result = getStatisticsData({
      transactions,
      categories: [],
      goals: [],
    });

    expect(result.categoryBreakdown).toEqual([
      { name: 'Utilities', value: 400 },
    ]);
    expect(result.incomeSourceBreakdown).toEqual([]);
  });

  it('builds historical monthly groupings when given multi-month data', () => {
    const transactions: Transaction[] = [
      buildTransaction({
        id: 'txn-1',
        amount: 150,
        category: 'Groceries',
        date: '2026-01-15',
      }),
      buildTransaction({
        id: 'txn-2',
        amount: 250,
        category: 'Utilities',
        date: '2026-02-10',
      }),
      buildTransaction({
        id: 'txn-3',
        amount: 3200,
        category: 'Salary',
        date: '2026-02-11',
        type: 'income',
      }),
    ];

    const result = getStatisticsData({
      transactions,
      categories: [],
      goals: [],
    });

    expect(result.categoryBreakdown).toEqual([
      { name: 'Utilities', value: 250 },
      { name: 'Groceries', value: 150 },
    ]);
    expect(result.monthlySpending).toHaveLength(6);
    expect(
      result.monthlySpending.some(
        (month) => month.expenses === 250 && month.income === 3200,
      ),
    ).toBe(true);
  });
});
