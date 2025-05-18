'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudgetData } from '@/hooks/';
import { Skeleton } from '@/components/ui/skeleton';
import { useBudgetContext } from '@/contexts/budget-context';
import { Goal } from '@/types/budget';

export default function SavingsGoalCard() {
  const { savingsGoal, currentSavings, isLoading } = useBudgetData();
  const { updateGoal, goals } = useBudgetContext();
  const [isUpdating, setIsUpdating] = useState(false);

  // Find the main savings goal (assuming it's the first one with "Monthly" in the name)
  const mainGoal =
    goals.find((goal: Goal) => goal.name.includes('Monthly')) || goals[0];

  const progressPercentage = (currentSavings / savingsGoal) * 100;

  const handleUpdateProgress = async () => {
    if (!mainGoal) return;

    setIsUpdating(true);
    try {
      await updateGoal(mainGoal.id, {
        current: currentSavings,
      });
      toast.success('Savings goal progress updated');
    } catch (_error) {
      toast.error('Failed to update savings goal');
    } finally {
      setIsUpdating(false);
    }
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">Monthly Savings Goal</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUpdateProgress}
          disabled={isUpdating || !mainGoal}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Update Progress</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">
            ${currentSavings.toFixed(2)} / ${savingsGoal.toFixed(2)}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <p className="text-muted-foreground text-sm">
          {progressPercentage >= 100
            ? 'Goal reached! 🎉'
            : `${progressPercentage.toFixed(0)}% of your monthly savings goal`}
        </p>

        <div className="bg-muted rounded-lg p-4">
          <h3 className="mb-2 font-medium">Savings Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Income</span>
              <span className="font-medium">$5,200.00</span>
            </div>
            <div className="flex justify-between">
              <span>Total Expenses</span>
              <span className="font-medium">$3,750.00</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Available for Savings</span>
              <span className="font-medium">$1,450.00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
