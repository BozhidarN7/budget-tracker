type CurrencyCode = 'bgn' | 'usd' | 'eur' | 'gbp' | 'jpy' | 'cad';

type CurrencySymbol = {
  code: CurrencyCode;
  symbol: string;
  position: 'before' | 'after';
};

const currencySymbols: Record<CurrencyCode, CurrencySymbol> = {
  bgn: { code: 'bgn', symbol: 'лв', position: 'after' },
  usd: { code: 'usd', symbol: '$', position: 'before' },
  eur: { code: 'eur', symbol: '€', position: 'before' },
  gbp: { code: 'gbp', symbol: '£', position: 'before' },
  jpy: { code: 'jpy', symbol: '¥', position: 'before' },
  cad: { code: 'cad', symbol: '$', position: 'before' },
};

/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currencyCode The currency code (defaults to BGN)
 * @param options Formatting options
 * @returns Formatted currency string
 */
export default function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'bgn',
  options: { decimals?: number; showSymbol?: boolean } = {},
): string {
  const { decimals = 2, showSymbol = true } = options;
  const currency = currencySymbols[currencyCode] || currencySymbols.bgn;
  const formattedAmount = amount.toFixed(decimals);

  if (!showSymbol) {
    return formattedAmount;
  }

  return currency.position === 'before'
    ? `${currency.symbol}${formattedAmount}`
    : `${formattedAmount} ${currency.symbol}`;
}
