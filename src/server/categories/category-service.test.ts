import { describe, expect, it } from 'vitest';
import { validateServerCategory } from './category-service';
import type { Category } from '@/types/budget';

const expenseCategory: Category = {
  color: '#000000',
  id: 'expense-1',
  monthlyData: {},
  name: 'Shopping',
  type: 'expense',
};

const incomeCategory: Category = {
  color: '#ffffff',
  id: 'income-1',
  monthlyData: {},
  name: 'Salary',
  type: 'income',
};

describe('validateServerCategory', () => {
  it('returns exact matches as canonical results', () => {
    const result = validateServerCategory(
      [expenseCategory],
      'Shopping',
      'expense',
    );

    expect(result).toEqual({
      canonicalCategoryName: 'Shopping',
      category: expenseCategory,
      status: 'ok',
    });
  });

  it('canonicalizes case-insensitive matches', () => {
    const result = validateServerCategory(
      [expenseCategory],
      'shopping',
      'expense',
    );

    expect(result).toEqual({
      canonicalCategoryName: 'Shopping',
      category: expenseCategory,
      status: 'ok',
    });
  });

  it('returns ambiguous when multiple case-insensitive matches exist', () => {
    const result = validateServerCategory(
      [
        expenseCategory,
        {
          ...expenseCategory,
          id: 'expense-2',
          name: 'SHOPPING',
        },
      ],
      'shopping',
      'expense',
    );

    expect(result.status).toBe('ambiguous');
    if (result.status !== 'ambiguous') {
      throw new Error('Expected ambiguous result');
    }

    expect(result.matches).toHaveLength(2);
  });

  it('returns type mismatch when category type differs', () => {
    const result = validateServerCategory(
      [incomeCategory],
      'Salary',
      'expense',
    );

    expect(result).toEqual({
      category: incomeCategory,
      expectedType: 'expense',
      inputCategoryName: 'Salary',
      status: 'type_mismatch',
    });
  });

  it('returns not_found when no category matches', () => {
    const result = validateServerCategory(
      [expenseCategory],
      'Unknown',
      'expense',
    );

    expect(result).toEqual({
      inputCategoryName: 'Unknown',
      status: 'not_found',
    });
  });
});
