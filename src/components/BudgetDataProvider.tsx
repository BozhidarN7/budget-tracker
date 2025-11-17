import type React from 'react';
import BudgetProvider from '@/contexts/budget-context';
import { getInitialBudgetData } from '@/server/budget-data';

/**
 * BudgetDataProvider
 *
 * Server component that:
 * - Fetches initial budget data on the server using getInitialBudgetData
 * - Wraps children in BudgetProvider with initialTransactions/categories/goals
 *
 * Intended to be used inside a Suspense boundary in the (dashboard) layout so
 * that loading is handled by a Suspense fallback.
 */
export default async function BudgetDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { transactions, categories, goals } = await getInitialBudgetData();

  return (
    <BudgetProvider
      initialTransactions={transactions}
      initialCategories={categories}
      initialGoals={goals}
    >
      {children}
    </BudgetProvider>
  );
}
