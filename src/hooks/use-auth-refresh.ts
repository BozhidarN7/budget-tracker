'use client';

import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/auth';

interface UseAuthRefreshProps {
  user: User | null;
  refreshTokens: () => Promise<boolean>;
}

/**
 * Hook for manual token refresh trigger
 * Used when initialUser is null and we want to attempt token refresh
 */
export default function useAuthRefresh({
  user,
  refreshTokens,
}: UseAuthRefreshProps) {
  return useQuery({
    queryKey: ['auth', 'refresh'],
    queryFn: async () => {
      // Only attempt refresh if we don't have a user but might have refresh tokens
      if (!user) {
        const refreshed = await refreshTokens();
        return refreshed;
      }
      return true; // Already authenticated
    },
    enabled: false, // We'll trigger manually
    retry: false,
    staleTime: Infinity,
  });
}
