'use client';

import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import BudgetProvider from '@/contexts/budget-context';
import { useAuth } from '@/contexts/auth-context';
import { fetchTransactions } from '@/api/budget-tracker-api/transactions';
import { fetchCategories } from '@/api/budget-tracker-api/categories';
import { fetchGoals } from '@/api/budget-tracker-api/goals';
import { Category, Goal, Transaction } from '@/types/budget';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ConditionalBudgetProviderProps {
  children: React.ReactNode;
}

export default function ConditionalBudgetProvider({
  children,
}: ConditionalBudgetProviderProps) {
  const { isAuthenticated, isLoading: authLoading, refreshTokens } = useAuth();
  const [budgetData, setBudgetData] = useState<{
    transactions: Transaction[];
    categories: Category[];
    goals: Goal[];
  } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadBudgetData = useCallback(
    async (isRetry = false) => {
      if (!isAuthenticated) return;

      setIsLoadingData(true);
      setApiError(null);

      try {
        const [transactions, categories, goals] = await Promise.all([
          fetchTransactions(),
          fetchCategories(),
          fetchGoals(),
        ]);

        setBudgetData({ transactions, categories, goals });
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error fetching budget data:', error);

        // Handle authentication errors
        if (error && typeof error === 'object' && 'message' in error) {
          const err = error.message as { message: string };
          if (
            err.message.includes('Session expired') ||
            err.message.includes('sign in again')
          ) {
            // Don't set API error for auth issues, let the auth context handle it
            return;
          }

          // Handle other API errors
          setApiError(err.message || 'Failed to load budget data');
        }

        // Fallback to empty data if this is a retry or if we want to continue with offline mode
        if (isRetry || retryCount >= 2) {
          setBudgetData({ transactions: [], categories: [], goals: [] });
        }
      } finally {
        setIsLoadingData(false);
      }
    },
    [isAuthenticated, retryCount],
  );

  useEffect(() => {
    if (isAuthenticated && !budgetData && !apiError) {
      loadBudgetData();
    }
  }, [isAuthenticated, budgetData, apiError, loadBudgetData]);

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);

    // Try refreshing tokens first
    const tokenRefreshed = await refreshTokens();
    if (!tokenRefreshed) {
      setApiError('Authentication failed. Please sign in again.');
      return;
    }

    await loadBudgetData(true);
  };

  const handleOfflineMode = () => {
    setBudgetData({ transactions: [], categories: [], goals: [] });
    setApiError(null);
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render children without BudgetProvider (login page)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Show API error with retry options
  if (apiError && !budgetData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <div className="space-y-3">
                <p>
                  <strong>Unable to load your budget data:</strong>
                </p>
                <p className="text-sm">{apiError}</p>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleRetry} size="sm" variant="outline">
                    Try Again
                  </Button>
                  <Button
                    onClick={handleOfflineMode}
                    size="sm"
                    variant="secondary"
                  >
                    Continue Offline
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show loading while fetching budget data for authenticated users
  if (isAuthenticated && isLoadingData) {
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

  // If authenticated and data is loaded, render with BudgetProvider
  if (budgetData) {
    return (
      <BudgetProvider
        initialTransactions={budgetData.transactions}
        initialCategories={budgetData.categories}
        initialGoals={budgetData.goals}
      >
        {children}
      </BudgetProvider>
    );
  }

  // Fallback loading state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
