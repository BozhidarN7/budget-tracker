import type React from 'react';
import BudgetProvider from '@/contexts/budget-context';
import { getInitialBudgetData } from '@/server/budget-data';
import BudgetDataError from '@/components/Budget/BudgetDataError';

/**
 * BudgetDataProvider
 *
 * Server component that:
 * - Fetches initial budget data on the server using getInitialBudgetData
 * - On success, wraps children in BudgetProvider with initial data
 * - On failure, renders a graceful error UI (BudgetDataError) instead of
 *   triggering the route-level error boundary
 *
 * Intended to be used inside a Suspense boundary in the (dashboard) layout so
 * that loading is handled by a Suspense fallback.
 */
export default async function BudgetDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getInitialBudgetData();

  if (!result.ok) {
    return (
      <BudgetDataError
        message={result.error}
        unauthenticated={result.unauthenticated}
        offline={result.offline}
      />
    );
  }

  const { transactions, categories, goals } = result.data;

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
