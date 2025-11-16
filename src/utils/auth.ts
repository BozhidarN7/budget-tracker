import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';

// AWS Cognito configuration
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface User {
  username: string;
  email?: string;
  name?: string;
  sub?: string;
}

export interface AuthChallenge {
  challengeName: string;
  session: string;
  challengeParameters?: Record<string, string>;
  username?: string; // Store username for challenge response
}

export interface SignInResult {
  user?: User;
  tokens?: AuthTokens;
  challenge?: AuthChallenge;
  requiresPasswordChange?: boolean;
}

export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'budget_access_token';
  private static readonly ID_TOKEN_KEY = 'budget_id_token';
  private static readonly REFRESH_TOKEN_KEY = 'budget_refresh_token';
  private static readonly USER_KEY = 'budget_user';

  static async signIn(
    username: string,
    password: string,
  ): Promise<SignInResult> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await cognitoClient.send(command);

      // Handle authentication challenges (like NEW_PASSWORD_REQUIRED)
      if (response.ChallengeName) {
        return {
          challenge: {
            challengeName: response.ChallengeName,
            session: response.Session!,
            challengeParameters: response.ChallengeParameters,
            username: username, // Store the username for the challenge response
          },
          requiresPasswordChange:
            response.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED,
        };
      }

      if (!response.AuthenticationResult) {
        throw new Error('Authentication failed');
      }

      const tokens: AuthTokens = {
        accessToken: response.AuthenticationResult.AccessToken!,
        idToken: response.AuthenticationResult.IdToken!,
        refreshToken: response.AuthenticationResult.RefreshToken!,
      };

      // Get user details from Cognito
      const user = await this.getUserFromToken(tokens.accessToken);

      // Store tokens and user info
      this.storeTokens(tokens);
      this.storeUser(user);

      return { user, tokens };
    } catch (error) {
      console.error('Sign in error:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        'message' in error
      ) {
        // Handle specific Cognito errors with more user-friendly messages
        const err = error as { message: string; name: string };
        if (err.name === 'NotAuthorizedException') {
          throw new Error('Invalid username or password');
        } else if (err.name === 'UserNotConfirmedException') {
          throw new Error('User is not confirmed');
        } else if (err.name === 'PasswordResetRequiredException') {
          throw new Error('Password reset required');
        } else if (err.name === 'UserNotFoundException') {
          throw new Error('User not found');
        } else if (err.name === 'TooManyRequestsException') {
          throw new Error('Too many requests. Please try again later');
        } else if (err.name === 'InvalidParameterException') {
          throw new Error('Invalid username or password format');
        } else if (err.name === 'ResourceNotFoundException') {
          throw new Error('Authentication service unavailable');
        } else if (
          err.message?.includes('Network') ||
          err.message?.includes('fetch')
        ) {
          throw new Error('Network error. Please check your connection');
        }

        throw new Error('Sign in failed. Please try again');
      }

      throw new Error('Unexpected sign in error');
    }
  }

  static async respondToNewPasswordChallenge(
    username: string,
    newPassword: string,
    session: string,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const command = new RespondToAuthChallengeCommand({
        ClientId: CLIENT_ID,
        ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
        Session: session,
        ChallengeResponses: {
          USERNAME: username,
          NEW_PASSWORD: newPassword,
          // Add any required attributes if needed
          // 'userAttributes.email': 'user@example.com', // if email is required
        },
      });

      const response = await cognitoClient.send(command);

      // Handle additional challenges if any
      if (response.ChallengeName) {
        throw new Error(
          `Additional challenge required: ${response.ChallengeName}`,
        );
      }

      if (!response.AuthenticationResult) {
        throw new Error('Password change failed');
      }

      const tokens: AuthTokens = {
        accessToken: response.AuthenticationResult.AccessToken!,
        idToken: response.AuthenticationResult.IdToken!,
        refreshToken: response.AuthenticationResult.RefreshToken!,
      };

      // Get user details from Cognito
      const user = await this.getUserFromToken(tokens.accessToken);

      // Store tokens and user info
      this.storeTokens(tokens);
      this.storeUser(user);

      return { user, tokens };
    } catch (error) {
      console.error('Password change error:', error);
      if (typeof error === 'object' && error !== null && 'name' in error) {
        if (error.name === 'InvalidPasswordException') {
          throw new Error('Password does not meet requirements');
        } else if (error.name === 'InvalidParameterException') {
          throw new Error(
            'Invalid password format or missing required information',
          );
        } else if (error.name === 'CodeMismatchException') {
          throw new Error('Invalid session. Please try signing in again');
        } else if (error.name === 'ExpiredCodeException') {
          throw new Error('Session expired. Please try signing in again');
        } else if (error.name === 'TooManyRequestsException') {
          throw new Error('Too many requests. Please try again later');
        }
      }

      throw new Error('Failed to set new password. Please try again');
    }
  }

  static async refreshTokens(): Promise<AuthTokens | null> {
    try {
      const currentTokens = this.getTokens();
      if (!currentTokens?.refreshToken) {
        return null;
      }

      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        ClientId: CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: currentTokens.refreshToken,
        },
      });

      const response = await cognitoClient.send(command);

      if (!response.AuthenticationResult) {
        return null;
      }

      const newTokens: AuthTokens = {
        accessToken: response.AuthenticationResult.AccessToken!,
        idToken: response.AuthenticationResult.IdToken!,
        refreshToken: currentTokens.refreshToken, // Refresh token doesn't change
      };

      this.storeTokens(newTokens);
      return newTokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.signOut(); // Clear invalid tokens
      return null;
    }
  }

  static async getUserFromToken(accessToken: string): Promise<User> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      const response = await cognitoClient.send(command);

      const user: User = {
        username: response.Username!,
        sub: response.UserAttributes?.find((attr) => attr.Name === 'sub')
          ?.Value,
        email: response.UserAttributes?.find((attr) => attr.Name === 'email')
          ?.Value,
        name:
          response.UserAttributes?.find((attr) => attr.Name === 'name')
            ?.Value ||
          response.UserAttributes?.find((attr) => attr.Name === 'given_name')
            ?.Value ||
          response.Username,
      };

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      // Fallback to basic user info from username
      return {
        username: 'User',
        name: 'User',
      };
    }
  }

  static signOut(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.ID_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  static getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;

    try {
      const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const idToken = localStorage.getItem(this.ID_TOKEN_KEY);
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

      if (!accessToken || !idToken || !refreshToken) {
        return null;
      }

      return { accessToken, idToken, refreshToken };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const tokens = this.getTokens();
    if (!tokens) return false;

    try {
      // Check if access token is expired
      const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp > currentTime) {
        return true;
      }

      // Try to refresh tokens if access token is expired
      const newTokens = await this.refreshTokens();
      return !!newTokens;
    } catch (error) {
      console.error('Auth check error:', error);
      this.signOut();
      return false;
    }
  }

  static applySession(tokens: AuthTokens, user: User): void {
    this.storeTokens(tokens);
    this.storeUser(user);
  }

  private static storeTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.ID_TOKEN_KEY, tokens.idToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  private static storeUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }
}
