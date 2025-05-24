'use client';

import { useState } from 'react';
import CategoryListSkeleton from '../CategoryListSkeleton';
import ExpenseCategoryList from '../ExpenseCategoryList';
import IncomeCategoryList from '../IncomeCategoryList';
import { useBudgetData } from '@/hooks/';
import { useBudgetContext } from '@/contexts/budget-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatMonthKeyToReadable, getLastNMonthKeys } from '@/utils';

export default function CategoryList() {
  const { categories, isLoading } = useBudgetData();
  const { selectedMonth, setSelectedMonth } = useBudgetContext();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  // Get the last 12 months for the dropdown
  const availableMonths = getLastNMonthKeys(12);

  if (isLoading) {
    return <CategoryListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'expense' | 'income')}
          className="w-full"
        >
          <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="expense">Expense Categories</TabsTrigger>
              <TabsTrigger value="income">Income Categories</TabsTrigger>
            </TabsList>

            <div className="w-full md:w-auto">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {formatMonthKeyToReadable(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="expense" className="mt-6">
            <ExpenseCategoryList
              categories={categories}
              selectedMonth={selectedMonth}
            />
          </TabsContent>

          <TabsContent value="income" className="mt-6">
            <IncomeCategoryList
              categories={categories}
              selectedMonth={selectedMonth}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
