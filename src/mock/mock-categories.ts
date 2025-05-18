import { Category } from '@/types/budget';

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food',
    limit: 500,
    spent: 199.4,
    color: '#ef4444',
  },
  {
    id: '2',
    name: 'Transport',
    limit: 200,
    spent: 45.75,
    color: '#f59e0b',
  },
  {
    id: '3',
    name: 'Entertainment',
    limit: 150,
    spent: 35.0,
    color: '#10b981',
  },
  {
    id: '4',
    name: 'Utilities',
    limit: 300,
    spent: 150.2,
    color: '#3b82f6',
  },
  {
    id: '5',
    name: 'Education',
    limit: 200,
    spent: 199.99,
    color: '#8b5cf6',
  },
  {
    id: '6',
    name: 'Shopping',
    limit: 300,
    spent: 0,
    color: '#ec4899',
  },
];

export default mockCategories;
