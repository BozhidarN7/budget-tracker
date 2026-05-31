'use client';

import { Loader2, Shield } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginRecoveryState() {
  return (
    <Card className="w-full max-w-md border-0 bg-white/80 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-4 flex justify-center lg:hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="mb-4 hidden justify-center lg:flex">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Secure session</CardTitle>
        <CardDescription>Restoring your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <div className="absolute h-12 w-12 animate-pulse rounded-full border-2 border-blue-200/60 dark:border-blue-800/60" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We are checking your saved session so you can continue without
              signing in again.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              This usually takes a moment.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
