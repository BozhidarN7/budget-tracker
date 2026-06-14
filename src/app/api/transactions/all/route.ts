import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/constants/api';
import { getTokensFromCookies } from '@/server/auth';

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

  const res = await fetch(`${API_BASE_URL}/transactions/all`, {
    method: 'GET',
    headers,
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
