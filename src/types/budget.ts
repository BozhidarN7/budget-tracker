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
  color: string;
  type: 'income' | 'expense';
  monthlyData: {
    [month: string]: {
      limit: number;
      spent: number;
    };
  }; // e.g., { "2025-05": { limit: 200, spent: 120 } }
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  targetDate: string;
  description: string;
}
