import { describe, expect, it } from 'vitest';
import { getTransactionMetrics } from './use-transaction-metrics';
import type { Transaction } from '@/types/budget';

const buildTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => {
  return {
    id: 'txn-1',
    description: 'Salary',
    amount: 1000,
    currency: 'USD',
    date: '2025-06-05',
    category: 'Income',
    type: 'income',
    ...overrides,
  };
};

describe('useTransactionMetrics', () => {
  it('returns selected-month preview data from loaded transactions only', () => {
    const loadedTransactions = [
      buildTransaction(),
      buildTransaction({
        id: 'txn-2',
        description: 'Groceries',
        amount: 200,
        date: '2025-06-10',
        category: 'Food',
        type: 'expense',
      }),
    ];

    const result = getTransactionMetrics(loadedTransactions, '2025-06');

    expect(result.loadedTransactions).toEqual(loadedTransactions);
    expect(result.selectedMonthTransactions).toEqual(loadedTransactions);
    expect(
      result.recentTransactions.map((transaction) => transaction.id),
    ).toEqual(['txn-2', 'txn-1']);
  });

  it('does not include virtual recurring instances unless they are loaded', () => {
    const loadedTransactions = [
      buildTransaction({
        id: 'txn-1',
        description: 'Rent',
        amount: 1200,
        date: '2025-06-01',
        category: 'Housing',
        type: 'expense',
      }),
    ];

    const virtualRecurringInstance = buildTransaction({
      id: 'virtual-rec-1',
      description: 'Rent',
      amount: 1200,
      date: '2025-06-15',
      category: 'Housing',
      type: 'expense',
      recurrenceInstanceId: 'rec-1-2025-06-15',
    });

    const result = getTransactionMetrics(loadedTransactions, '2025-06');

    expect(result.selectedMonthTransactions).not.toContain(
      virtualRecurringInstance,
    );
    expect(result.recentTransactions).not.toContain(virtualRecurringInstance);
  });
});
