import type { RecurringTransaction } from '@/types/budget';
import { buildInitialNextOccurrence } from '@/utils';

const mockRecurringTransactions: RecurringTransaction[] = [
  {
    id: 'rec-1',
    description: 'Rent',
    amount: 1200,
    currency: 'BGN',
    category: 'Housing',
    type: 'expense',
    rule: {
      frequency: 'monthly',
      startDate: '2025-01-05',
      dayOfMonth: 5,
    },
    nextOccurrence: buildInitialNextOccurrence({
      frequency: 'monthly',
      startDate: '2025-01-05',
      dayOfMonth: 5,
    }),
    status: 'active',
  },
  {
    id: 'rec-2',
    description: 'Gym Membership',
    amount: 45,
    currency: 'BGN',
    category: 'Health',
    type: 'expense',
    rule: {
      frequency: 'monthly',
      startDate: '2025-01-10',
      dayOfMonth: 10,
    },
    nextOccurrence: buildInitialNextOccurrence({
      frequency: 'monthly',
      startDate: '2025-01-10',
      dayOfMonth: 10,
    }),
    status: 'active',
  },
  {
    id: 'rec-3',
    description: 'Weekly Savings',
    amount: 50,
    currency: 'BGN',
    category: 'Savings',
    type: 'expense',
    rule: {
      frequency: 'weekly',
      startDate: '2025-01-03',
    },
    nextOccurrence: buildInitialNextOccurrence({
      frequency: 'weekly',
      startDate: '2025-01-03',
    }),
    status: 'active',
  },
];

export default mockRecurringTransactions;
