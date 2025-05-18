'use client';

import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';
import DashboardCardsSkeleton from '../DashboardCardsSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/';
import { formatCurrency } from '@/utils';

export default function DashboardCards() {
  const { totalIncome, totalExpenses, netBalance, isLoading } = useBudgetData();

  if (isLoading) {
    return <DashboardCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-muted-foreground text-xs">
            +12.5% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-muted-foreground text-xs">+8.2% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netBalance)}</div>
          <p className="text-muted-foreground text-xs">+4.3% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}
