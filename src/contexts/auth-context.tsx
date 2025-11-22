'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { type AuthChallenge, type SignInResult, type User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
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
  initialUser?: User | null;
}

export default function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<AuthChallenge | null>(null);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

  const signIn = async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as
        | (SignInResult & { error?: string })
        | { error?: string };

      if (!response.ok) {
        const message = data.error || 'Sign in failed';
        setError(message);
        throw new Error(message);
      }

      if ('challenge' in data && data.challenge) {
        setChallenge(data.challenge);
        setRequiresPasswordChange(data.requiresPasswordChange || false);
        return;
      }

      if ('user' in data && data.user) {
        setUser(data.user);
        setChallenge(null);
        setRequiresPasswordChange(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
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

      const response = await fetch('/api/auth/new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: challenge.username,
          newPassword,
          session: challenge.session,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        user?: User;
        error?: string;
      };

      if (!response.ok || !data.user) {
        const message = data.error || 'Password change failed';
        setError(message);
        throw new Error(message);
      }

      setUser(data.user);
      setChallenge(null);
      setRequiresPasswordChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Password change failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      const data = (await response.json().catch(() => ({}))) as {
        user?: User;
        error?: string;
      };

      if (!response.ok || !data.user) {
        signOut();
        return false;
      }

      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      signOut();
      return false;
    }
  };

  const signOut = useCallback(() => {
    // Fire-and-forget logout request to clear HttpOnly cookies
    fetch('/api/auth/logout', {
      method: 'POST',
    }).catch((error) => {
      console.error('Logout error:', error);
    });

    setUser(null);
    setError(null);
    setChallenge(null);
    setRequiresPasswordChange(false);

    router.push('/login');
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearChallenge = useCallback(() => {
    setChallenge(null);
    setRequiresPasswordChange(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
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

  return <AuthContext value={value}>{children}</AuthContext>;
}
