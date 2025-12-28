import { Category } from '@/types/budget';
import { formatMonthKey, getCurrentMonthKey } from '@/utils';

const currentMonthKey = getCurrentMonthKey();
const prevMonthKey = formatMonthKey(
  new Date(new Date().setMonth(new Date().getMonth() - 1)),
);

const createMonthlyData = (
  limit: number,
  spent: number,
  currency: Category['currency'] = 'BGN',
) => ({
  limit,
  spent,
  baseLimit: limit,
  baseSpent: spent,
  currency,
});

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food',
    color: '#ef4444',
    type: 'expense',
    currency: 'BGN',
    baseCurrency: 'EUR',
    monthlyData: {
      [currentMonthKey]: createMonthlyData(500, 199.4),
      [prevMonthKey]: createMonthlyData(500, 450.75),
    },
  },
  {
    id: '2',
    name: 'Transport',
    color: '#f59e0b',
    type: 'expense',
    currency: 'BGN',
    baseCurrency: 'EUR',
    monthlyData: {
      [currentMonthKey]: createMonthlyData(200, 45.75),
      [prevMonthKey]: createMonthlyData(200, 180.25),
    },
  },
  {
    id: '3',
    name: 'Salary',
    color: '#10b981',
    type: 'income',
    currency: 'BGN',
    baseCurrency: 'EUR',
    monthlyData: {
      [currentMonthKey]: createMonthlyData(0, 3500),
      [prevMonthKey]: createMonthlyData(0, 3500),
    },
  },
  {
    id: '4',
    name: 'Freelance',
    color: '#3b82f6',
    type: 'income',
    currency: 'BGN',
    baseCurrency: 'EUR',
    monthlyData: {
      [currentMonthKey]: createMonthlyData(0, 1200),
      [prevMonthKey]: createMonthlyData(0, 800),
    },
  },
  {
    id: '5',
    name: 'Education',
    color: '#8b5cf6',
    type: 'expense',
    currency: 'BGN',
    baseCurrency: 'EUR',
    monthlyData: {
      [currentMonthKey]: createMonthlyData(0, 200),
      [prevMonthKey]: createMonthlyData(0, 300),
    },
  },
  {
    id: '6',
    name: 'Shopping',
    color: '#ec4899',
    type: 'expense',
    currency: 'BGN',
    baseCurrency: 'EUR',
    monthlyData: {
      [currentMonthKey]: createMonthlyData(400, 200),
      [prevMonthKey]: createMonthlyData(400, 300),
    },
  },
];

export default mockCategories;
