'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useBudgetData } from '@/hooks/';

export default function GoalsList() {
  const { goals } = useBudgetData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const progressPercentage = (goal.current / goal.target) * 100;

        return (
          <div
            key={goal.id}
            className="bg-card rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{goal.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-rose-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-muted-foreground mt-1 text-sm">
              Target Date: {goal.targetDate}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Progress</span>
                <span className="text-sm font-medium">
                  ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-muted-foreground text-xs">
                {progressPercentage >= 100
                  ? 'Goal reached! 🎉'
                  : `${progressPercentage.toFixed(0)}% of goal achieved`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
