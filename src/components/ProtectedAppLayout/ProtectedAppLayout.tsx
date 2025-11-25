import type React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts';
import type { User } from '@/types/auth';

interface ProtectedAppLayoutProps {
  user: User | null;
  children: React.ReactNode;
}

/**
 * ProtectedAppLayout
 *
 * Client-side shell used by protected pages:
 * - Accepts user from server (null if tokens expired)
 * - AuthProvider will handle token refresh if needed
 * - Renders the main app chrome (sidebar, header, layout)
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
