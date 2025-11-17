'use client';

import { Loader2 } from 'lucide-react';

/**
 * BudgetLoading
 *
 * Used as a Suspense fallback while initial budget data (transactions,
 * categories, goals) is being loaded on the server.
 *
 * Extracted from the "Loading your budget data..." state in
 * ConditionalBudgetProvider.
 */
export default function BudgetLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">
          Loading your budget data...
        </p>
      </div>
    </div>
  );
}
