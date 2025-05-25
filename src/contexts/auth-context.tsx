'use client';

import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  type AuthChallenge,
  AuthService,
  type AuthTokens,
  type User,
} from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  challenge: AuthChallenge | null;
  requiresPasswordChange: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  setNewPassword: (newPassword: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  clearChallenge: () => void;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<AuthChallenge | null>(null);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedTokens = AuthService.getTokens();
      const storedUser = AuthService.getUser();

      if (storedTokens && storedUser) {
        const isValid = await AuthService.isAuthenticated();
        if (isValid) {
          setTokens(AuthService.getTokens()); // Get potentially refreshed tokens
          setUser(storedUser);
        } else {
          // Clear invalid session
          AuthService.signOut();
          setTokens(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      AuthService.signOut();
      setTokens(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signIn = async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await AuthService.signIn(username, password);

      if (result.challenge) {
        setChallenge(result.challenge);
        setRequiresPasswordChange(result.requiresPasswordChange || false);
      } else if (result.user && result.tokens) {
        setUser(result.user);
        setTokens(result.tokens);
        setChallenge(null);
        setRequiresPasswordChange(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign in failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setNewPassword = async (newPassword: string) => {
    if (!challenge?.username || !challenge?.session) {
      throw new Error('Invalid session. Please try signing in again');
    }

    try {
      setError(null);
      setIsLoading(true);
      const { user: authUser, tokens: authTokens } =
        await AuthService.respondToNewPasswordChallenge(
          challenge.username,
          newPassword,
          challenge.session,
        );
      setUser(authUser);
      setTokens(authTokens);
      setChallenge(null);
      setRequiresPasswordChange(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Password change failed',
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const newTokens = await AuthService.refreshTokens();
      if (newTokens) {
        setTokens(newTokens);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      signOut();
      return false;
    }
  };

  const signOut = useCallback(() => {
    AuthService.signOut();
    setUser(null);
    setTokens(null);
    setError(null);
    setChallenge(null);
    setRequiresPasswordChange(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearChallenge = useCallback(() => {
    setChallenge(null);
    setRequiresPasswordChange(false);
  }, []);

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && !!tokens,
    isLoading,
    error,
    challenge,
    requiresPasswordChange,
    signIn,
    setNewPassword,
    signOut,
    clearError,
    clearChallenge,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
