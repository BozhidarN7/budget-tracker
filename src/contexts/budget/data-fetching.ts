import { fetchCategories } from '@/api/budget-tracker-api/categories';
import { fetchGoals } from '@/api/budget-tracker-api/goals';
import { fetchTransactions } from '@/api/budget-tracker-api/transactions';
import type { Category, Goal, Transaction } from '@/types/budget';

// Create data fetching function
export const fetchBudgetData = async (): Promise<{
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
}> => {
  try {
    const [transactionsData, categoriesData, goalsData] = await Promise.all([
      fetchTransactions(),
      fetchCategories(),
      fetchGoals(),
    ]);

    return {
      transactions: transactionsData,
      categories: categoriesData,
      goals: goalsData,
    };
  } catch (err) {
    console.error('Error fetching budget data:', err);
    return {
      transactions: [],
      categories: [],
      goals: [],
    };
  }
};
