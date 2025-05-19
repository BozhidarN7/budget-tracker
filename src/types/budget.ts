export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  type: 'income' | 'expense';
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  targetDate: string;
  description: string;
}
