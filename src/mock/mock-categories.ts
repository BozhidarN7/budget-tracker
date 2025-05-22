import { Category } from '@/types/budget';
import { formatMonthKey, getCurrentMonthKey } from '@/utils';

const currentMonthKey = getCurrentMonthKey();
const prevMonthKey = formatMonthKey(
  new Date(new Date().setMonth(new Date().getMonth() - 1)),
);

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food',
    color: '#ef4444',
    type: 'expense',
    monthlyData: {
      [currentMonthKey]: { limit: 500, spent: 199.4 },
      [prevMonthKey]: { limit: 500, spent: 450.75 },
    },
  },
  {
    id: '2',
    name: 'Transport',
    color: '#f59e0b',
    type: 'expense',
    monthlyData: {
      [currentMonthKey]: { limit: 200, spent: 45.75 },
      [prevMonthKey]: { limit: 200, spent: 180.25 },
    },
  },
  {
    id: '3',
    name: 'Salary',
    color: '#10b981',
    type: 'income',
    monthlyData: {
      [currentMonthKey]: { limit: 0, spent: 3500 },
      [prevMonthKey]: { limit: 0, spent: 3500 },
    },
  },
  {
    id: '4',
    name: 'Freelance',
    color: '#3b82f6',
    type: 'income',
    monthlyData: {
      [currentMonthKey]: { limit: 0, spent: 1200 },
      [prevMonthKey]: { limit: 0, spent: 800 },
    },
  },
  {
    id: '5',
    name: 'Education',
    color: '#8b5cf6',
    type: 'expense',
    monthlyData: {
      [currentMonthKey]: { limit: 0, spent: 200 },
      [prevMonthKey]: { limit: 0, spent: 300 },
    },
  },
  {
    id: '6',
    name: 'Shopping',
    color: '#ec4899',
    type: 'expense',
    monthlyData: {
      [currentMonthKey]: { limit: 400, spent: 200 },
      [prevMonthKey]: { limit: 400, spent: 300 },
    },
  },
];

export default mockCategories;
