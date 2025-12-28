'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import type { Transaction } from '@/types/budget';
import { cn } from '@/lib/utils';
import { useCurrencyFormatter } from '@/hooks/';

export default function DailyTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { formatCurrency } = useCurrencyFormatter();
  if (transactions.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-center">
          No transactions for this date
        </p>
      </div>
    );
  }

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const net = income - expenses;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-3">
          <p className="text-muted-foreground text-sm">Income</p>
          <p className="text-xl font-medium text-emerald-600">
            +{formatCurrency(income)}
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-muted-foreground text-sm">Expenses</p>
          <p className="text-xl font-medium text-rose-600">
            -{formatCurrency(expenses)}
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-muted-foreground text-sm">Net</p>
          <p
            className={cn(
              'text-xl font-medium',
              net >= 0 ? 'text-emerald-600' : 'text-rose-600',
            )}
          >
            {net >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(net))}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full',
                  transaction.type === 'income'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
                )}
              >
                {transaction.type === 'income' ? (
                  <ArrowUp className="h-5 w-5" />
                ) : (
                  <ArrowDown className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-muted-foreground text-sm">
                  {transaction.category}
                </p>
              </div>
            </div>
            <div
              className={cn(
                'font-medium',
                transaction.type === 'income'
                  ? 'text-emerald-600'
                  : 'text-rose-600',
              )}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
