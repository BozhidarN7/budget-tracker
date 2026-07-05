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
    <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-4 md:px-6 md:py-6">
      <div className="flex w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground text-sm">
          Loading your budget data...
        </p>
      </div>
    </main>
  );
}
