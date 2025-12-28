import type { CurrencyCode } from '@/types/budget';

type CurrencyDisplay = {
  code: CurrencyCode;
  symbol: string;
  position: 'before' | 'after';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
};

const CURRENCY_DISPLAY_MAP: Record<CurrencyCode, CurrencyDisplay> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    position: 'before',
    locale: 'de-DE',
  },
  BGN: {
    code: 'BGN',
    symbol: 'лв',
    position: 'after',
    locale: 'bg-BG',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    position: 'before',
    locale: 'en-US',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    position: 'before',
    locale: 'en-GB',
  },
};

export type FormatCurrencyOptions = {
  currency?: CurrencyCode;
  showSymbol?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function getCurrencyDisplayMeta(
  currency: CurrencyCode = 'EUR',
): CurrencyDisplay {
  return CURRENCY_DISPLAY_MAP[currency] ?? CURRENCY_DISPLAY_MAP.EUR;
}

function getPreferredCurrencyFallback(): CurrencyCode | undefined {
  if (typeof window !== 'undefined' && window.__BT_PREFERRED_CURRENCY__) {
    return window.__BT_PREFERRED_CURRENCY__;
  }

  if (typeof globalThis !== 'undefined') {
    const globalCurrency = (
      globalThis as unknown as { __BT_PREFERRED_CURRENCY__?: CurrencyCode }
    ).__BT_PREFERRED_CURRENCY__;
    if (globalCurrency) {
      return globalCurrency;
    }
  }

  return undefined;
}

export default function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {},
): string {
  const {
    currency,
    showSymbol = true,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;

  const resolvedCurrency = currency ?? getPreferredCurrencyFallback() ?? 'EUR';

  const meta = getCurrencyDisplayMeta(resolvedCurrency);
  const formatter = new Intl.NumberFormat(meta.locale ?? 'en-US', {
    minimumFractionDigits:
      minimumFractionDigits ?? meta.minimumFractionDigits ?? 2,
    maximumFractionDigits:
      maximumFractionDigits ?? meta.maximumFractionDigits ?? 2,
  });

  const formattedAmount = formatter.format(amount);

  if (!showSymbol) {
    return formattedAmount;
  }

  return meta.position === 'before'
    ? `${meta.symbol}${formattedAmount}`
    : `${formattedAmount} ${meta.symbol}`;
}

declare global {
  interface Window {
    __BT_PREFERRED_CURRENCY__?: CurrencyCode;
  }
}
