import type React from 'react';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import ProtectedAppLayout from '@/components/ProtectedAppLayout/ProtectedAppLayout';
import { getCurrentUser } from '@/server/auth';
import BudgetDataProvider from '@/components/BudgetDataProvider';
import BudgetLoading from '@/components/Budget/BudgetLoading';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for all routes that use the Sidebar (dashboard, transactions, categories, goals, etc.).
 *
 * This layout:
 * - Runs on the server
 * - Enforces authentication via getCurrentUser and redirects to /login if unauthenticated
 * - Wraps all child pages in:
 *   - BudgetDataProvider (server), which fetches budget data once on the server
 *   - ProtectedAppLayout (client), which provides Auth context and the app chrome
 * - Uses Suspense with BudgetLoading as a fallback while budget data loads
 */
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  const { user } = result;

  return (
    <Suspense fallback={<BudgetLoading />}>
      <BudgetDataProvider>
        <ProtectedAppLayout user={user}>{children}</ProtectedAppLayout>
      </BudgetDataProvider>
    </Suspense>
  );
}
