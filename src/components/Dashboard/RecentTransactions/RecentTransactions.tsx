'use client';

import Link from 'next/link';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useBudgetData } from '@/hooks/';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function RecentTransactions() {
  const { recentTransactions } = useBudgetData();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {recentTransactions.map((transaction) => (
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
                  {transaction.category} • {transaction.date}
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
              {transaction.type === 'income' ? '+' : '-'}$
              {transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/transactions">View All Transactions</Link>
        </Button>
      </div>
    </div>
  );
}
