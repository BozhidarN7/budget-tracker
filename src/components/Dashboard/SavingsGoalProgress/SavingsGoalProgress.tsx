'use client';

import { useBudgetData, useCurrencyFormatter } from '@/hooks/';
import { Progress } from '@/components/ui/progress';

export default function SavingsGoalProgress() {
  const { savingsGoal, currentSavings, savingsProgress } = useBudgetData();
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Monthly Goal</span>
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
    </div>
  );
}
