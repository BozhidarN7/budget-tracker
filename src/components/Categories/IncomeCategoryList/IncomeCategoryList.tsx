'use client';

import CategoryCard from '../CategoryCard';
import type { Category } from '@/types/budget';

interface IncomeCategoryListProps {
  categories: Category[];
  selectedMonth: string;
}

export default function IncomeCategoryList({
  categories,
  selectedMonth,
}: IncomeCategoryListProps) {
  const incomeCategories = categories.filter(
    (category) => category.type === 'income',
  );

  if (incomeCategories.length === 0) {
    return (
      <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground">No income categories yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Create your first income category to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {incomeCategories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          selectedMonth={selectedMonth}
        />
      ))}
    </div>
  );
}
