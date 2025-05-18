import { Goal } from '@/types/budget';

const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 10000,
    current: 5000,
    targetDate: 'Dec 31, 2023',
    description: 'Save for unexpected expenses',
  },
  {
    id: '2',
    name: 'New Laptop',
    target: 2000,
    current: 1200,
    targetDate: 'Aug 15, 2023',
    description: 'Replace old laptop',
  },
  {
    id: '3',
    name: 'Vacation',
    target: 3000,
    current: 1500,
    targetDate: 'Jun 30, 2024',
    description: 'Summer vacation fund',
  },
];

export default mockGoals;
