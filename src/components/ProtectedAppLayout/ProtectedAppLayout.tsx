'use client';

import type React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ConditionalBudgetProvider from '@/components/ConditionalBugdetProvider';
import { AuthProvider } from '@/contexts';
import type { AuthTokens, User } from '@/utils/auth';

interface ProtectedAppLayoutProps {
  user: User;
  tokens: AuthTokens;
  children: React.ReactNode;
}

/**
 * ProtectedAppLayout
 *
 * Client-side shell used by protected pages:
 * - Expects an authenticated user and tokens (resolved on the server)
 * - Provides AuthContext and BudgetContext to the subtree
 * - Renders the main app chrome (sidebar, header, layout, toaster is in RootLayout)
 */
export default function ProtectedAppLayout({
  user,
  tokens,
  children,
}: ProtectedAppLayoutProps) {
  return (
    <AuthProvider initialUser={user} initialTokens={tokens}>
      <ConditionalBudgetProvider>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="container mx-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </ConditionalBudgetProvider>
    </AuthProvider>
  );
}
