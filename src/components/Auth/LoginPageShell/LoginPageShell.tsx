'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import LoginForm from '@/components/Auth/LoginForm';
import LoginRecoveryState from '@/components/Auth/LoginRecoveryState';
import PasswordChangeForm from '@/components/Auth/PasswordChangeForm';
import LoginHero from '@/components/Auth/LoginHero';

export default function LoginPageShell() {
  const {
    isAuthenticated,
    isRecoveringSession,
    requiresPasswordChange,
    challenge,
    clearChallenge,
  } = useAuth();
  const router = useRouter();
  const shouldShowRecoveryState = isRecoveringSession || isAuthenticated;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    toast.success('Welcome back!');
    router.replace('/');
  };

  const handlePasswordChangeSuccess = () => {
    toast.success('Password updated successfully! Welcome to Budget Tracker!');
    router.replace('/');
  };

  const handleBackToLogin = () => {
    clearChallenge();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-cyan-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

      <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left Side - Branding */}
        <LoginHero />

        {/* Right Side - Forms */}
        <div className="flex items-center justify-center">
          {shouldShowRecoveryState ? (
            <LoginRecoveryState />
          ) : requiresPasswordChange && challenge ? (
            <PasswordChangeForm
              onSuccess={handlePasswordChangeSuccess}
              onBack={handleBackToLogin}
            />
          ) : (
            <LoginForm onSuccess={handleLoginSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
