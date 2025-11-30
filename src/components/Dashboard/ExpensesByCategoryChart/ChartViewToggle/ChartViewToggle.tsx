'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ChartViewToggleOption {
  value: string;
  label: string;
}

interface ChartViewToggleProps {
  value: string;
  options: ChartViewToggleOption[];
  onValueChange: (value: string) => void;
  ariaLabel?: string;
}

export default function ChartViewToggle({
  value,
  options,
  onValueChange,
  ariaLabel = 'Chart view mode',
}: ChartViewToggleProps) {
  const columnsClass = getColumnsClass(options.length);

  return (
    <Tabs value={value} onValueChange={onValueChange} aria-label={ariaLabel}>
      <TabsList className={`grid w-full ${columnsClass}`}>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function getColumnsClass(optionCount: number): string {
  if (optionCount <= 1) {
    return 'grid-cols-1';
  }

  if (optionCount === 2) {
    return 'grid-cols-2';
  }

  if (optionCount === 3) {
    return 'grid-cols-3';
  }

  if (optionCount === 4) {
    return 'grid-cols-4';
  }

  return `grid-cols-${Math.min(optionCount, 4)}`;
}
