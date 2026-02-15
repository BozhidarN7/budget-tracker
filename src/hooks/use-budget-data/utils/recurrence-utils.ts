import type { RecurringTransaction, Transaction } from '@/types/budget';
import { buildRecurrenceInstances } from '@/utils';

const mapRecurrenceStatus = (
  occurrenceDate: Date,
  today: Date,
): 'due' | 'overdue' | 'scheduled' => {
  if (occurrenceDate.getTime() === today.getTime()) {
    return 'due';
  }

  return occurrenceDate < today ? 'overdue' : 'scheduled';
};

export const buildRecurringInstances = (
  recurring: RecurringTransaction,
  windowStart: string,
  windowEnd: string,
  today: Date,
  generatedAt: string,
): Transaction[] => {
  if (recurring.status && recurring.status !== 'active') {
    return [];
  }

  const occurrences = buildRecurrenceInstances(
    recurring,
    windowStart,
    windowEnd,
  );

  return occurrences.map((occurrence) => {
    const occurrenceDate = new Date(occurrence);
    const status = mapRecurrenceStatus(occurrenceDate, today);

    return {
      id: `${recurring.id}-${occurrence}`,
      description: recurring.description,
      amount: recurring.amount,
      currency: recurring.currency,
      date: occurrence,
      category: recurring.category,
      type: recurring.type,
      recurrenceId: recurring.id,
      recurrenceInstanceId: `${recurring.id}-${occurrence}`,
      recurrenceStatus: status,
      recurrenceGeneratedAt: generatedAt,
    } satisfies Transaction;
  });
};

export const buildRecurringReminders = (
  recurring: RecurringTransaction,
  windowStart: string,
  windowEnd: string,
  today: Date,
) => {
  if (recurring.status && recurring.status !== 'active') {
    return [];
  }

  const occurrences = buildRecurrenceInstances(
    recurring,
    windowStart,
    windowEnd,
  );

  return occurrences.map((occurrence) => {
    const occurrenceDate = new Date(occurrence);
    const status = mapRecurrenceStatus(occurrenceDate, today);

    return {
      id: `${recurring.id}-${occurrence}`,
      title: recurring.description,
      amount: recurring.amount,
      currency: recurring.currency,
      category: recurring.category,
      date: occurrence,
      type: recurring.type,
      status,
      recurrenceId: recurring.id,
    };
  });
};
