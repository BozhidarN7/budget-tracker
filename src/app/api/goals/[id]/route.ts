import { NextRequest, NextResponse } from 'next/server';
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

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<'/api/goals/[id]'>,
): Promise<NextResponse> {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const body = await request.text();
  const { id } = await ctx.params;

  const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: 'PUT',
    headers,
    body,
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<'/api/goals/[id]'>,
): Promise<NextResponse> {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { id } = await ctx.params;

  const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (res.status === 200 || res.status === 204) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
