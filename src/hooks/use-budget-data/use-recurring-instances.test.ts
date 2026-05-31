import { describe, expect, it } from 'vitest';
import { buildRecurringInstances } from './utils/recurrence-utils';
import type { RecurringTransaction, Transaction } from '@/types/budget';

const buildRecurring = (
  overrides: Partial<RecurringTransaction> = {},
): RecurringTransaction => {
  return {
    id: 'rec-1',
    description: 'Rent',
    amount: 1200,
    currency: 'USD',
    category: 'Housing',
    type: 'expense',
    rule: {
      frequency: 'monthly',
      startDate: '2025-01-15',
      dayOfMonth: 15,
    },
    nextOccurrence: '2025-01-15',
    status: 'active',
    ...overrides,
  };
};

const buildRealTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => {
  return {
    id: 'txn-1',
    description: 'Rent',
    amount: 1200,
    currency: 'USD',
    date: '2025-06-15',
    category: 'Housing',
    type: 'expense',
    ...overrides,
  };
};

describe('buildRecurringInstances dedupe', () => {
  it('skips generating a virtual instance when a real transaction with the same recurrenceInstanceId exists', () => {
    const recurring = buildRecurring();
    const realTransaction = buildRealTransaction({
      recurrenceInstanceId: 'rec-1-2025-06-15',
    });
    const existingIds = new Set<string>([
      realTransaction.recurrenceInstanceId!,
    ]);

    const instances = buildRecurringInstances(
      recurring,
      '2025-06-01',
      '2025-06-30',
      new Date('2025-06-01'),
      '2025-06-01',
      existingIds,
    );

    const instanceIds = instances.map((i) => i.recurrenceInstanceId);

    expect(instanceIds).not.toContain('rec-1-2025-06-15');
  });

  it('still generates future virtual instances for dates without real transactions', () => {
    const recurring = buildRecurring();
    const existingIds = new Set<string>();

    const instances = buildRecurringInstances(
      recurring,
      '2025-06-01',
      '2025-08-31',
      new Date('2025-06-01'),
      '2025-06-01',
      existingIds,
    );

    const instanceIds = instances.map((i) => i.recurrenceInstanceId);

    expect(instanceIds).toContain('rec-1-2025-06-15');
    expect(instanceIds).toContain('rec-1-2025-07-15');
    expect(instanceIds).toContain('rec-1-2025-08-15');
  });

  it('generates mixed results when some dates have real transactions and others do not', () => {
    const recurring = buildRecurring();
    const existingIds = new Set<string>(['rec-1-2025-06-15']);

    const instances = buildRecurringInstances(
      recurring,
      '2025-06-01',
      '2025-08-31',
      new Date('2025-06-01'),
      '2025-06-01',
      existingIds,
    );

    const instanceIds = instances.map((i) => i.recurrenceInstanceId);

    expect(instanceIds).not.toContain('rec-1-2025-06-15');
    expect(instanceIds).toContain('rec-1-2025-07-15');
    expect(instanceIds).toContain('rec-1-2025-08-15');
  });

  it('returns empty array when all generated instances have real transactions', () => {
    const recurring = buildRecurring();
    const existingIds = new Set<string>([
      'rec-1-2025-06-15',
      'rec-1-2025-07-15',
    ]);

    const instances = buildRecurringInstances(
      recurring,
      '2025-06-01',
      '2025-07-31',
      new Date('2025-06-01'),
      '2025-06-01',
      existingIds,
    );

    expect(instances).toEqual([]);
  });
});

describe('useRecurringInstances combinedTransactions dedupe', () => {
  it('combinedTransactions contains real transaction but no duplicate when virtual is suppressed', () => {
    const recurring = buildRecurring();
    const realTransaction = buildRealTransaction({
      recurrenceInstanceId: 'rec-1-2025-06-15',
    });
    const existingIds = new Set<string>([
      realTransaction.recurrenceInstanceId!,
    ]);

    const instances = buildRecurringInstances(
      recurring,
      '2025-06-01',
      '2025-06-30',
      new Date('2025-06-01'),
      '2025-06-01',
      existingIds,
    );

    const combinedTransactions = [realTransaction, ...instances];
    const matching = combinedTransactions.filter(
      (t) => t.recurrenceInstanceId === 'rec-1-2025-06-15',
    );

    expect(matching).toHaveLength(1);
    expect(matching[0].id).toBe('txn-1');
  });
});
