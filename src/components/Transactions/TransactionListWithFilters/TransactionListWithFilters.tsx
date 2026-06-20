'use client';

import { ViewTransition } from 'react';
import TransactionFilters from '../TransactionFilters';
import TransactionList from '../TransactionList';
import { useBudgetData, useTransactionFilters } from '@/hooks/';
import { TRANSACTIONS_LIST_DASHBOARD_TRANSACTIONS } from '@/constants';

export default function TransactionListWithFilters() {
  const {
    isLoading,
    loadMoreTransactions,
    transactionPagination,
    transactions,
  } = useBudgetData();
  const { filters, filteredTransactions, updateFilter, clearFilters } =
    useTransactionFilters(transactions);
  const hasFiltersApplied =
    filters.search.trim().length > 0 ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined;
  const isFilteredEmpty =
    transactions.length > 0 && filteredTransactions.length === 0;

  return (
    <div className="space-y-6">
      <TransactionFilters
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />
      <ViewTransition name={TRANSACTIONS_LIST_DASHBOARD_TRANSACTIONS}>
        <TransactionList
          transactions={filteredTransactions}
          isFilteredEmpty={isFilteredEmpty}
          isLoading={isLoading || transactionPagination.isLoadingInitial}
          isLoadingMore={transactionPagination.isLoadingMore}
          hasMore={transactionPagination.hasMore}
          loadMoreError={transactionPagination.error}
          onLoadMore={loadMoreTransactions}
          showLoadedFilterNote={hasFiltersApplied}
        />
      </ViewTransition>
    </div>
  );
}
