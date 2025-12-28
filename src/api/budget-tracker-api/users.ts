import type { CurrencyCode, UserPreference } from '@/types/budget';

type PreferencePayload = {
  preferredCurrency: CurrencyCode;
};

export async function fetchUserPreference(): Promise<UserPreference | null> {
  try {
    const res = await fetch('/api/users', { method: 'GET' });

    if (!res.ok) {
      console.error('Error fetching user preference:', await res.text());
      return null;
    }

    return (await res.json()) as UserPreference;
  } catch (error) {
    console.error('Error fetching user preference:', error);
    return null;
  }
}

export async function createUserPreference(
  payload: PreferencePayload,
): Promise<UserPreference> {
  return mutatePreference('POST', payload);
}

export async function updateUserPreference(
  payload: PreferencePayload,
): Promise<UserPreference> {
  return mutatePreference('PUT', payload);
}

async function mutatePreference(
  method: 'POST' | 'PUT',
  payload: PreferencePayload,
): Promise<UserPreference> {
  try {
    const res = await fetch('/api/users', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Error saving user preference: ${res.statusText}`);
    }

    return (await res.json()) as UserPreference;
  } catch (error) {
    console.error('Error saving user preference:', error);
    throw error;
  }
}
