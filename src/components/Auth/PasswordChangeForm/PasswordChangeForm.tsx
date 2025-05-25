'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from 'lucide-react';
import {
  getPasswordStrength,
  getUserFriendlyPasswordError,
  validatePassword,
} from './utils';
import { useAuth } from '@/contexts/auth-context';
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
import { cn } from '@/lib/utils';

interface PasswordChangeFormProps {
  onSuccess(): void;
  onBack(): void;
}

export default function PasswordChangeForm({
  onSuccess,
  onBack,
}: PasswordChangeFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    setNewPassword: setNewPasswordChallenge,
    challenge,
    error: authError,
    clearError,
  } = useAuth();

  // Clear errors when component mounts or when inputs change
  useEffect(() => {
    setError('');
    clearError();
  }, [newPassword, confirmPassword, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        'Passwords do not match. Please make sure both passwords are identical.',
      );
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation) {
      setError(passwordValidation);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await setNewPasswordChallenge(newPassword);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Password change failed';
      setError(getUserFriendlyPasswordError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const displayError =
    error || (authError ? getUserFriendlyPasswordError(authError) : '');
  const passwordStrength = newPassword
    ? getPasswordStrength(newPassword)
    : null;

  return (
    <Card className="w-full max-w-md border-0 bg-white/80 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
        <CardDescription>
          Welcome {challenge?.username}! Please set a new password to continue.
          This is required for new accounts created by administrators.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 pr-10"
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>

            {/* Password strength indicator */}
            {newPassword && passwordStrength && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Password strength:
                  </span>
                  <span
                    className={cn(
                      'font-medium capitalize',
                      passwordStrength.color,
                    )}
                  >
                    {passwordStrength.level}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      passwordStrength.bg,
                    )}
                    style={{
                      width: `${
                        getPasswordStrength(newPassword).level === 'weak'
                          ? 20
                          : getPasswordStrength(newPassword).level === 'fair'
                            ? 40
                            : getPasswordStrength(newPassword).level === 'good'
                              ? 70
                              : 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={cn(
                  'h-11 pr-10',
                  confirmPassword &&
                    newPassword === confirmPassword &&
                    'border-green-300 focus:border-green-500',
                )}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>

              {/* Password match indicator */}
              {confirmPassword && (
                <div className="absolute top-1/2 right-10 -translate-y-1/2 transform">
                  {newPassword === confirmPassword ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-muted-foreground text-sm">
            <p className="mb-2 font-medium">Password requirements:</p>
            <ul className="list-inside list-disc space-y-1">
              <li
                className={cn(newPassword.length >= 8 ? 'text-green-600' : '')}
              >
                At least 8 characters long
              </li>
              <li
                className={cn(
                  /[A-Z]/.test(newPassword) ? 'text-green-600' : '',
                )}
              >
                Include uppercase and lowercase letters
              </li>
              <li
                className={cn(/\d/.test(newPassword) ? 'text-green-600' : '')}
              >
                Include at least one number
              </li>
              <li
                className={cn(
                  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)
                    ? 'text-green-600'
                    : '',
                )}
              >
                Include at least one special character (!@#$%^&*)
              </li>
            </ul>
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

          <div className="space-y-2">
            <Button
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Password...
                </>
              ) : (
                'Set New Password'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={onBack}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
