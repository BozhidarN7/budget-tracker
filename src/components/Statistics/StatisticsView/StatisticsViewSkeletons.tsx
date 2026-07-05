'use client';

import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function StatisticsSectionHeader({
  title,
  hasSelect = false,
}: {
  title: string;
  hasSelect?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      {hasSelect ? <Skeleton className="h-10 w-[180px]" /> : null}
    </div>
  );
}

function StatisticsCardSkeleton({
  title,
  description,
  contentClassName,
  children,
}: {
  title: string;
  description: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="leading-none font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className={contentClassName ?? 'p-6 pt-0'}>{children}</div>
    </div>
  );
}

function ChartSkeleton({ heightClassName }: { heightClassName: string }) {
  return (
    <div className={heightClassName}>
      <div className="flex h-full flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="grid h-full grid-cols-[40px_1fr] gap-3">
          <div className="flex flex-col justify-between py-2">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
          <div className="flex h-full items-end gap-3 rounded-lg border border-dashed p-4">
            <Skeleton className="h-[45%] flex-1" />
            <Skeleton className="h-[65%] flex-1" />
            <Skeleton className="h-[55%] flex-1" />
            <Skeleton className="h-[80%] flex-1" />
            <Skeleton className="h-[35%] flex-1" />
            <Skeleton className="h-[60%] flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4 border-b pb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16 justify-self-end" />
          <Skeleton className="h-4 w-16 justify-self-end" />
          <Skeleton className="h-4 w-12 justify-self-end" />
          <Skeleton className="h-4 w-20 justify-self-end" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 border-b pb-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-18 justify-self-end" />
            <Skeleton className="h-4 w-18 justify-self-end" />
            <Skeleton className="h-4 w-16 justify-self-end" />
            <Skeleton className="h-4 w-8 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SpendingTrendsSkeleton() {
  return (
    <div className="space-y-4">
      <StatisticsSectionHeader title="Spending Trends" hasSelect />
      <div className="grid gap-4 md:grid-cols-2">
        <StatisticsCardSkeleton
          title="Spending Over Time"
          description="View your spending trends over months"
          contentClassName="p-6 pt-4"
        >
          <ChartSkeleton heightClassName="h-[300px]" />
        </StatisticsCardSkeleton>
        <StatisticsCardSkeleton
          title="Expense Distribution"
          description="Compare your expenses across months"
          contentClassName="p-6 pt-4"
        >
          <ChartSkeleton heightClassName="h-[300px]" />
        </StatisticsCardSkeleton>
      </div>
      <StatisticsCardSkeleton
        title="Spending Breakdown"
        description="Detailed view of your spending patterns"
      >
        <TableSkeleton />
      </StatisticsCardSkeleton>
    </div>
  );
}

export function CategoryAnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <StatisticsSectionHeader title="Category Analysis" />
      <StatisticsCardSkeleton
        title="Expenses by Category"
        description="View how your expenses are distributed"
      >
        <ChartSkeleton heightClassName="h-[320px]" />
      </StatisticsCardSkeleton>
      <StatisticsCardSkeleton
        title="Category Comparison"
        description="Compare spending across categories"
      >
        <ChartSkeleton heightClassName="h-[300px]" />
      </StatisticsCardSkeleton>
      <StatisticsCardSkeleton
        title="Category Spending vs. Limits"
        description="Track how close you are to your category spending limits"
      >
        <ProgressListSkeleton />
      </StatisticsCardSkeleton>
      <StatisticsCardSkeleton
        title="Category Trends"
        description="How your category spending has changed over time"
      >
        <ChartSkeleton heightClassName="h-[400px]" />
      </StatisticsCardSkeleton>
    </div>
  );
}

export function IncomeExpenseComparisonSkeleton() {
  return (
    <div className="space-y-4">
      <StatisticsSectionHeader title="Income vs Expenses" />
      <div className="grid gap-4 md:grid-cols-2">
        <StatisticsCardSkeleton
          title="Monthly Comparison"
          description="Income and expenses over the past months"
        >
          <ChartSkeleton heightClassName="h-[300px]" />
        </StatisticsCardSkeleton>
        <StatisticsCardSkeleton
          title="Net Income Trend"
          description="Your net income over time"
        >
          <ChartSkeleton heightClassName="h-[300px]" />
        </StatisticsCardSkeleton>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StatisticsCardSkeleton
          title="Income Sources"
          description="Breakdown of your income by source"
        >
          <ChartSkeleton heightClassName="h-[300px]" />
        </StatisticsCardSkeleton>
        <StatisticsCardSkeleton
          title="Income/Expense Ratio"
          description="How your income compares to expenses over time"
        >
          <div className="space-y-4">
            <ChartSkeleton heightClassName="h-[300px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </StatisticsCardSkeleton>
      </div>
    </div>
  );
}

export function SavingsAnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <StatisticsSectionHeader title="Savings Analysis" />
      <div className="grid gap-4 md:grid-cols-2">
        <StatisticsCardSkeleton
          title="Savings Rate"
          description="Percentage of income saved each month"
        >
          <div className="space-y-4">
            <ChartSkeleton heightClassName="h-[300px]" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </StatisticsCardSkeleton>
        <StatisticsCardSkeleton
          title="Savings Goals Progress"
          description="Progress towards your savings goals"
        >
          <ChartSkeleton heightClassName="h-[300px]" />
        </StatisticsCardSkeleton>
      </div>
      <StatisticsCardSkeleton
        title="Savings Projection"
        description="Projected savings growth over the next 6 months"
      >
        <div className="space-y-4">
          <ChartSkeleton heightClassName="h-[300px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </StatisticsCardSkeleton>
      <StatisticsCardSkeleton
        title="Savings Distribution"
        description="How your savings are distributed across different goals"
      >
        <ChartSkeleton heightClassName="h-[300px]" />
      </StatisticsCardSkeleton>
    </div>
  );
}
