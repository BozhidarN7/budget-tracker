import { fetchCategories } from '@/api/budget-tracker-api/categories';
import { fetchGoals } from '@/api/budget-tracker-api/goals';
import { fetchTransactions } from '@/api/budget-tracker-api/transactions';
import { fetchRecurringTransactions } from '@/api/budget-tracker-api/recurring-transactions';
import type {
  Category,
  Goal,
  RecurringTransaction,
  Transaction,
} from '@/types/budget';

// Create data fetching function
export const fetchBudgetData = async (): Promise<{
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  goals: Goal[];
}> => {
  try {
    const [transactionsData, recurringData, categoriesData, goalsData] =
      await Promise.all([
        fetchTransactions(),
        fetchRecurringTransactions(),
        fetchCategories(),
        fetchGoals(),
      ]);

    return {
      transactions: transactionsData,
      recurringTransactions: recurringData,
      categories: categoriesData,
      goals: goalsData,
    };
  } catch (err) {
    console.error('Error fetching budget data:', err);
    return {
      transactions: [],
      recurringTransactions: [],
      categories: [],
      goals: [],
    };
  }
};
