'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import EditCategoryDialog from '../EditCategoryDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
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
import { formatCurrency } from '@/utils';
import { formatMonthKeyToReadable } from '@/utils';
import type { Category } from '@/types/budget';
import { useBudgetContext } from '@/contexts/budget-context';

interface CategoryCardProps {
  category: Category;
  selectedMonth: string;
}

export default function CategoryCard({
  category,
  selectedMonth,
}: CategoryCardProps) {
  const { removeCategory } = useBudgetContext();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const monthData = category.monthlyData[selectedMonth] || {
    limit: 0,
    spent: 0,
  };

  const handleDelete = async () => {
    if (!deletingCategoryId) return;

    setIsDeleting(true);
    try {
      await removeCategory(deletingCategoryId);
      toast.success('Category deleted successfully');
    } catch (_error) {
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
      setDeletingCategoryId(null);
    }
  };

  if (category.type === 'expense') {
    const progressPercentage =
      monthData.limit > 0 ? (monthData.spent / monthData.limit) * 100 : 0;
    const isOverLimit = progressPercentage > 100;

    return (
      <>
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="font-medium">{category.name}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-rose-600"
                  onClick={() => setDeletingCategoryId(category.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Monthly Limit
              </span>
              <span
                className={cn(
                  'text-sm font-medium',
                  isOverLimit ? 'text-rose-500' : 'text-muted-foreground',
                )}
              >
                {formatCurrency(monthData.spent)} /{' '}
                {formatCurrency(monthData.limit)}
              </span>
            </div>
            <div className={cn(isOverLimit ? 'text-rose-500' : '')}>
              <Progress
                value={Math.min(progressPercentage, 100)}
                className={cn(
                  'h-2',
                  isOverLimit ? '[--primary:theme(colors.rose.500)]' : '',
                )}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {monthData.limit === 0
                ? 'No limit set for this month'
                : isOverLimit
                  ? `${(progressPercentage - 100).toFixed(0)}% over limit`
                  : `${progressPercentage.toFixed(0)}% of monthly limit used`}
            </p>
          </div>
        </div>

        {editingCategory && (
          <EditCategoryDialog
            category={editingCategory}
            open={!!editingCategory}
            onOpenChange={() => setEditingCategory(null)}
          />
        )}

        <AlertDialog
          open={!!deletingCategoryId}
          onOpenChange={(open) => !open && setDeletingCategoryId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                category. Any transactions associated with this category will
                need to be reassigned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
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
      </>
    );
  }

  // Income category rendering
  return (
    <>
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h3 className="font-medium">{category.name}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-rose-600"
                onClick={() => setDeletingCategoryId(category.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Income for {formatMonthKeyToReadable(selectedMonth)}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {formatCurrency(monthData.spent)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {monthData.spent > 0
              ? `Income source for tracking your ${category.name.toLowerCase()} transactions`
              : `No ${category.name.toLowerCase()} income recorded for this month`}
          </p>
        </div>
      </div>

      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
        />
      )}

      <AlertDialog
        open={!!deletingCategoryId}
        onOpenChange={(open) => !open && setDeletingCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category. Any transactions associated with this category will need
              to be reassigned.
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
    </>
  );
}
