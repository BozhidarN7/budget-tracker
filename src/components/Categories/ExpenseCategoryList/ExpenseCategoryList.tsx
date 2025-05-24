'use client';

import CategoryCard from '../CategoryCard';
import type { Category } from '@/types/budget';

interface ExpenseCategoryListProps {
  categories: Category[];
  selectedMonth: string;
}

export default function ExpenseCategoryList({
  categories,
  selectedMonth,
}: ExpenseCategoryListProps) {
  const expenseCategories = categories.filter(
    (category) => category.type === 'expense' || !category.type,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {expenseCategories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          selectedMonth={selectedMonth}
        />
      ))}
    </div>
  );
}
