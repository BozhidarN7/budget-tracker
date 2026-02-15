'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import RecurringTransactionFormFields from './RecurringTransactionFormFields';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBudgetContext } from '@/contexts/budget-context';
import { useCurrencyPreference } from '@/contexts/currency-context';
import type { RecurrenceFrequency } from '@/types/budget';
import { buildInitialNextOccurrence } from '@/utils';

export default function AddRecurringTransactionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('monthly');
  const [dayOfMonth, setDayOfMonth] = useState<number>(new Date().getDate());
  const [status, setStatus] = useState<'active' | 'paused'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addRecurringTransaction, categories } = useBudgetContext();
  const { preferredCurrency } = useCurrencyPreference();

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) => cat.type === type || (type === 'expense' && !cat.type),
    );
  }, [categories, type]);

  useEffect(() => {
    setCategory('');
  }, [type]);

  useEffect(() => {
    if (frequency === 'monthly') {
      setDayOfMonth(startDate.getDate());
    }
  }, [frequency, startDate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!amount || !category || category === 'no-categories' || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const rule = {
        frequency,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      };

      await addRecurringTransaction({
        description,
        amount: Number.parseFloat(amount),
        category,
        currency: preferredCurrency,
        type,
        rule,
        nextOccurrence: buildInitialNextOccurrence(rule),
        status,
      });

      toast.success('Recurring series created');

      setDescription('');
      setAmount('');
      setCategory('');
      setStartDate(new Date());
      setEndDate(undefined);
      setFrequency('monthly');
      setDayOfMonth(new Date().getDate());
      setStatus('active');
      setType('expense');

      onOpenChange(false);
    } catch (_error) {
      toast.error('Failed to create recurring series');
    } finally {
      setIsSubmitting(false);
    }
  };

  const endDateLabel = endDate ? format(endDate, 'PPP') : 'Optional end date';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New Recurring Series</DialogTitle>
          <DialogDescription>
            Set up a recurring income or expense.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <RecurringTransactionFormFields
            description={description}
            type={type}
            amount={amount}
            category={category}
            startDate={startDate}
            endDate={endDate}
            endDateLabel={endDateLabel}
            frequency={frequency}
            dayOfMonth={dayOfMonth}
            status={status}
            filteredCategories={filteredCategories}
            onDescriptionChange={setDescription}
            onTypeChange={setType}
            onAmountChange={setAmount}
            onCategoryChange={setCategory}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onFrequencyChange={setFrequency}
            onDayOfMonthChange={setDayOfMonth}
            onStatusChange={setStatus}
          />
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || filteredCategories.length === 0}
            >
              {isSubmitting ? 'Saving...' : 'Save series'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
