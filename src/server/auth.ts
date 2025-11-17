import { cookies } from 'next/headers';
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import type { AuthTokens, User } from '@/types/auth';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

export const ACCESS_TOKEN_COOKIE = 'bt_at';
export const ID_TOKEN_COOKIE = 'bt_id';
export const REFRESH_TOKEN_COOKIE = 'bt_rt';

export type ServerAuthTokens = AuthTokens;

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }
    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return true;
  }

  const exp = typeof payload.exp === 'number' ? payload.exp : null;
  if (!exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return exp <= currentTime;
}

/**
 * Read tokens from HttpOnly cookies on the server.
 */
export async function getTokensFromCookies(): Promise<ServerAuthTokens | null> {
  // In your environment cookies() appears to be typed as async, so we await it.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const idToken = cookieStore.get(ID_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !idToken || !refreshToken) {
    return null;
  }

  return { accessToken, idToken, refreshToken };
}

/**
 * Fetch Cognito user info given an access token.
 */
export async function getUserFromTokenServer(
  accessToken: string,
): Promise<User | null> {
  try {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await cognitoClient.send(command);

    const user: User = {
      username: response.Username!,
      sub: response.UserAttributes?.find((attr) => attr.Name === 'sub')?.Value,
      email: response.UserAttributes?.find((attr) => attr.Name === 'email')
        ?.Value,
      name:
        response.UserAttributes?.find((attr) => attr.Name === 'name')?.Value ||
        response.UserAttributes?.find((attr) => attr.Name === 'given_name')
          ?.Value ||
        response.Username,
    };

    return user;
  } catch (error) {
    console.error('Server getUser error:', error);
    return null;
  }
}

/**
 * Refresh tokens on the server using the Cognito REFRESH_TOKEN_AUTH flow.
 */
export async function refreshTokensServer(
  refreshToken: string,
): Promise<ServerAuthTokens | null> {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await cognitoClient.send(command);

    if (
      !response.AuthenticationResult?.AccessToken ||
      !response.AuthenticationResult.IdToken
    ) {
      return null;
    }

    return {
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Server token refresh error:', error);
    return null;
  }
}

/**
 * High-level helper used by layouts/pages to determine the current user from cookies.
 */
export async function getCurrentUser(): Promise<{
  user: User;
  tokens: ServerAuthTokens;
} | null> {
  const tokens = await getTokensFromCookies();
  if (!tokens) {
    return null;
  }

  if (isJwtExpired(tokens.accessToken)) {
    // For now, treat expired access tokens as unauthenticated on the server.
    // Token refresh can be handled via dedicated API routes.
    return null;
  }

  const user = await getUserFromTokenServer(tokens.accessToken);
  if (!user) {
    return null;
  }

  return { user, tokens };
}
