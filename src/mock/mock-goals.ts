import { format } from 'date-fns';
import { Goal } from '@/types/budget';
import { formatMonthKeyToReadable, getCurrentMonthKey } from '@/utils';

const currentMonthKey = getCurrentMonthKey();
const [currentYearStr, currentMonthStr] = currentMonthKey.split('-');
const currentYear = Number.parseInt(currentYearStr, 10);
const currentMonthIndex = Number.parseInt(currentMonthStr, 10);
const monthlyGoalTargetDate = format(
  new Date(currentYear, currentMonthIndex, 0),
  'MMM d, yyyy',
);

const mockGoals: Goal[] = [
  {
    id: `monthly-${currentMonthKey}`,
    name: `Monthly Savings Goal - ${formatMonthKeyToReadable(currentMonthKey)}`,
    target: 1500,
    current: 600,
    currency: 'EUR',
    baseCurrency: 'EUR',
    displayTarget: 1500,
    displayCurrent: 600,
    targetDate: monthlyGoalTargetDate,
    description: 'Demo monthly savings benchmark',
  },
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
