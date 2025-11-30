'use client';

import { useBudgetData } from '@/hooks/';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils';

export default function CategoryLimits() {
  const { categoryLimits } = useBudgetData();

  return (
    <div className="space-y-4">
      {categoryLimits.map((category) => {
        const progressPercentage = (category.spent / category.limit) * 100;
        const isOverLimit = progressPercentage > 100;

        return (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{category.name}</span>
              <span
                className={cn(
                  'text-sm font-medium',
                  isOverLimit ? 'text-rose-500' : 'text-muted-foreground',
                )}
              >
                {formatCurrency(category.spent)} /{' '}
                {formatCurrency(category.limit)}
              </span>
            </div>
            <div className={cn(isOverLimit ? 'text-rose-500' : '')}>
              <Progress
                value={Math.min(progressPercentage, 100)}
                className={cn(
                  'h-2',
                  isOverLimit ? '[--primary:var(--colors-rose-500)]' : '',
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
