'use client';

import { useBudgetContext } from '@/contexts/budget-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatMonthKeyToReadable, getLastNMonthKeys } from '@/utils';

export default function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useBudgetContext();

  // Get the last 12 months for the dropdown
  const availableMonths = getLastNMonthKeys(12);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Month:</span>
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((month) => (
            <SelectItem key={month} value={month}>
              {formatMonthKeyToReadable(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
