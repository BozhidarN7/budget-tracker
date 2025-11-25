'use client';

import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/auth';

interface UseBackgroundTokenRefreshProps {
  user: User | null;
  refreshTokens: () => Promise<boolean>;
}

/**
 * Hook for automatic background token refresh
 * Runs every 50 minutes when user is authenticated
 */
export default function useBackgroundTokenRefresh({
  user,
  refreshTokens,
}: UseBackgroundTokenRefreshProps) {
  return useQuery({
    queryKey: ['auth', 'background-refresh'],
    queryFn: async () => {
      if (user) {
        await refreshTokens();
      }
      return null;
    },
    enabled: !!user, // Only run when authenticated
    refetchInterval: 1000 * 60 * 50, // 50 minutes
    refetchIntervalInBackground: false,
    retry: false,
    staleTime: Infinity,
  });
}
