'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { Category, RecurrenceFrequency } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const FREQUENCY_LABELS: Record<RecurrenceFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  monthly: 'Monthly',
};

type RecurringTransactionFormFieldsProps = {
  description: string;
  type: 'income' | 'expense';
  amount: string;
  category: string;
  startDate: Date;
  endDate?: Date;
  endDateLabel: string;
  frequency: RecurrenceFrequency;
  dayOfMonth: number;
  status: 'active' | 'paused';
  filteredCategories: Category[];
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: 'income' | 'expense') => void;
  onAmountChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStartDateChange: (value: Date) => void;
  onEndDateChange: (value: Date | undefined) => void;
  onFrequencyChange: (value: RecurrenceFrequency) => void;
  onDayOfMonthChange: (value: number) => void;
  onStatusChange: (value: 'active' | 'paused') => void;
};

export default function RecurringTransactionFormFields({
  description,
  type,
  amount,
  category,
  startDate,
  endDate,
  endDateLabel,
  frequency,
  dayOfMonth,
  status,
  filteredCategories,
  onDescriptionChange,
  onTypeChange,
  onAmountChange,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onFrequencyChange,
  onDayOfMonthChange,
  onStatusChange,
}: RecurringTransactionFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="recurring-description">Description</Label>
        <Textarea
          id="recurring-description"
          placeholder="e.g., Rent payment"
          className="resize-none"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="recurring-type">Type</Label>
        <Select
          value={type}
          onValueChange={(value) => onTypeChange(value as 'income' | 'expense')}
        >
          <SelectTrigger id="recurring-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="recurring-amount">Amount</Label>
        <Input
          id="recurring-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="recurring-category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="recurring-category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories" disabled>
                No {type} categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {filteredCategories.length === 0 && (
          <p className="text-muted-foreground mt-1 text-xs">
            Please create a {type} category first in the Categories section.
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="recurring-start-date">Start date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="recurring-start-date"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !startDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && onStartDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="recurring-frequency">Frequency</Label>
        <Select
          value={frequency}
          onValueChange={(value) =>
            onFrequencyChange(value as RecurrenceFrequency)
          }
        >
          <SelectTrigger id="recurring-frequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {frequency === 'monthly' && (
        <div className="grid gap-2">
          <Label htmlFor="recurring-day">Day of month</Label>
          <Input
            id="recurring-day"
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(event) =>
              onDayOfMonthChange(Number.parseInt(event.target.value, 10) || 1)
            }
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="recurring-end-date">End date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="recurring-end-date"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !endDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDateLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => onEndDateChange(date ?? undefined)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="recurring-status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as 'active' | 'paused')
          }
        >
          <SelectTrigger id="recurring-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
