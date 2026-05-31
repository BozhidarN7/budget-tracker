import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/constants/api';
import { getTokensFromCookies } from '@/server/auth';
import { CACHE_TAGS } from '@/constants';

async function buildAuthHeaders() {
  const tokens = await getTokensFromCookies();
  if (!tokens?.idToken) {
    return null;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokens.idToken}`,
  };
}

export async function POST(): Promise<NextResponse> {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const res = await fetch(
    `${API_BASE_URL}/recurring-transactions/materialize`,
    {
      method: 'POST',
      headers,
    },
  );

  const data = await res.json().catch(() => null);

  if (res.ok) {
    try {
      revalidateTag(CACHE_TAGS.budget.transactions, { expire: 0 });
      revalidateTag(CACHE_TAGS.budget.recurringTransactions, { expire: 0 });
    } catch (error) {
      console.warn('Failed to revalidate cache:', error);
    }
  }

  return NextResponse.json(data, { status: res.status });
}
