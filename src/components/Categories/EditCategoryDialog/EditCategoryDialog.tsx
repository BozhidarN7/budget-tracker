'use client';

import type React from 'react';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Category } from '@/types/budget';
import { useBudgetContext } from '@/contexts/budget-context';
import { formatMonthKeyToReadable } from '@/utils';

const colorOptions = [
  { value: '#ef4444', label: 'Red' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#10b981', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
];

export default function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category;
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const { updateCategory, selectedMonth } = useBudgetContext();

  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the current month's limit or default to 0
  const currentMonthData = category.monthlyData[selectedMonth] || {
    limit: 0,
    spent: 0,
  };
  const [limit, setLimit] = useState(currentMonthData.limit.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Please enter a category name');
      return;
    }

    // For income categories, limit is optional
    if (category.type === 'expense' && !limit) {
      toast.error('Please enter a spending limit');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateCategory(category.id, {
        name,
        limit: Number.parseFloat(limit || '0'),
        color,
        // We don't change the type when editing
      });

      toast.success('Category updated successfully');
      onOpenChange(false);
    } catch (_error) {
      toast.error('Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit {category.type === 'income' ? 'Income' : 'Expense'} Category
          </DialogTitle>
          <DialogDescription>
            Update the details of your category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {category.type === 'expense' && (
              <div className="grid gap-2">
                <Label htmlFor="limit">
                  Monthly Limit for {formatMonthKeyToReadable(selectedMonth)}
                </Label>
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  Note: This will only change the limit for the current month.
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Color</Label>
              <RadioGroup
                value={color}
                onValueChange={setColor}
                className="flex flex-wrap gap-2"
              >
                {colorOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="[&:has(:checked)]:border-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-transparent"
                      style={{ backgroundColor: option.value }}
                    >
                      <span className="sr-only">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
