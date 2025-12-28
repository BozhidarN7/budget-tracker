'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBudgetData, useCurrencyFormatter } from '@/hooks/';
import { formatMonthKeyToReadable } from '@/utils';

const SUMMARY_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

interface PieDatum {
  name: string;
  value: number;
  color: string;
}

type PieDatumChart = PieDatum & Record<string, unknown>;

export default function ExpensesByCategorySummary() {
  const { expensesByCategory, isLoading, selectedMonth } = useBudgetData();
  const { formatCurrency } = useCurrencyFormatter();

  const topCategories = useMemo<PieDatumChart[]>(() => {
    return expensesByCategory
      .toSorted((a, b) => a.value - b.value)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        color: SUMMARY_COLORS[index % SUMMARY_COLORS.length],
      }));
  }, [expensesByCategory]);

  const totalTopSpend = useMemo(() => {
    return topCategories.reduce((sum, item) => sum + item.value, 0);
  }, [topCategories]);

  if (isLoading) {
    return (
      <div className="flex h-[260px] items-center justify-center">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (topCategories.length === 0) {
    return (
      <div className="space-y-2">
        <SummaryHeader selectedMonth={selectedMonth} />
        <p className="text-muted-foreground text-sm">
          No expenses recorded for this month yet. Add a transaction to see the
          category breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SummaryHeader selectedMonth={selectedMonth} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={1}
              >
                {topCategories.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Spent']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="space-y-3">
          {topCategories.map((category) => (
            <li key={category.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <p className="text-sm font-medium">{category.name}</p>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(category.value)}
                </p>
              </div>
              <div className="bg-muted/60 h-1.5 w-full rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width:
                      totalTopSpend === 0
                        ? '0%'
                        : `${Math.min((category.value / totalTopSpend) * 100, 100)}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryHeader({ selectedMonth }: { selectedMonth: string }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
      <div>
        <h3 className="text-lg font-semibold">Expenses by Category</h3>
        <CardDescription>
          {formatMonthKeyToReadable(selectedMonth)} · Top categories at a glance
        </CardDescription>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link
          href="/statistics?tab=categories"
          className="inline-flex items-center gap-1"
        >
          View detailed analysis
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
