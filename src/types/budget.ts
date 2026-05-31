export type CurrencyCode = 'EUR' | 'BGN' | 'USD' | 'GBP';

export interface ExchangeRateSnapshot {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  provider: string;
  capturedAt: string;
}

export type RecurringStatus =
  | 'scheduled'
  | 'due'
  | 'overdue'
  | 'skipped'
  | 'paid';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  originalAmount?: number;
  originalCurrency?: CurrencyCode;
  baseAmount?: number;
  baseCurrency?: CurrencyCode;
  displayAmount?: number;
  displayCurrency?: CurrencyCode;
  exchangeRateSnapshot?: ExchangeRateSnapshot;
  date: string;
  category: string;
  type: 'income' | 'expense';
  userId?: string;
  recurrenceId?: string;
  recurrenceInstanceDate?: string;
  recurrenceInstanceId?: string;
  materializedAt?: string;
  recurrenceGeneratedAt?: string;
  recurrenceStatus?: RecurringStatus;
}

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface RecurringRule {
  frequency: RecurringFrequency;
  interval?: number;
  startDate: string;
  endDate?: string;
  dayOfMonth?: number;
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  originalAmount?: number;
  originalCurrency?: CurrencyCode;
  baseAmount?: number;
  baseCurrency?: CurrencyCode;
  displayAmount?: number;
  displayCurrency?: CurrencyCode;
  exchangeRateSnapshot?: ExchangeRateSnapshot;
  category: string;
  type: 'income' | 'expense';
  rule: RecurringRule;
  nextOccurrence: string;
  lastGeneratedAt?: string;
  status?: 'active' | 'paused' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  currency?: CurrencyCode;
  baseCurrency?: CurrencyCode;
  monthlyData: {
    [month: string]: {
      limit: number;
      spent: number;
      currency?: CurrencyCode;
    };
  };
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  currency?: CurrencyCode;
  baseCurrency?: CurrencyCode;
  displayTarget?: number;
  displayCurrent?: number;
  exchangeRateSnapshot?: ExchangeRateSnapshot;
  targetDate: string;
  description: string;
}

export interface UserPreference {
  userId: string;
  preferredCurrency: CurrencyCode;
  timezone?: string;
  updatedAt: string;
  supportedCurrencies?: CurrencyCode[];
}
