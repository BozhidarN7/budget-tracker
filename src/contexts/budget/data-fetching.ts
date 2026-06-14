import {
  TRANSACTIONS_PAGE_SIZE,
  fetchTransactions,
} from '@/api/budget-tracker-api/transactions';
import { fetchCategories } from '@/api/budget-tracker-api/categories';
import { fetchGoals } from '@/api/budget-tracker-api/goals';
import { fetchRecurringTransactions } from '@/api/budget-tracker-api/recurring-transactions';
import { getCurrentMonthKey } from '@/utils';
import type {
  Category,
  Goal,
  PaginatedTransactionsResponse,
  RecurringTransaction,
} from '@/types/budget';

export const fetchBudgetData = async (): Promise<{
  currentMonth: string;
  transactionsPage: PaginatedTransactionsResponse;
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  goals: Goal[];
}> => {
  const currentMonth = getCurrentMonthKey();

  try {
    const [transactionsPage, recurringData, categoriesData, goalsData] =
      await Promise.all([
        fetchTransactions({
          monthKey: currentMonth,
          limit: TRANSACTIONS_PAGE_SIZE,
        }),
        fetchRecurringTransactions(),
        fetchCategories(),
        fetchGoals(),
      ]);

    return {
      currentMonth,
      transactionsPage,
      recurringTransactions: recurringData,
      categories: categoriesData,
      goals: goalsData,
    };
  } catch (err) {
    console.error('Error fetching budget data:', err);
    return {
      currentMonth,
      transactionsPage: { items: [] },
      recurringTransactions: [],
      categories: [],
      goals: [],
    };
  }
};
