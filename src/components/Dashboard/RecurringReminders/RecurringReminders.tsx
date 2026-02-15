'use client';

import { Bell } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBudgetData, useCurrencyFormatter } from '@/hooks/';
import type { RecurringReminder } from '@/hooks/use-budget-data/use-recurring-reminders';
import { cn } from '@/lib/utils';

export default function RecurringReminders() {
  const { upcomingRecurringReminders } = useBudgetData();
  const { formatCurrency } = useCurrencyFormatter();

  if (upcomingRecurringReminders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          Upcoming Bills
        </CardTitle>
        <CardDescription>Next 7 days of recurring payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingRecurringReminders.map((reminder: RecurringReminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{reminder.title}</p>
              <p className="text-muted-foreground text-sm">
                {reminder.category} • {reminder.date}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  'font-semibold',
                  reminder.type === 'income'
                    ? 'text-emerald-600'
                    : 'text-rose-600',
                )}
              >
                {reminder.type === 'income' ? '+' : '-'}
                {formatCurrency(reminder.amount)}
              </p>
              <div className="flex items-center justify-end gap-2">
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase',
                    reminder.status === 'overdue'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : reminder.status === 'due'
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700',
                  )}
                >
                  {reminder.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
