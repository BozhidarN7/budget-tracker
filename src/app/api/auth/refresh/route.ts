import { NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getTokensFromCookies,
  getUserFromTokenServer,
  refreshTokensServer,
} from '@/utils/server-auth';
import type { AuthTokens, User } from '@/utils/auth';

function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokens,
): NextResponse {
  const commonOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  const accessTokenMaxAge = 60 * 60; // 1 hour
  const idTokenMaxAge = 60 * 60; // 1 hour
  const refreshTokenMaxAge = 60 * 60 * 24 * 7; // 7 days

  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...commonOptions,
    maxAge: accessTokenMaxAge,
  });
  response.cookies.set(ID_TOKEN_COOKIE, tokens.idToken, {
    ...commonOptions,
    maxAge: idTokenMaxAge,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...commonOptions,
    maxAge: refreshTokenMaxAge,
  });

  return response;
}

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

    return setAuthCookies(jsonResponse, newTokens);
  } catch (error) {
    console.error('Token refresh error (API route):', error);
    return NextResponse.json(
      { error: 'Failed to refresh session. Please sign in again.' },
      { status: 500 },
    );
  }
}
