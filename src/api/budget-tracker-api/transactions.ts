import { makeAuthenticatedRequest } from './utils';
import { API_BASE_URL } from '@/constants/api';
import { Transaction } from '@/types/budget';

export async function fetchTransactions() {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/transactions`);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}
export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}
export async function updateTransaction(
  id: string,
  transaction: Partial<Transaction>,
) {
  try {
    return await makeAuthenticatedRequest(
      `${API_BASE_URL}/transactions/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(transaction),
      },
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(id: string) {
  try {
    await makeAuthenticatedRequest(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
