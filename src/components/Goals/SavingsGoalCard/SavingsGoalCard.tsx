'use client';

import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudgetData } from '@/hooks/';

export default function SavingsGoalCard() {
  const { savingsGoal, currentSavings } = useBudgetData();
  const progressPercentage = (currentSavings / savingsGoal) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">Monthly Savings Goal</CardTitle>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
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
