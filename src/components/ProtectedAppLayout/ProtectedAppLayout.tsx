import type React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts';
import type { User } from '@/types/auth';

interface ProtectedAppLayoutProps {
  user: User;
  children: React.ReactNode;
}

/**
 * ProtectedAppLayout
 *
 * Client-side shell used by protected pages:
 * - Expects an authenticated user (resolved on the server)
 * - Provides AuthContext and BudgetContext to the subtree
 * - Renders the main app chrome (sidebar, header, layout, toaster is in RootLayout)
 */
export default function ProtectedAppLayout({
  user,
  children,
}: ProtectedAppLayoutProps) {
  return (
    <AuthProvider initialUser={user}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="container mx-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
