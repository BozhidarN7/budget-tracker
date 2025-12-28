import { Transaction } from '@/types/budget';

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch('/api/transactions', {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('Error fetching transactions:', await res.text());
      return [];
    }

    return (await res.json()) as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

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
