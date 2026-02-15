import AddRecurringTransactionButton from '@/components/Transactions/AddRecurringTransactionButton';
import AddTransactionButton from '@/components/Transactions/AddTransactionButton';
import RecurringTransactionList from '@/components/Transactions/RecurringTransactionList';
import TransactionListWithFilters from '@/components/Transactions/TransactionListWithFilters';
import MonthSelector from '@/components/Dashboard/MonthSelector';

export default async function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <MonthSelector />
          <AddTransactionButton />
          <AddRecurringTransactionButton />
        </div>
      </div>

      <TransactionListWithFilters />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recurring Series</h2>
        </div>
        <RecurringTransactionList />
      </div>
    </div>
  );
}
