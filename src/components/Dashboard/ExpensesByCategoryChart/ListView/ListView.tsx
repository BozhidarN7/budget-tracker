'use client';

import { CategoryLegendItem } from '@/hooks/use-category-chart-controller';
import { formatCurrency, formatPercentage } from '@/utils';

interface ListViewProps {
  items: CategoryLegendItem[];
  emptyText?: string;
}

export default function ListView({
  items,
  emptyText = 'No data available.',
}: ListViewProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyText}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-sm leading-none font-medium">{item.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                {formatCurrency(item.value)}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatPercentage(item.percentage)}
              </p>
            </div>
          </div>
          <div className="bg-muted/60 h-2 w-full rounded-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(item.percentage * 100, 100)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
