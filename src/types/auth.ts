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
  username?: string;
}

export interface SignInResult {
  user?: User;
  tokens?: AuthTokens;
  challenge?: AuthChallenge;
  requiresPasswordChange?: boolean;
}
