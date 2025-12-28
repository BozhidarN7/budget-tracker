'use client';

import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface BudgetDataErrorProps {
  message: string;
  unauthenticated?: boolean;
  offline?: boolean;
}

/**
 * BudgetDataError
 *
 * Client-side error UI for when initial budget data cannot be loaded.
 * Shown by the server component BudgetDataProvider instead of triggering
 * the (dashboard) route-group error boundary.
 *
 * - Retry: re-runs the current route (router.refresh)
 * - Offline mode: marks an "offline" flag in localStorage and refreshes
 *   so that the app can choose to render a reduced/offline experience.
 */
export default function BudgetDataError({
  message,
  unauthenticated,
  offline,
}: BudgetDataErrorProps) {
  const router = useRouter();

  const handleRetry = () => {
    // Re-run the current route, causing BudgetDataProvider to refetch.
    router.refresh();
  };

  const handleOfflineMode = () => {
    // Mark offline mode in localStorage so the app can adapt if needed.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('budget_offline_mode', '1');
    }
    // Refresh to let the server/client read the new flag.
    router.refresh();
  };

  const finalMessage =
    message ||
    (offline
      ? 'Network error. Please check your connection and try again.'
      : unauthenticated
        ? 'Your session has expired. Please log in again.'
        : 'Unable to load your budget data. Please try again.');

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
              <p className="text-sm">{finalMessage}</p>
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
