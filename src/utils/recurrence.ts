import { addDays, addMonths, format, isAfter, parseISO } from 'date-fns';
import type { RecurringRule, RecurringTransaction } from '@/types/budget';

const DATE_FORMAT = 'yyyy-MM-dd';

const toDate = (value: string) => {
  return parseISO(value);
};

const formatDate = (value: Date) => {
  return format(value, DATE_FORMAT);
};

const alignMonthlyDay = (date: Date, dayOfMonth?: number) => {
  const day = dayOfMonth ?? date.getDate();
  const aligned = new Date(date.getFullYear(), date.getMonth(), day);
  if (aligned.getMonth() !== date.getMonth()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  return aligned;
};

export const getNextOccurrence = (rule: RecurringRule, fromDate: string) => {
  const baseDate = toDate(fromDate);
  switch (rule.frequency) {
    case 'weekly':
      return formatDate(addDays(baseDate, 7 * (rule.interval ?? 1)));
    case 'biweekly':
      return formatDate(addDays(baseDate, 14 * (rule.interval ?? 1)));
    case 'monthly': {
      const nextBase = addMonths(baseDate, rule.interval ?? 1);
      return formatDate(alignMonthlyDay(nextBase, rule.dayOfMonth));
    }
    default:
      return formatDate(addMonths(baseDate, 1));
  }
};

export const buildInitialNextOccurrence = (rule: RecurringRule) => {
  const startDate = toDate(rule.startDate);
  if (rule.frequency === 'monthly') {
    return formatDate(alignMonthlyDay(startDate, rule.dayOfMonth));
  }
  return formatDate(startDate);
};

export const buildRecurrenceInstances = (
  recurring: RecurringTransaction,
  windowStart: string,
  windowEnd: string,
) => {
  const occurrences: string[] = [];
  const start = toDate(windowStart);
  const end = toDate(windowEnd);

  const endLimit = recurring.rule.endDate
    ? toDate(recurring.rule.endDate)
    : null;

  let pointer = toDate(recurring.nextOccurrence);

  while (!isAfter(pointer, end)) {
    if (!isAfter(start, pointer)) {
      occurrences.push(formatDate(pointer));
    }

    const nextDate = getNextOccurrence(recurring.rule, formatDate(pointer));
    pointer = toDate(nextDate);

    if (endLimit && isAfter(pointer, endLimit)) {
      break;
    }
  }

  return occurrences;
};
