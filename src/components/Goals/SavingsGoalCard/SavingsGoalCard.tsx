'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudgetData, useCurrencyFormatter } from '@/hooks/';
import { Skeleton } from '@/components/ui/skeleton';
import AddGoalButton from '@/components/Goals/AddGoalButton';
import EditGoalDialog from '@/components/Goals/EditGoalDialog';

export default function SavingsGoalCard() {
  const {
    primaryGoal,
    savingsGoal,
    currentSavings,
    savingsProgress,
    savingsBreakdown,
    isLoading,
  } = useBudgetData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { formatCurrency } = useCurrencyFormatter();
  const breakdown = savingsBreakdown ?? {
    totalIncome: 0,
    totalExpenses: 0,
    availableForSavings: 0,
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-9 w-9 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-48" />

          <div className="bg-muted rounded-lg p-4">
            <Skeleton className="mb-2 h-5 w-40" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between border-t pt-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!primaryGoal) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Monthly Savings Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            You have not configured a Monthly Savings Goal yet. Create one to
            track how income and expenses translate into savings progress for
            each month.
          </p>
          <AddGoalButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">{primaryGoal.name}</CardTitle>
            <p className="text-muted-foreground text-sm">
              Target date: {primaryGoal.targetDate}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditDialogOpen(true)}
            disabled={!primaryGoal}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit savings goal</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">
              {formatCurrency(currentSavings)} / {formatCurrency(savingsGoal)}
            </span>
          </div>
          <Progress value={savingsProgress} className="h-2" />
          <p className="text-muted-foreground text-sm">
            {savingsProgress >= 100
              ? 'Goal reached! 🎉'
              : `${savingsProgress.toFixed(0)}% of your monthly savings goal`}
          </p>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="mb-2 font-medium">Monthly Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Income</span>
                <span className="font-medium">
                  {formatCurrency(breakdown.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses</span>
                <span className="font-medium">
                  {formatCurrency(breakdown.totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Available for Savings</span>
                <span className="font-medium">
                  {formatCurrency(breakdown.availableForSavings)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {primaryGoal && (
        <EditGoalDialog
          goal={primaryGoal}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </>
  );
}
