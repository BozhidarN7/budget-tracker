import { getTokensFromCookies } from '@/server/auth';
import { API_BASE_URL } from '@/constants/api';
import type { Category, Goal, Transaction } from '@/types/budget';

export interface BudgetData {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
}

/**
 * Server-side budget data loader.
 *
 * Runs all three fetches in parallel directly against the external
 * budget API (API_BASE_URL), using tokens read from HttpOnly cookies.
 * This avoids using relative '/api/...' URLs from the server, which
 * caused "Failed to parse URL" errors.
 */
export async function getInitialBudgetData(): Promise<BudgetData> {
  const tokens = await getTokensFromCookies();

  if (!tokens?.idToken) {
    throw new Error('Unauthenticated. Unable to load budget data.');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokens.idToken}`,
  } as const;

  const [transactionsRes, categoriesRes, goalsRes] = await Promise.all([
    fetch(`${API_BASE_URL}/transactions`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    }),
    fetch(`${API_BASE_URL}/categorys`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    }),
    fetch(`${API_BASE_URL}/goals`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    }),
  ]);

  if (!transactionsRes.ok || !categoriesRes.ok || !goalsRes.ok) {
    const errors = [
      !transactionsRes.ok && `transactions: ${transactionsRes.status}`,
      !categoriesRes.ok && `categories: ${categoriesRes.status}`,
      !goalsRes.ok && `goals: ${goalsRes.status}`,
    ]
      .filter(Boolean)
      .join(', ');
    throw new Error(`Failed to load budget data (${errors})`);
  }

  const [transactions, categories, goals] = (await Promise.all([
    transactionsRes.json(),
    categoriesRes.json(),
    goalsRes.json(),
  ])) as [Transaction[], Category[], Goal[]];

  return { transactions, categories, goals };
}
