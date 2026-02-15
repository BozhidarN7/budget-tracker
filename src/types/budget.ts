export type CurrencyCode = 'EUR' | 'BGN' | 'USD' | 'GBP';

export interface ExchangeRateSnapshot {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  provider: string;
  capturedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  baseAmount?: number;
  baseCurrency?: CurrencyCode;
  originalAmount?: number;
  originalCurrency?: CurrencyCode;
  displayAmount?: number;
  displayCurrency?: CurrencyCode;
  exchangeRateSnapshot?: ExchangeRateSnapshot;
  date: string;
  category: string;
  type: 'income' | 'expense';
  recurrenceId?: string;
  recurrenceInstanceId?: string;
  recurrenceStatus?: 'scheduled' | 'due' | 'overdue' | 'skipped' | 'paid';
  recurrenceGeneratedAt?: string;
}

export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
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
  category: string;
  type: 'income' | 'expense';
  rule: RecurrenceRule;
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
  updatedAt: string;
  supportedCurrencies?: CurrencyCode[];
}
