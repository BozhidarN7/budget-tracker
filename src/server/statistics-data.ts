import { API_BASE_URL } from '@/constants/api';
import { getTokensFromCookies } from '@/server/auth';
import type { Transaction } from '@/types/budget';

export async function getStatisticsTransactions(): Promise<Transaction[]> {
  try {
    const tokens = await getTokensFromCookies();

    if (!tokens?.idToken) {
      return [];
    }

    const res = await fetch(`${API_BASE_URL}/transactions/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.idToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(
        'Error fetching statistics transactions:',
        await res.text(),
      );
      return [];
    }

    return (await res.json()) as Transaction[];
  } catch (error) {
    console.error('Error fetching statistics transactions:', error);
    return [];
  }
}
