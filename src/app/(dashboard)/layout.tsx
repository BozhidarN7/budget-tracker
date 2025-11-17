import type React from 'react';
import { redirect } from 'next/navigation';
import ProtectedAppLayout from '@/components/ProtectedAppLayout/ProtectedAppLayout';
import { getCurrentUser } from '@/utils/server-auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for all routes that use the Sidebar (dashboard, transactions, categories, goals, etc.).
 *
 * This layout:
 * - Runs on the server
 * - Enforces authentication via getCurrentUser and redirects to /login if unauthenticated
 * - Wraps all child pages in ProtectedAppLayout, so:
 *   - AuthProvider and ConditionalBudgetProvider are mounted once
 *   - Budget data is fetched once and kept in context across sidebar route navigation
 */
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  const { user } = result;

  return <ProtectedAppLayout user={user}>{children}</ProtectedAppLayout>;
}
