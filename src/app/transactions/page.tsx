import TransactionFilters from '@/components/Transactions/TransactionFilters';
import TransactionList from '@/components/Transactions/TransactionList';
import AddTransactionButton from '@/components/Transactions/AddTransactionButton';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <AddTransactionButton />
      </div>

      <TransactionFilters />
      <TransactionList />
    </div>
  );
}
