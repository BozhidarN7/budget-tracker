'use client';

import TransactionFilters from '../TransactionFilters';
import TransactionList from '../TransactionList';
import { useBudgetData, useTransactionFilters } from '@/hooks/';

export default function TransactionListWithFilters() {
  const { transactions, isLoading } = useBudgetData();
  const { filters, filteredTransactions, updateFilter, clearFilters } =
    useTransactionFilters(transactions);

  return (
    <div className="space-y-6">
      <TransactionFilters
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />
      <TransactionList
        transactions={filteredTransactions}
        isLoading={isLoading}
      />
    </div>
  );
}
