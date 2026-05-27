import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { buildRecurringInstances } from './utils';
import type { RecurringTransaction, Transaction } from '@/types/budget';

type RecurringInstancesInput = {
  recurringTransactions: RecurringTransaction[];
  selectedMonth: string;
};

type RecurringInstancesResult = {
  combinedTransactions: Transaction[];
  eligibleRecurringInstances: Transaction[];
  recurringInstances: Transaction[];
};

export const useRecurringInstances = (
  { recurringTransactions, selectedMonth }: RecurringInstancesInput,
  transactions: Transaction[],
): RecurringInstancesResult => {
  const recurringInstances = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const monthStart = startOfMonth(
      new Date(
        Number.parseInt(yearStr, 10),
        Number.parseInt(monthStr, 10) - 1,
        1,
      ),
    );
    const monthEnd = endOfMonth(monthStart);
    const windowStart = format(monthStart, 'yyyy-MM-dd');
    const windowEnd = format(monthEnd, 'yyyy-MM-dd');
    const generatedAt = format(new Date(), 'yyyy-MM-dd');
    const today = parseISO(generatedAt);

    return recurringTransactions.flatMap((recurring) => {
      return buildRecurringInstances(
        recurring,
        windowStart,
        windowEnd,
        today,
        generatedAt,
      );
    });
  }, [recurringTransactions, selectedMonth]);

  const combinedTransactions = useMemo(() => {
    return [...transactions, ...recurringInstances];
  }, [recurringInstances, transactions]);

  const eligibleRecurringInstances = useMemo(() => {
    return recurringInstances.filter((instance) => {
      return instance.recurrenceStatus !== 'scheduled';
    });
  }, [recurringInstances]);

  return {
    combinedTransactions,
    eligibleRecurringInstances,
    recurringInstances,
  };
};
