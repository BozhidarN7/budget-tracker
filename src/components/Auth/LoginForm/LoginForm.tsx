'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';

interface LoginFormProps {
  onSuccess(): void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    signIn,
    error: authError,
    requiresPasswordChange,
    clearError,
  } = useAuth();

  // Clear errors when component mounts or when inputs change
  useEffect(() => {
    setError('');
    clearError();
  }, [username, password, clearError]);

  // Get user-friendly error message
  const getUserFriendlyError = (errorMessage: string): string => {
    if (
      errorMessage.includes('Invalid username or password') ||
      errorMessage.includes('NotAuthorizedException') ||
      errorMessage.includes('Incorrect username or password')
    ) {
      return 'The username or password you entered is incorrect. Please check your credentials and try again.';
    }

    if (
      errorMessage.includes('User not found') ||
      errorMessage.includes('UserNotFoundException')
    ) {
      return 'No account found with this username. Please check your username or contact your administrator.';
    }

    if (
      errorMessage.includes('Too many requests') ||
      errorMessage.includes('TooManyRequestsException')
    ) {
      return 'Too many sign-in attempts. Please wait a few minutes before trying again.';
    }

    if (
      errorMessage.includes('User is not confirmed') ||
      errorMessage.includes('UserNotConfirmedException')
    ) {
      return 'Your account needs to be confirmed. Please contact your administrator.';
    }

    if (
      errorMessage.includes('Password reset required') ||
      errorMessage.includes('PasswordResetRequiredException')
    ) {
      return 'Your password needs to be reset. Please contact your administrator.';
    }

    if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    // Default fallback for unknown errors
    return 'Sign in failed. Please try again or contact support if the problem persists.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signIn(username.trim(), password);
      if (!requiresPasswordChange) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(getUserFriendlyError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const displayError =
    error || (authError ? getUserFriendlyError(authError) : '');

  return (
    <Card className="w-full max-w-md border-0 bg-white/80 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-4 flex justify-center lg:hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue managing your budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="h-11"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 pr-10"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {displayError && (
            <Alert
              variant="destructive"
              className="animate-in slide-in-from-top-2 duration-300"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="h-11 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
