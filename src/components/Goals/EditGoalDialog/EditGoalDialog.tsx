'use client';

import type React from 'react';

import { useState } from 'react';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useBudgetContext } from '@/contexts/budget-context';
import type { Goal } from '@/types/budget';

export default function EditGoalDialog({
  goal,
  open,
  onOpenChange,
}: {
  goal: Goal;
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const [date, setDate] = useState<Date>(
    parse(goal.targetDate, 'MMM d, yyyy', new Date()),
  );
  const [name, setName] = useState(goal.name);
  const [target, setTarget] = useState(goal.target.toString());
  const [current, setCurrent] = useState(goal.current.toString());
  const [description, setDescription] = useState(goal.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateGoal } = useBudgetContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !target || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateGoal(goal.id, {
        name,
        target: Number.parseFloat(target),
        current: Number.parseFloat(current),
        targetDate: format(date, 'MMM d, yyyy'),
        description,
      });

      toast.success('Savings goal updated successfully');
      onOpenChange(false);
    } catch (_error) {
      toast.error('Failed to update savings goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Savings Goal</DialogTitle>
          <DialogDescription>
            Update the details of your savings goal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., New Car, Vacation"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="target">Target Amount</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="current">Current Amount</Label>
              <Input
                id="current"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description"
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
