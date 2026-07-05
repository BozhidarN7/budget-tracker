import { PropsWithChildren, Suspense } from 'react';
import { redirect } from 'next/navigation';
import BudgetDataProvider from '@/components/BudgetDatatProvider';
import ProtectedAppLayout from '@/components/ProtectedAppLayout';
import { getCurrentUser } from '@/server/auth';
import BudgetLoading from '@/components/Budget/BudgetLoading';
import FallbackLoader from '@/components/FallbackLoader';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts';
import { SidebarSkeleton } from '@/components/Sidebar/SidebarSkeleton';

async function AuthBudgetShell({ children }: PropsWithChildren) {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  const { user } = result;
  return (
    <AuthProvider initialUser={user}>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <Suspense fallback={<BudgetLoading />}>
          <BudgetDataProvider>
            <ProtectedAppLayout>{children}</ProtectedAppLayout>
          </BudgetDataProvider>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <Suspense fallback={<FallbackLoader />}>
        <AuthBudgetShell>{children}</AuthBudgetShell>
      </Suspense>
    </div>
  );
}
