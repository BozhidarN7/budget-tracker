import { describe, expect, it } from 'vitest';
import { getDashboardSummary } from './category-metrics';
import { buildMonthlyTrendRange } from './monthly-trends';
import type { Category } from '@/types/budget';

const buildCategory = (overrides: Partial<Category> = {}): Category => {
  return {
    id: 'cat-1',
    name: 'Salary',
    color: '#000000',
    type: 'income',
    monthlyData: {},
    ...overrides,
  };
};

describe('getDashboardSummary', () => {
  it('derives current and previous month totals from category monthly data', () => {
    const categories: Category[] = [
      buildCategory({
        id: 'income-1',
        monthlyData: {
          '2025-05': { limit: 0, spent: 2500 },
          '2025-06': { limit: 0, spent: 3000 },
        },
        name: 'Salary',
        type: 'income',
      }),
      buildCategory({
        color: '#ff0000',
        id: 'expense-1',
        monthlyData: {
          '2025-05': { limit: 500, spent: 400 },
          '2025-06': { limit: 500, spent: 600 },
        },
        name: 'Food',
        type: 'expense',
      }),
    ];

    const result = getDashboardSummary(
      categories,
      buildMonthlyTrendRange('2025-06'),
      '2025-06',
    );

    expect(result.currentMonth).toEqual({
      expenses: 600,
      income: 3000,
      net: 2400,
    });
    expect(result.previousMonth).toEqual({
      expenses: 400,
      income: 2500,
      net: 2100,
    });
  });

  it('builds six months of category-backed trends with zero fallbacks', () => {
    const categories: Category[] = [
      buildCategory({
        id: 'income-1',
        monthlyData: {
          '2025-03': { limit: 0, spent: 1000 },
          '2025-06': { limit: 0, spent: 2200 },
        },
        type: 'income',
      }),
      buildCategory({
        id: 'expense-1',
        monthlyData: {
          '2025-02': { limit: 0, spent: 300 },
          '2025-06': { limit: 0, spent: 700 },
        },
        name: 'Rent',
        type: 'expense',
      }),
    ];

    const result = getDashboardSummary(
      categories,
      buildMonthlyTrendRange('2025-06'),
      '2025-06',
    );

    expect(result.monthlyTrends.map((trend) => trend.monthKey)).toEqual([
      '2025-01',
      '2025-02',
      '2025-03',
      '2025-04',
      '2025-05',
      '2025-06',
    ]);
    expect(result.monthlyTrends).toEqual([
      { expenses: 0, income: 0, month: 'January 2025', monthKey: '2025-01' },
      { expenses: 300, income: 0, month: 'February 2025', monthKey: '2025-02' },
      { expenses: 0, income: 1000, month: 'March 2025', monthKey: '2025-03' },
      { expenses: 0, income: 0, month: 'April 2025', monthKey: '2025-04' },
      { expenses: 0, income: 0, month: 'May 2025', monthKey: '2025-05' },
      { expenses: 700, income: 2200, month: 'June 2025', monthKey: '2025-06' },
    ]);
  });
});
