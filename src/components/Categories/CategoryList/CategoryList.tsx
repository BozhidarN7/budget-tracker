'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import CategoryListSkeleton from '../CategoryListSkeleton';
import EditCategoryDialog from '../EditCategoryDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useBudgetData } from '@/hooks/';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBudgetContext } from '@/contexts/budget-context';
import { Category } from '@/types/budget';
import { formatCurrency } from '@/utils';

export default function CategoryList() {
  const { categories, isLoading } = useBudgetData();
  const { removeCategory } = useBudgetContext();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (isLoading) {
    return <CategoryListSkeleton />;
  }

  const expenseCategories = categories.filter(
    (category) => category.type === 'expense' || !category.type,
  );
  const incomeCategories = categories.filter(
    (category) => category.type === 'income',
  );

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'expense' | 'income')}
      >
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="expense">Expense Categories</TabsTrigger>
          <TabsTrigger value="income">Income Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="expense" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expenseCategories.map((category) => {
              const progressPercentage =
                (category.spent / category.limit) * 100;
              const isOverLimit = progressPercentage > 100;

              return (
                <div
                  key={category.id}
                  className="bg-card rounded-lg border p-4 shadow-sm"
                >
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
                        <DropdownMenuItem
                          onClick={() => setEditingCategory(category)}
                        >
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
                          isOverLimit
                            ? 'text-rose-500'
                            : 'text-muted-foreground',
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
                          isOverLimit
                            ? '[--primary:theme(colors.rose.500)]'
                            : '',
                        )}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {isOverLimit
                        ? `${(progressPercentage - 100).toFixed(0)}% over limit`
                        : `${progressPercentage.toFixed(0)}% of monthly limit used`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="income" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {incomeCategories.length === 0 ? (
              <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No income categories yet
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Create your first income category to get started
                  </p>
                </div>
              </div>
            ) : (
              incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-card rounded-lg border p-4 shadow-sm"
                >
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
                        <DropdownMenuItem
                          onClick={() => setEditingCategory(category)}
                        >
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
                    <p className="text-muted-foreground text-sm">
                      Income source for tracking your{' '}
                      {category.name.toLowerCase()} transactions
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

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
    </div>
  );
}
