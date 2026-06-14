import { getTokensFromCookies } from '@/server/auth';
import { API_BASE_URL } from '@/constants/api';
import { TRANSACTIONS_PAGE_SIZE } from '@/api/budget-tracker-api/transactions';
import type {
  Category,
  Goal,
  PaginatedTransactionsResponse,
  RecurringTransaction,
} from '@/types/budget';
import { CACHE_TAGS } from '@/constants';
import { getCurrentMonthKey, splitMonthKey } from '@/utils';

export interface BudgetData {
  currentMonth: string;
  transactionsPage: PaginatedTransactionsResponse;
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  goals: Goal[];
}

export interface BudgetDataSuccessResult {
  ok: true;
  data: BudgetData;
}

export interface BudgetDataErrorResult {
  ok: false;
  error: string;
  unauthenticated?: boolean;
  offline?: boolean;
}

export type BudgetDataResult = BudgetDataSuccessResult | BudgetDataErrorResult;

/**
 * Server-side budget data loader.
 *
 * Runs all three fetches in parallel directly against the external
 * budget API (API_BASE_URL), using tokens read from HttpOnly cookies.
 * This avoids using relative '/api/...' URLs from the server, which
 * caused "Failed to parse URL" errors.
 *
 * Instead of throwing, this function returns a discriminated union so
 * that callers (e.g. BudgetDataProvider) can render a graceful error UI
 * without being replaced by a route-level error boundary.
 */
export async function getInitialBudgetData(): Promise<BudgetDataResult> {
  try {
    const tokens = await getTokensFromCookies();

    if (!tokens?.idToken) {
      return {
        ok: false,
        unauthenticated: true,
        error: 'Your session has expired. Please log in again.',
      };
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.idToken}`,
    } as const;
    const currentMonth = getCurrentMonthKey();
    const { year, month } = splitMonthKey(currentMonth);
    const transactionsParams = new URLSearchParams({
      yaer: year.toString(),
      month: month.toString(),
      limit: TRANSACTIONS_PAGE_SIZE.toString(),
    });

    const [transactionsRes, recurringRes, categoriesRes, goalsRes] =
      await Promise.all([
        fetch(`${API_BASE_URL}/transactions?${transactionsParams.toString()}`, {
          method: 'GET',
          headers,
          cache: 'force-cache',
          next: { tags: [CACHE_TAGS.budget.transactions] },
        }),
        fetch(`${API_BASE_URL}/recurring-transactions`, {
          method: 'GET',
          headers,
          cache: 'force-cache',
          next: { tags: [CACHE_TAGS.budget.recurringTransactions] },
        }),
        fetch(`${API_BASE_URL}/categorys`, {
          method: 'GET',
          headers,
          cache: 'force-cache',
          next: { tags: [CACHE_TAGS.budget.categories] },
        }),
        fetch(`${API_BASE_URL}/goals`, {
          method: 'GET',
          headers,
          cache: 'force-cache',
          next: { tags: [CACHE_TAGS.budget.goals] },
        }),
      ]);

    if (
      !transactionsRes.ok ||
      !recurringRes.ok ||
      !categoriesRes.ok ||
      !goalsRes.ok
    ) {
      const errors = [
        !transactionsRes.ok && `transactions: ${transactionsRes.status}`,
        !recurringRes.ok && `recurring: ${recurringRes.status}`,
        !categoriesRes.ok && `categories: ${categoriesRes.status}`,
        !goalsRes.ok && `goals: ${goalsRes.status}`,
      ]
        .filter(Boolean)
        .join(', ');

      return {
        ok: false,
        error: `Failed to load budget data (${errors})`,
      };
    }

    const [transactionsPage, recurringTransactions, categories, goals] =
      (await Promise.all([
        transactionsRes.json(),
        recurringRes.json(),
        categoriesRes.json(),
        goalsRes.json(),
      ])) as [
        PaginatedTransactionsResponse,
        RecurringTransaction[],
        Category[],
        Goal[],
      ];

    return {
      ok: true,
      data: {
        currentMonth,
        transactionsPage,
        recurringTransactions,
        categories,
        goals,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unexpected error while loading budget data.';

    const lower = message.toLowerCase();
    const offline =
      lower.includes('network') ||
      lower.includes('fetch failed') ||
      lower.includes('failed to fetch');

    return {
      ok: false,
      error: offline
        ? 'Network error. Please check your connection and try again.'
        : 'Unexpected error while loading budget data.',
      offline,
    };
  }
}
