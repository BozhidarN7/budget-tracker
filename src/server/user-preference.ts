import { API_BASE_URL } from '@/constants/api';
import { CACHE_TAGS } from '@/constants';
import { getTokensFromCookies } from '@/server/auth';
import type { UserPreference } from '@/types/budget';

export async function getUserPreference(): Promise<UserPreference | null> {
  try {
    const tokens = await getTokensFromCookies();
    if (!tokens?.idToken) {
      return null;
    }

    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.idToken}`,
      },
      cache: 'force-cache',
      next: { tags: [CACHE_TAGS.user.preference] },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as UserPreference;
  } catch (error) {
    console.error('Failed to fetch user preference:', error);
    return null;
  }
}
