'use client';

import { useMemo, useState } from 'react';
import SpendingTrends from '../SpendingTrends';
import CategoryAnalysis from '../CategoryAnalysis';
import IncomeExpenseComparison from '../IncomeExpenseComparison';
import SavingsAnalysis from '../SavingsAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StatisticsViewProps {
  initialTab?: string;
}

export default function StatisticsView({
  initialTab = 'trends',
}: StatisticsViewProps) {
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
      value={activeTab}
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
        <SpendingTrends />
      </TabsContent>
      <TabsContent value="categories" className="space-y-4">
        <CategoryAnalysis />
      </TabsContent>
      <TabsContent value="comparison" className="space-y-4">
        <IncomeExpenseComparison />
      </TabsContent>
      <TabsContent value="savings" className="space-y-4">
        <SavingsAnalysis />
      </TabsContent>
    </Tabs>
  );
}
