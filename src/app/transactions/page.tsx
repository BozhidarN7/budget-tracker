import { redirect } from 'next/navigation';
import ProtectedAppLayout from '@/components/ProtectedAppLayout';
import { getCurrentUser } from '@/utils/server-auth';
import TransactionListWithFilters from '@/components/Transactions/TransactionListWithFilters';
import AddTransactionButton from '@/components/Transactions/AddTransactionButton';
import MonthSelector from '@/components/Dashboard/MonthSelector';

export default async function TransactionsPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  const { user, tokens } = result;

  return (
    <ProtectedAppLayout user={user} tokens={tokens}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <MonthSelector />
            <AddTransactionButton />
          </div>
        </div>

        <TransactionListWithFilters />
      </div>
    </ProtectedAppLayout>
  );
}
