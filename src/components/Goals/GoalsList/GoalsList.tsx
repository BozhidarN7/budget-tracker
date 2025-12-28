'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import GoalsListSkeleton from '../GoalsListSkeleton';
import EditGoalDialog from '../EditGoalDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useBudgetData, useCurrencyFormatter } from '@/hooks/';
import { useBudgetContext } from '@/contexts/budget-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Goal } from '@/types/budget';

export default function GoalsList() {
  const { goals, isLoading } = useBudgetData();
  const { removeGoal } = useBudgetContext();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { formatCurrency } = useCurrencyFormatter();

  const handleDelete = async () => {
    if (!deletingGoalId) return;

    setIsDeleting(true);
    try {
      await removeGoal(deletingGoalId);
      toast.success('Goal deleted successfully');
    } catch (_error) {
      toast.error('Failed to delete goal');
    } finally {
      setIsDeleting(false);
      setDeletingGoalId(null);
    }
  };

  if (isLoading) {
    return <GoalsListSkeleton />;
  }

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
                  <DropdownMenuItem onClick={() => setEditingGoal(goal)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-rose-600"
                    onClick={() => setDeletingGoalId(goal.id)}
                  >
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
                  {formatCurrency(goal.displayCurrent ?? 0)} /{' '}
                  {formatCurrency(goal.displayTarget ?? 0)}
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

      {editingGoal && (
        <EditGoalDialog
          goal={editingGoal}
          open={!!editingGoal}
          onOpenChange={() => setEditingGoal(null)}
        />
      )}

      <AlertDialog
        open={!!deletingGoalId}
        onOpenChange={(open) => !open && setDeletingGoalId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              savings goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
