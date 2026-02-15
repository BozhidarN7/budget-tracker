import { addDays, format, isAfter, isEqual, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { buildRecurringReminders } from './utils';
import type { CurrencyCode, RecurringTransaction } from '@/types/budget';

type RecurringRemindersInput = {
  recurringTransactions: RecurringTransaction[];
};

export type RecurringReminder = {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  date: string;
  type: 'income' | 'expense';
  status: 'due' | 'overdue' | 'scheduled';
  recurrenceId: string;
};

export const useRecurringReminders = ({
  recurringTransactions,
}: RecurringRemindersInput): RecurringReminder[] => {
  return useMemo<RecurringReminder[]>(() => {
    const today = parseISO(format(new Date(), 'yyyy-MM-dd'));
    const reminderEnd = addDays(today, 7);
    const windowStart = format(today, 'yyyy-MM-dd');
    const windowEnd = format(reminderEnd, 'yyyy-MM-dd');

    return recurringTransactions.flatMap((recurring) => {
      return buildRecurringReminders(
        recurring,
        windowStart,
        windowEnd,
        today,
      ).filter((reminder) => {
        const reminderDate = parseISO(reminder.date);
        return (
          isEqual(reminderDate, today) ||
          (isAfter(reminderDate, today) && !isAfter(reminderDate, reminderEnd))
        );
      });
    });
  }, [recurringTransactions]);
};
