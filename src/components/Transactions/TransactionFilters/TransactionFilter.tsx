'use client';

import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useBudgetData } from '@/hooks';
import type { TransactionFilters as TransactionFiltersType } from '@/hooks/use-transaction-filteres';

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  onFilterChange(key: keyof TransactionFiltersType, value: unknown): void;
  onClearFilters(): void;
}

export default function TransactionFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: TransactionFiltersProps) {
  const { categories } = useBudgetData();

  // Get unique categories from all transactions
  const allCategories = Array.from(new Set(categories.map((cat) => cat.name)));

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="search"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange('type', value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'flex-1 justify-start text-left font-normal',
                    !filters.dateFrom && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom
                    ? format(filters.dateFrom, 'MMM dd')
                    : 'From'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => onFilterChange('dateFrom', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'flex-1 justify-start text-left font-normal',
                    !filters.dateTo && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, 'MMM dd') : 'To'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => onFilterChange('dateTo', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <div className="bg-primary/10 flex items-center gap-1 rounded-md px-2 py-1 text-xs">
              <span>Search: &quot;{filters.search}&quot;</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onFilterChange('search', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.category !== 'all' && (
            <div className="bg-primary/10 flex items-center gap-1 rounded-md px-2 py-1 text-xs">
              <span>Category: {filters.category}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onFilterChange('category', 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.type !== 'all' && (
            <div className="bg-primary/10 flex items-center gap-1 rounded-md px-2 py-1 text-xs">
              <span>Type: {filters.type}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onFilterChange('type', 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.dateFrom && (
            <div className="bg-primary/10 flex items-center gap-1 rounded-md px-2 py-1 text-xs">
              <span>From: {format(filters.dateFrom, 'MMM dd')}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onFilterChange('dateFrom', undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.dateTo && (
            <div className="bg-primary/10 flex items-center gap-1 rounded-md px-2 py-1 text-xs">
              <span>To: {format(filters.dateTo, 'MMM dd')}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onFilterChange('dateTo', undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
