'use client';

import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { CurrencyCode, UserPreference } from '@/types/budget';
import {
  createUserPreference,
  fetchUserPreference,
  updateUserPreference,
} from '@/api/budget-tracker-api/users';

const DEFAULT_SUPPORTED: CurrencyCode[] = ['EUR', 'BGN', 'USD', 'GBP'];
const DEFAULT_CURRENCY: CurrencyCode = 'EUR';

type CurrencyContextValue = {
  preferredCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
  preference: UserPreference | null;
  isSaving: boolean;
  refreshPreference: () => Promise<UserPreference | null>;
  updatePreferredCurrency: (
    currency: CurrencyCode,
  ) => Promise<UserPreference | null>;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);

interface CurrencyProviderProps {
  initialPreference?: UserPreference | null;
  children: React.ReactNode;
}

export default function CurrencyProvider({
  initialPreference = null,
  children,
}: CurrencyProviderProps) {
  const [preference, setPreference] = useState<UserPreference | null>(
    initialPreference,
  );
  const [isSaving, setIsSaving] = useState(false);

  const supportedCurrencies = preference?.supportedCurrencies?.length
    ? preference.supportedCurrencies
    : DEFAULT_SUPPORTED;

  const preferredCurrency = preference?.preferredCurrency ?? DEFAULT_CURRENCY;
  console.log('budget:preferredCurrency', preferredCurrency);

  const refreshPreference = useCallback(async () => {
    try {
      const latest = await fetchUserPreference();
      if (latest) {
        setPreference(latest);
      }
      return latest;
    } catch (error) {
      console.error('Failed to refresh user preference:', error);
      return null;
    }
  }, []);

  const updatePreferredCurrency = useCallback(
    async (currency: CurrencyCode) => {
      setIsSaving(true);
      try {
        const mutate = preference ? updateUserPreference : createUserPreference;
        const updated = await mutate({ preferredCurrency: currency });
        setPreference(updated);
        return updated;
      } catch (error) {
        console.error('Failed to update preferred currency:', error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [preference],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      preferredCurrency,
      supportedCurrencies,
      preference,
      isSaving,
      refreshPreference,
      updatePreferredCurrency,
    }),
    [
      preferredCurrency,
      supportedCurrencies,
      preference,
      isSaving,
      refreshPreference,
      updatePreferredCurrency,
    ],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__BT_PREFERRED_CURRENCY__ = preferredCurrency;
    }

    if (typeof globalThis !== 'undefined') {
      (
        globalThis as unknown as { __BT_PREFERRED_CURRENCY__?: CurrencyCode }
      ).__BT_PREFERRED_CURRENCY__ = preferredCurrency;
    }
  }, [preferredCurrency]);

  return <CurrencyContext value={value}>{children}</CurrencyContext>;
}

export function useCurrencyPreference() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error(
      'useCurrencyPreference must be used within CurrencyProvider',
    );
  }

  return context;
}
