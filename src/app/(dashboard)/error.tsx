'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * DashboardError
 *
 * Error boundary UI for the (dashboard) route group.
 * Reuses the error look and feel from ConditionalBudgetProvider's
 * "Unable to load your budget data" branch.
 */
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const message =
    error?.message || 'Unable to load your budget data. Please try again.';

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
              <p className="text-sm">{message}</p>
              <div className="flex gap-2 pt-2">
                <Button onClick={reset} size="sm" variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
