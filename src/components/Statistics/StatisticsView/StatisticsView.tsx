'use client';

import { useState } from 'react';
import SpendingTrends from '../SpendingTrends';
import CategoryAnalysis from '../CategoryAnalysis';
import IncomeExpenseComparison from '../IncomeExpenseComparison';
import SavingsAnalysis from '../SavingsAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StatisticsView() {
  const [activeTab, setActiveTab] = useState('trends');

  return (
    <Tabs
      defaultValue="trends"
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
