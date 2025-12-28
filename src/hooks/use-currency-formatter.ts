'use client';

import { useCallback } from 'react';
import type { CurrencyCode } from '@/types/budget';
import formatCurrency, {
  FormatCurrencyOptions,
  getCurrencyDisplayMeta,
} from '@/utils/format-currency';
import { useCurrencyPreference } from '@/contexts/currency-context';

export default function useCurrencyFormatter() {
  const { preferredCurrency } = useCurrencyPreference();

  const format = useCallback(
    (amount: number, options: FormatCurrencyOptions = {}) => {
      const currency: CurrencyCode = options.currency ?? preferredCurrency;
      return formatCurrency(amount, { ...options, currency });
    },
    [preferredCurrency],
  );

  return {
    preferredCurrency,
    formatCurrency: format,
    getCurrencyMeta: getCurrencyDisplayMeta,
  };
}
