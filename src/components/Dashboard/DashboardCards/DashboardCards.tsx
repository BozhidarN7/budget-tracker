'use client';

import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';
import DashboardCardsSkeleton from '../DashboardCardsSkeleton';
import { calculateTrend } from './utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetData, useCurrencyFormatter } from '@/hooks/';
import {
  formatMonthKey,
  getPreviousMonthKey,
  getToneColorClass,
  parseDate,
} from '@/utils';

export default function DashboardCards() {
  const {
    totalIncome,
    totalExpenses,
    netBalance,
    allTransactions,
    selectedMonth,
    isLoading,
  } = useBudgetData();
  const { formatCurrency } = useCurrencyFormatter();

  const previousMonthKey = getPreviousMonthKey(selectedMonth);

  const previousMonthTotals = allTransactions.reduce(
    (acc, transaction) => {
      const transactionMonth = formatMonthKey(parseDate(transaction.date));
      if (transactionMonth !== previousMonthKey) {
        return acc;
      }

      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc.expenses += transaction.amount;
      }

      return acc;
    },
    { income: 0, expenses: 0 },
  );

  const previousNetBalance =
    previousMonthTotals.income - previousMonthTotals.expenses;

  const incomeTrend = calculateTrend(
    totalIncome,
    previousMonthTotals.income,
    'increase',
  );

  const expensesTrend = calculateTrend(
    totalExpenses,
    previousMonthTotals.expenses,
    'decrease',
  );

  const netTrend = calculateTrend(netBalance, previousNetBalance, 'increase');

  if (isLoading) {
    return <DashboardCardsSkeleton />;
  }

  const IncomeTrendIcon = incomeTrend.direction === 'up' ? ArrowUp : ArrowDown;
  const incomeIconClass = getToneColorClass(incomeTrend.tone);

  const ExpensesTrendIcon =
    expensesTrend.direction === 'up' ? ArrowUp : ArrowDown;
  const expensesIconClass = getToneColorClass(expensesTrend.tone);

  const netIconClass = getToneColorClass(netTrend.tone);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <IncomeTrendIcon className={`h-4 w-4 ${incomeIconClass}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-muted-foreground text-xs">{incomeTrend.label}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ExpensesTrendIcon className={`h-4 w-4 ${expensesIconClass}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-muted-foreground text-xs">{expensesTrend.label}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className={`h-4 w-4 ${netIconClass}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netBalance)}</div>
          <p className="text-muted-foreground text-xs">{netTrend.label}</p>
        </CardContent>
      </Card>
    </div>
  );
}
