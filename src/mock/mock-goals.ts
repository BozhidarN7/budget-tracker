import { Goal } from '@/types/budget';

const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 10000,
    current: 5000,
    currency: 'BGN',
    baseCurrency: 'EUR',
    displayTarget: 10000,
    displayCurrent: 5000,
    exchangeRateSnapshot: {
      fromCurrency: 'EUR',
      toCurrency: 'BGN',
      rate: 1.95,
      provider: 'MockFX',
      capturedAt: '2025-01-01T00:00:00.000Z',
    },
    targetDate: 'Dec 31, 2023',
    description: 'Save for unexpected expenses',
  },
  {
    id: '2',
    name: 'New Laptop',
    target: 2000,
    current: 1200,
    currency: 'BGN',
    baseCurrency: 'EUR',
    displayTarget: 2000,
    displayCurrent: 1200,
    exchangeRateSnapshot: {
      fromCurrency: 'EUR',
      toCurrency: 'BGN',
      rate: 1.95,
      provider: 'MockFX',
      capturedAt: '2025-01-01T00:00:00.000Z',
    },
    targetDate: 'Aug 15, 2023',
    description: 'Replace old laptop',
  },
  {
    id: '3',
    name: 'Vacation',
    target: 3000,
    current: 1500,
    currency: 'BGN',
    baseCurrency: 'EUR',
    displayTarget: 3000,
    displayCurrent: 1500,
    exchangeRateSnapshot: {
      fromCurrency: 'EUR',
      toCurrency: 'BGN',
      rate: 1.95,
      provider: 'MockFX',
      capturedAt: '2025-01-01T00:00:00.000Z',
    },
    targetDate: 'Jun 30, 2024',
    description: 'Summer vacation fund',
  },
];

export default mockGoals;
