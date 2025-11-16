import { NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/utils/server-auth';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true }, { status: 200 });

  const commonOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    ...commonOptions,
    maxAge: 0,
  });
  response.cookies.set(ID_TOKEN_COOKIE, '', {
    ...commonOptions,
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    ...commonOptions,
    maxAge: 0,
  });

  return response;
}
