'use client';

import { useBudgetData } from '@/hooks/';
import { Progress } from '@/components/ui/progress';

export default function SavingsGoalProgress() {
  const { savingsGoal, currentSavings } = useBudgetData();
  const progressPercentage = (currentSavings / savingsGoal) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Monthly Goal</span>
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
    </div>
  );
}
