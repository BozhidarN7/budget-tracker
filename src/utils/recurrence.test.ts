import { describe, expect, it } from 'vitest';
import {
  buildInitialNextOccurrence,
  buildRecurrenceInstances,
  getNextOccurrence,
} from './recurrence';
import type { RecurringTransaction } from '@/types/budget';

const buildRecurring = (
  overrides: Partial<RecurringTransaction>,
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
      startDate: '2025-01-31',
      dayOfMonth: 31,
    },
    nextOccurrence: '2025-01-31',
    status: 'active',
    ...overrides,
  };
};

describe('recurrence utilities', () => {
  it('aligns monthly occurrences to the last valid day of the month', () => {
    const recurring = buildRecurring({
      rule: {
        frequency: 'monthly',
        startDate: '2025-01-31',
        dayOfMonth: 31,
      },
      nextOccurrence: '2025-01-31',
    });

    const occurrences = buildRecurrenceInstances(
      recurring,
      '2025-02-01',
      '2025-02-28',
    );

    expect(occurrences).toEqual(['2025-02-28']);
  });

  it('stops generating instances beyond the end date', () => {
    const recurring = buildRecurring({
      rule: {
        frequency: 'weekly',
        startDate: '2025-01-01',
        endDate: '2025-01-10',
      },
      nextOccurrence: '2025-01-01',
    });

    const occurrences = buildRecurrenceInstances(
      recurring,
      '2025-01-01',
      '2025-01-31',
    );

    expect(occurrences).toEqual(['2025-01-01', '2025-01-08']);
  });

  it('advances biweekly schedules by 14 days', () => {
    const next = getNextOccurrence(
      {
        frequency: 'biweekly',
        startDate: '2025-01-01',
      },
      '2025-01-01',
    );

    expect(next).toBe('2025-01-15');
  });

  it('builds the initial monthly occurrence using the provided day of month', () => {
    const next = buildInitialNextOccurrence({
      frequency: 'monthly',
      startDate: '2025-01-05',
      dayOfMonth: 10,
    });

    expect(next).toBe('2025-01-10');
  });
});
