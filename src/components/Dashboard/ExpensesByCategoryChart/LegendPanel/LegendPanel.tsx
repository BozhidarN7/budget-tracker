'use client';

import { useMemo } from 'react';
import { useCurrencyFormatter } from '@/hooks/';
import { CategoryLegendItem } from '@/hooks/use-category-chart-controller';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPercentage } from '@/utils';

interface LegendPanelProps {
  items: CategoryLegendItem[];
  totalItems: number;
  activeItems: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggle: (name: string) => void;
  onOpenDetails: () => void;
  emptyText?: string;
}

export default function LegendPanel({
  items,
  totalItems,
  activeItems,
  searchQuery,
  onSearchChange,
  onToggle,
  onOpenDetails,
  emptyText = 'No categories match your search.',
}: LegendPanelProps) {
  const { formatCurrency } = useCurrencyFormatter();
  const summaryLabel = useMemo(() => {
    if (totalItems === 0) {
      return 'No categories available';
    }

    if (activeItems === totalItems) {
      return 'All categories visible';
    }

    return `${activeItems} of ${totalItems} categories shown`;
  }, [totalItems, activeItems]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Categories</p>
            <p className="text-muted-foreground text-xs">{summaryLabel}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onOpenDetails}>
            View all
          </Button>
        </div>
      </div>

      <Input
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search categories"
      />

      <div className="border-border/60 divide-border/80 flex-1 divide-y overflow-hidden rounded-lg border">
        <div className="bg-muted/40 text-muted-foreground px-3 py-2 text-xs font-medium tracking-wide uppercase">
          Legend
        </div>
        <div className="max-h-80 space-y-0 overflow-y-auto px-2 py-2">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm">{emptyText}</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <LegendPanelItem
                  key={item.name}
                  item={item}
                  onToggle={onToggle}
                  formatCurrency={formatCurrency}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

interface LegendPanelItemProps {
  item: CategoryLegendItem;
  onToggle: (name: string) => void;
  formatCurrency: (value: number) => string;
}

function LegendPanelItem({
  item,
  onToggle,
  formatCurrency,
}: LegendPanelItemProps) {
  const handleToggle = () => {
    onToggle(item.name);
  };

  return (
    <li>
      <button
        type="button"
        onClick={handleToggle}
        className={`hover:bg-muted/60 group focus-visible:ring-ring flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition focus-visible:ring-2 focus-visible:outline-hidden ${item.isActive ? 'opacity-100' : 'opacity-50'}`}
      >
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div>
            <p className="text-sm leading-none font-medium">{item.name}</p>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(item.value)} · {formatPercentage(item.percentage)}
            </p>
          </div>
        </div>
        <span className="text-muted-foreground text-xs font-semibold">
          #{item.rank}
        </span>
      </button>
    </li>
  );
}
