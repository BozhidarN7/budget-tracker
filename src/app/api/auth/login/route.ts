import { NextRequest, NextResponse } from 'next/server';
import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import {
  ACCESS_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getUserFromTokenServer,
} from '@/utils/server-auth';
import type {
  AuthChallenge,
  AuthTokens,
  SignInResult,
  User,
} from '@/types/auth';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

function mapSignInError(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'message' in error
  ) {
    const err = error as { message: string; name: string };

    if (err.name === 'NotAuthorizedException') {
      return 'Invalid username or password';
    }
    if (err.name === 'UserNotConfirmedException') {
      return 'User is not confirmed';
    }
    if (err.name === 'PasswordResetRequiredException') {
      return 'Password reset required';
    }
    if (err.name === 'UserNotFoundException') {
      return 'User not found';
    }
    if (err.name === 'TooManyRequestsException') {
      return 'Too many requests. Please try again later';
    }
    if (err.name === 'InvalidParameterException') {
      return 'Invalid username or password format';
    }
    if (err.name === 'ResourceNotFoundException') {
      return 'Authentication service unavailable';
    }
    if (
      typeof err.message === 'string' &&
      (err.message.includes('Network') || err.message.includes('fetch'))
    ) {
      return 'Network error. Please check your connection';
    }
  }

  return 'Sign in failed. Please try again';
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

  // You can tune lifetimes based on your Cognito config
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
      password?: string;
    } | null;

    if (!body?.username || !body?.password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 },
      );
    }

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: body.username,
        PASSWORD: body.password,
      },
    });

    const response = await cognitoClient.send(command);

    // Handle authentication challenges (like NEW_PASSWORD_REQUIRED)
    if (response.ChallengeName) {
      const challenge: AuthChallenge = {
        challengeName: response.ChallengeName,
        session: response.Session!,
        challengeParameters: response.ChallengeParameters,
        username: body.username,
      };

      const result: SignInResult = {
        challenge,
        requiresPasswordChange:
          response.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED,
      };

      return NextResponse.json(result, { status: 200 });
    }

    if (!response.AuthenticationResult) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 },
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
        { error: 'Failed to load user information' },
        { status: 500 },
      );
    }

    const result: SignInResult = {
      user,
      tokens,
      challenge: undefined,
      requiresPasswordChange: false,
    };

    const jsonResponse = NextResponse.json(result, { status: 200 });
    return setAuthCookies(jsonResponse, tokens);
  } catch (error) {
    console.error('Sign in error (API route):', error);
    const message = mapSignInError(error);
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
