import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(): Promise<NextResponse> {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'GET',
    headers,
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const body = await request.text();

  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers,
    body,
  });

  const data = await res.json().catch(() => null);

  if (res.ok) {
    try {
      revalidateTag(CACHE_TAGS.budget.transactions, { expire: 0 });
    } catch (error) {
      console.warn('Failed to revalidate cache:', error);
    }
  }

  return NextResponse.json(data, { status: res.status });
}
