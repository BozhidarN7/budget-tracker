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
import { formatCurrency, getPreviousMonthKey } from '@/utils';
import { formatMonthKeyToReadable } from '@/utils';
import type { Category } from '@/types/budget';
import { useBudgetContext } from '@/contexts/budget-context';
import { getMostRecentMonthWithData } from '@/utils/category-utils';

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

  // Get month data with inheritance logic
  const getMonthDataWithInheritance = (
    category: Category,
    monthKey: string,
  ) => {
    // If data exists for this month, return it
    if (category.monthlyData[monthKey]) {
      return category.monthlyData[monthKey];
    }

    // For expense categories, try to inherit from previous months
    if (category.type === 'expense') {
      // Try previous month first
      const previousMonth = getPreviousMonthKey(monthKey);
      if (category.monthlyData[previousMonth]?.limit > 0) {
        return {
          limit: category.monthlyData[previousMonth].limit,
          spent: 0,
        };
      }

      // Find most recent month with data
      const recentMonthWithData = getMostRecentMonthWithData(category);
      if (
        recentMonthWithData &&
        category.monthlyData[recentMonthWithData]?.limit > 0
      ) {
        return {
          limit: category.monthlyData[recentMonthWithData].limit,
          spent: 0,
        };
      }
    }

    // Default fallback
    return { limit: 0, spent: 0 };
  };

  const monthData = getMonthDataWithInheritance(category, selectedMonth);

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
    const isInheritedLimit =
      !category.monthlyData[selectedMonth] && monthData.limit > 0;

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
                {isInheritedLimit && (
                  <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
                    (inherited)
                  </span>
                )}
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
                  isOverLimit ? '[--primary:var(--color-rose-500)]' : '',
                )}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {monthData.limit === 0
                ? 'No limit set for this month'
                : isOverLimit
                  ? `${(progressPercentage - 100).toFixed(0)}% over limit`
                  : `${progressPercentage.toFixed(0)}% of monthly limit used`}
              {isInheritedLimit && monthData.limit > 0 && (
                <span className="mt-1 block text-blue-600 dark:text-blue-400">
                  Limit inherited from previous month
                </span>
              )}
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
