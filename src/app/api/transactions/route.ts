import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/constants/api';
import { getTokensFromCookies } from '@/server/auth';
import {
  CreateTransactionError,
  createTransactionInputSchema,
  createTransactionWithCategorySync,
} from '@/server/transactions/create-transaction';

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.toString();
  const url = query
    ? `${API_BASE_URL}/transactions?${query}`
    : `${API_BASE_URL}/transactions`;

  const res = await fetch(url, {
    method: 'GET',
    headers,
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const input = createTransactionInputSchema.parse(body);
    const result = await createTransactionWithCategorySync(input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof CreateTransactionError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid transaction payload' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 },
    );
  }
}
