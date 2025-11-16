import { NextRequest, NextResponse } from 'next/server';
import {
  ChallengeNameType,
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import {
  ACCESS_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getUserFromTokenServer,
} from '@/utils/server-auth';
import type { AuthTokens, User } from '@/utils/auth';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

function mapNewPasswordError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'name' in error) {
    const err = error as { name: string; message?: string };

    if (err.name === 'InvalidPasswordException') {
      return 'Password does not meet requirements';
    }
    if (err.name === 'InvalidParameterException') {
      return 'Invalid password format or missing required information';
    }
    if (err.name === 'CodeMismatchException') {
      return 'Invalid session. Please try signing in again';
    }
    if (err.name === 'ExpiredCodeException') {
      return 'Session expired. Please try signing in again';
    }
    if (err.name === 'TooManyRequestsException') {
      return 'Too many requests. Please try again later';
    }
  }

  return 'Failed to set new password. Please try again';
}

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json().catch(() => null)) as {
      username?: string;
      newPassword?: string;
      session?: string;
    } | null;

    if (!body?.username || !body?.newPassword || !body?.session) {
      return NextResponse.json(
        { error: 'Username, new password and session are required' },
        { status: 400 },
      );
    }

    const command = new RespondToAuthChallengeCommand({
      ClientId: CLIENT_ID,
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      Session: body.session,
      ChallengeResponses: {
        USERNAME: body.username,
        NEW_PASSWORD: body.newPassword,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.ChallengeName) {
      return NextResponse.json(
        {
          error: `Additional challenge required: ${response.ChallengeName}`,
        },
        { status: 400 },
      );
    }

    if (!response.AuthenticationResult) {
      return NextResponse.json(
        { error: 'Password change failed' },
        { status: 400 },
      );
    }

    const tokens: AuthTokens = {
      accessToken: response.AuthenticationResult.AccessToken!,
      idToken: response.AuthenticationResult.IdToken!,
      refreshToken: response.AuthenticationResult.RefreshToken!,
    };

    const user: User | null = await getUserFromTokenServer(tokens.accessToken);
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to load user information after password change' },
        { status: 500 },
      );
    }

    const jsonResponse = NextResponse.json(
      {
        user,
        tokens,
      },
      { status: 200 },
    );

    return setAuthCookies(jsonResponse, tokens);
  } catch (error) {
    console.error('New password error (API route):', error);
    const message = mapNewPasswordError(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
