import type { Transaction } from '@/types/budget';
import { formatMonthKey, formatMonthKeyToReadable, parseDate } from '@/utils';

const MONTHLY_TRENDS_LIMIT = 6;

export const buildMonthlyTrendRange = (selectedMonth: string): string[] => {
  const months: string[] = [];
  const [yearStr, monthStr] = selectedMonth.split('-');
  const baseYear = Number.parseInt(yearStr, 10);
  const baseMonthIndex = Number.parseInt(monthStr, 10) - 1;

  for (let offset = MONTHLY_TRENDS_LIMIT - 1; offset >= 0; offset -= 1) {
    const date = new Date(baseYear, baseMonthIndex - offset, 1);
    months.push(formatMonthKey(date));
  }

  return months;
};

export const buildMonthlyTrends = (
  transactions: Transaction[],
  monthRange: string[],
) => {
  const monthBuckets = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((transaction) => {
    const monthKey = formatMonthKey(parseDate(transaction.date));
    const bucket = monthBuckets.get(monthKey) ?? { income: 0, expenses: 0 };

    if (transaction.type === 'income') {
      bucket.income += transaction.amount;
    } else if (transaction.type === 'expense') {
      bucket.expenses += transaction.amount;
    }

    monthBuckets.set(monthKey, bucket);
  });

  return monthRange.map((monthKey) => {
    const bucket = monthBuckets.get(monthKey) ?? { income: 0, expenses: 0 };

    return {
      monthKey,
      month: formatMonthKeyToReadable(monthKey),
      income: bucket.income,
      expenses: bucket.expenses,
    };
  });
};
