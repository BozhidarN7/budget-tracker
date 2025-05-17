'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import DailyTransactions from '../DailyTransactions';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBudgetData } from '@/hooks/';
import { cn } from '@/lib/utils';
import { parseDate } from '@/utils';

export default function CalendarView() {
  const { transactions } = useBudgetData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Group transactions by date
  const transactionsByDate = transactions.reduce(
    (acc, transaction) => {
      const date = format(parseDate(transaction.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {} as Record<string, typeof transactions>,
  );

  // Find the latest date with transactions
  useEffect(() => {
    if (!selectedDate && Object.keys(transactionsByDate).length > 0) {
      const latestDateStr = Object.keys(transactionsByDate).sort().pop();
      if (latestDateStr) {
        setSelectedDate(new Date(latestDateStr));
      }
    }
  }, [transactionsByDate, selectedDate]);

  // Get transactions for the selected date
  const selectedDateStr = selectedDate
    ? format(selectedDate, 'yyyy-MM-dd')
    : '';
  const selectedDateTransactions = selectedDateStr
    ? transactionsByDate[selectedDateStr] || []
    : [];

  // Calculate daily totals for income and expenses
  const dailyTotals = Object.entries(transactionsByDate).reduce(
    (acc, [date, dayTransactions]) => {
      const income = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      acc[date] = { income, expense, net: income - expense };
      return acc;
    },
    {} as Record<string, { income: number; expense: number; net: number }>,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Transaction Calendar</CardTitle>
          <CardDescription>Select a date to view transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              DayContent: (props) => {
                const dateStr = format(props.date, 'yyyy-MM-dd');
                const hasTransactions = !!transactionsByDate[dateStr];
                const dayTotal = dailyTotals[dateStr];

                return (
                  <div className="relative h-9 w-9 p-0 font-normal aria-selected:opacity-100">
                    <div className="text-foreground flex h-full w-full items-center justify-center">
                      {props.date.getDate()}
                    </div>
                    {hasTransactions && (
                      <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                        <div
                          className={cn(
                            'h-1 w-1 rounded-full',
                            dayTotal?.net >= 0
                              ? 'bg-emerald-500'
                              : 'bg-rose-500',
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? format(selectedDate, 'MMMM d, yyyy')
              : 'Select a date'}
          </CardTitle>
          <CardDescription>
            {selectedDateTransactions.length > 0
              ? `${selectedDateTransactions.length} transaction${selectedDateTransactions.length > 1 ? 's' : ''}`
              : 'No transactions for this date'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DailyTransactions transactions={selectedDateTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
