'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
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

export default function AddGoalDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const [date, setDate] = useState<Date>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Savings Goal</DialogTitle>
          <DialogDescription>
            Create a new savings goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input id="name" placeholder="e.g., New Car, Vacation" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target">Target Amount</Label>
            <Input
              id="target"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
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
                  onSelect={setDate}
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
