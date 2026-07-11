import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/constants/api';
import { buildAuthHeaders } from '@/server/auth';
import { CACHE_TAGS } from '@/constants';

export async function GET(): Promise<NextResponse> {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const res = await fetch(`${API_BASE_URL}/categorys`, {
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

  const res = await fetch(`${API_BASE_URL}/categorys`, {
    method: 'POST',
    headers,
    body,
  });

  const data = await res.json().catch(() => null);

  if (res.ok) {
    try {
      revalidateTag(CACHE_TAGS.budget.categories, { expire: 0 });
    } catch (error) {
      console.warn('Failed to revalidate cache:', error);
    }
  }

  return NextResponse.json(data, { status: res.status });
}
