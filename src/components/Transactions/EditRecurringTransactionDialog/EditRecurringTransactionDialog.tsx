'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import RecurringTransactionFormFields from '../AddRecurringTransactionDialog/RecurringTransactionFormFields';
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
import type { RecurringFrequency, RecurringTransaction } from '@/types/budget';
import { buildInitialNextOccurrence } from '@/utils';

export default function EditRecurringTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: RecurringTransaction;
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const [description, setDescription] = useState(transaction.description);
  const [type, setType] = useState<'income' | 'expense'>(transaction.type);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [startDate, setStartDate] = useState<Date>(
    parseISO(transaction.rule.startDate),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    transaction.rule.endDate ? parseISO(transaction.rule.endDate) : undefined,
  );
  const [frequency, setFrequency] = useState<RecurringFrequency>(
    transaction.rule.frequency,
  );
  const [dayOfMonth, setDayOfMonth] = useState<number>(
    transaction.rule.dayOfMonth ??
      parseISO(transaction.rule.startDate).getDate(),
  );
  const [status, setStatus] = useState<'active' | 'paused'>(
    transaction.status === 'paused' ? 'paused' : 'active',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateRecurringTransaction, categories } = useBudgetContext();
  const { preferredCurrency } = useCurrencyPreference();

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) => cat.type === type || (type === 'expense' && !cat.type),
    );
  }, [categories, type]);

  useEffect(() => {
    if (type !== transaction.type) {
      setCategory('');
    }
  }, [transaction.type, type]);

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

      await updateRecurringTransaction(transaction.id, {
        description,
        amount: Number.parseFloat(amount),
        category,
        currency: preferredCurrency,
        type,
        rule,
        nextOccurrence: buildInitialNextOccurrence(rule),
        status,
      });

      toast.success('Recurring series updated');
      onOpenChange(false);
    } catch (_error) {
      toast.error('Failed to update recurring series');
    } finally {
      setIsSubmitting(false);
    }
  };

  const endDateLabel = endDate ? format(endDate, 'PPP') : 'Optional end date';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit Recurring Series</DialogTitle>
          <DialogDescription>
            Update schedule, amount, and status details.
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
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
