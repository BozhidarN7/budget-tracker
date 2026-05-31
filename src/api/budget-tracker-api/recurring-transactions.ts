import type {
  MaterializationSummary,
  RecurringTransaction,
} from '@/types/budget';

export async function fetchRecurringTransactions(): Promise<
  RecurringTransaction[]
> {
  try {
    const res = await fetch('/api/recurring-transactions', {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('Error fetching recurring transactions:', await res.text());
      return [];
    }

    return (await res.json()) as RecurringTransaction[];
  } catch (error) {
    console.error('Error fetching recurring transactions:', error);
    return [];
  }
}

export async function createRecurringTransaction(
  transaction: Omit<RecurringTransaction, 'id'>,
): Promise<RecurringTransaction> {
  try {
    const res = await fetch('/api/recurring-transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!res.ok) {
      throw new Error(
        `Error creating recurring transaction: ${res.statusText}`,
      );
    }

    return (await res.json()) as RecurringTransaction;
  } catch (error) {
    console.error('Error creating recurring transaction:', error);
    throw error;
  }
}

export async function updateRecurringTransaction(
  id: string,
  transaction: Partial<RecurringTransaction>,
): Promise<RecurringTransaction> {
  try {
    const res = await fetch(`/api/recurring-transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!res.ok) {
      throw new Error(
        `Error updating recurring transaction: ${res.statusText}`,
      );
    }

    return (await res.json()) as RecurringTransaction;
  } catch (error) {
    console.error('Error updating recurring transaction:', error);
    throw error;
  }
}

export async function deleteRecurringTransaction(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/recurring-transactions/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(
        `Error deleting recurring transaction: ${res.statusText}`,
      );
    }

    return true;
  } catch (error) {
    console.error('Error deleting recurring transaction:', error);
    throw error;
  }
}

export async function materializeRecurringTransactions(): Promise<MaterializationSummary> {
  try {
    const res = await fetch('/api/recurring-transactions/materialize', {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error(`Materialize failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error materializing recurring transaction:', error);
    throw error;
  }
}
