import { PropsWithChildren, Suspense } from 'react';
import { redirect } from 'next/navigation';
import BudgetDataProvider from '@/components/BudgetDatatProvider';
import ProtectedAppLayout from '@/components/ProtectedAppLayout';
import { getCurrentUser } from '@/server/auth';
import BudgetLoading from '@/components/Budget/BudgetLoading';
import FallbackLoader from '@/components/FallbackLoader';

async function AuthBudgetShell({ children }: PropsWithChildren) {
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

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <AuthBudgetShell>{children}</AuthBudgetShell>
    </Suspense>
  );
}
