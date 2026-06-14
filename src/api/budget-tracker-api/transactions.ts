import type {
  PaginatedTransactionsResponse,
  Transaction,
} from '@/types/budget';
import { getCurrentMonthKey, splitMonthKey } from '@/utils';

export const TRANSACTIONS_PAGE_SIZE = 50;

type FetchTransactionsParams = {
  monthKey?: string;
  limit?: number;
  cursor?: string;
};

function buildTransactionsQuery({
  monthKey = getCurrentMonthKey(),
  limit = TRANSACTIONS_PAGE_SIZE,
  cursor,
}: FetchTransactionsParams): string {
  const { year, month } = splitMonthKey(monthKey);
  const params = new URLSearchParams({
    year: year.toString(),
    month: month.toString(),
    limit: limit.toString(),
  });

  if (cursor) {
    params.set('cursor', cursor);
  }

  return params.toString();
}

export async function fetchTransactions({
  monthKey = getCurrentMonthKey(),
  limit = TRANSACTIONS_PAGE_SIZE,
  cursor,
}: FetchTransactionsParams): Promise<PaginatedTransactionsResponse> {
  try {
    const query = buildTransactionsQuery({ monthKey, limit, cursor });
    const res = await fetch(`/api/transactions?${query}`, {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('Error fetching transactions:', await res.text());
      return { items: [] };
    }

    return (await res.json()) as PaginatedTransactionsResponse;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { items: [] };
  }
}

export async function fetchAllTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch('/api/transactions/all', {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('Error fetching all transactions:', await res.text());
      return [];
    }

    return (await res.json()) as Transaction[];
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    return [];
  }
}

export { buildTransactionsQuery };

export async function createTransaction(
  transaction: Omit<Transaction, 'id'>,
): Promise<Transaction> {
  try {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!res.ok) {
      throw new Error(`Error creating transaction: ${res.statusText}`);
    }

    return (await res.json()) as Transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function updateTransaction(
  id: string,
  transaction: Partial<Transaction>,
): Promise<Transaction> {
  try {
    const res = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!res.ok) {
      throw new Error(`Error updating transaction: ${res.statusText}`);
    }

    return (await res.json()) as Transaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Error deleting transaction: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
