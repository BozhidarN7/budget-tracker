'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SpendingTrends from '../SpendingTrends';
import CategoryAnalysis from '../CategoryAnalysis';
import IncomeExpenseComparison from '../IncomeExpenseComparison';
import SavingsAnalysis from '../SavingsAnalysis';
import {
  CategoryAnalysisSkeleton,
  IncomeExpenseComparisonSkeleton,
  SavingsAnalysisSkeleton,
  SpendingTrendsSkeleton,
} from './StatisticsViewSkeletons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Transaction } from '@/types/budget';

interface StatisticsViewProps {
  initialTransactionsPromise?: Promise<Transaction[]>;
}

export default function StatisticsView({
  initialTransactionsPromise = Promise.resolve([]),
}: StatisticsViewProps) {
  const searchParams = useSearchParams();

  const initialTab = searchParams.get('tab') || '';
  const normalizedInitialTab = useMemo(() => {
    const allowedTabs = new Set([
      'trends',
      'categories',
      'comparison',
      'savings',
    ]);
    if (allowedTabs.has(initialTab) === true) {
      return initialTab;
    }
    return 'trends';
  }, [initialTab]);

  const [activeTab, setActiveTab] = useState(normalizedInitialTab);

  return (
    <Tabs
      defaultValue={normalizedInitialTab}
      value={initialTab || activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="trends">Spending Trends</TabsTrigger>
        <TabsTrigger value="categories">Category Analysis</TabsTrigger>
        <TabsTrigger value="comparison">Income vs Expenses</TabsTrigger>
        <TabsTrigger value="savings">Savings Analysis</TabsTrigger>
      </TabsList>
      <TabsContent value="trends" className="space-y-4">
        <Suspense fallback={<SpendingTrendsSkeleton />}>
          <SpendingTrends
            initialTransactionsPromise={initialTransactionsPromise}
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="categories" className="space-y-4">
        <Suspense fallback={<CategoryAnalysisSkeleton />}>
          <CategoryAnalysis
            initialTransactionsPromise={initialTransactionsPromise}
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="comparison" className="space-y-4">
        <Suspense fallback={<IncomeExpenseComparisonSkeleton />}>
          <IncomeExpenseComparison
            initialTransactionsPromise={initialTransactionsPromise}
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="savings" className="space-y-4">
        <Suspense fallback={<SavingsAnalysisSkeleton />}>
          <SavingsAnalysis
            initialTransactionsPromise={initialTransactionsPromise}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
