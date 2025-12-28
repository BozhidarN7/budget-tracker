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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBudgetContext } from '@/contexts/budget-context';
import { useCurrencyPreference } from '@/contexts/currency-context';

const colorOptions = [
  { value: '#ef4444', label: 'Red' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#10b981', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
];

export default function AddCategoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [color, setColor] = useState(colorOptions[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addCategory } = useBudgetContext();
  const { preferredCurrency } = useCurrencyPreference();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Please enter a category name');
      return;
    }

    // For income categories, limit is optional
    if (activeTab === 'expense' && !limit) {
      toast.error('Please enter a spending limit');
      return;
    }

    setIsSubmitting(true);

    try {
      await addCategory({
        name,
        limit: Number.parseFloat(limit || '0'),
        currency: preferredCurrency,
        color,
        type: activeTab, // Set the category type based on the active tab
      });

      toast.success('Category created successfully');
      onOpenChange(false);

      // Reset form
      setName('');
      setLimit('');
      setColor(colorOptions[0].value);
      setActiveTab('expense');
    } catch (_error) {
      toast.error('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Create a new category for your transactions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as 'expense' | 'income')
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense">Expense</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
              </TabsList>
              <TabsContent value="expense" className="mt-4">
                <p className="text-muted-foreground mb-4 text-sm">
                  Create a category for tracking your expenses like groceries,
                  rent, or entertainment.
                </p>
              </TabsContent>
              <TabsContent value="income" className="mt-4">
                <p className="text-muted-foreground mb-4 text-sm">
                  Create a category for tracking your income sources like
                  salary, freelance work, or investments.
                </p>
              </TabsContent>
            </Tabs>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {activeTab === 'expense' && (
              <div className="grid gap-2">
                <Label htmlFor="limit">Monthly Limit</Label>
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
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
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
