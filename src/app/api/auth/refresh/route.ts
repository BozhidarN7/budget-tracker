import { NextResponse } from 'next/server';
import {
  getTokensFromCookies,
  getUserFromTokenServer,
  refreshTokensServer,
  setAuthCookies,
} from '@/server/auth';
import type { User } from '@/types/auth';

export async function POST(): Promise<NextResponse> {
  try {
    const existingTokens = await getTokensFromCookies();
    if (!existingTokens?.refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 401 },
      );
    }

    const newTokens = await refreshTokensServer(existingTokens.refreshToken);
    if (!newTokens) {
      return NextResponse.json(
        { error: 'Failed to refresh tokens' },
        { status: 401 },
      );
    }

    const user: User | null = await getUserFromTokenServer(
      newTokens.accessToken,
    );
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to load user during token refresh' },
        { status: 500 },
      );
    }

    const jsonResponse = NextResponse.json(
      {
        user,
        tokens: newTokens,
      },
      { status: 200 },
    );

    await setAuthCookies(newTokens);
    return jsonResponse;
  } catch (error) {
    console.error('Token refresh error (API route):', error);
    return NextResponse.json(
      { error: 'Failed to refresh session. Please sign in again.' },
      { status: 500 },
    );
  }
}
