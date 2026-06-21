'use client';

import { CalendarRange } from 'lucide-react';
import { ViewTransition, useMemo, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import ChartSkeleton from '../ChartSkeleton';
import ChartViewToggle, { type ChartViewToggleOption } from './ChartViewToggle';
import DetailsDialog from './DetailsDialog';
import LegendPanel from './LegendPanel';
import ListView from './ListView';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetContext } from '@/contexts/budget-context';
import { useBudgetData, useCurrencyFormatter } from '@/hooks/';
import useCategoryChartController, {
  CategoryChartSlice,
} from '@/hooks/use-category-chart-controller';
import {
  formatMonthKeyToReadable,
  formatPercentage,
  getLastNMonthKeys,
} from '@/utils';
import {
  EXPENSES_BY_CATEGORY_CHART,
  EXPENSES_BY_CATEGORY_LEGENG,
  EXPENSES_BY_CATEGORY_TITLE,
} from '@/constants';

const VIEW_OPTIONS: ChartViewToggleOption[] = [
  { value: 'pie', label: 'Chart' },
  { value: 'list', label: 'List' },
];

type ViewMode = (typeof VIEW_OPTIONS)[number]['value'];

type PieChartDatum = CategoryChartSlice & Record<string, unknown>;

export default function ExpensesByCategoryChart() {
  const { ensureMonthTransactionsLoaded, setSelectedMonth } =
    useBudgetContext();
  const { expensesByCategory, isLoading, selectedMonth } = useBudgetData();
  const { formatCurrency } = useCurrencyFormatter();
  const controller = useCategoryChartController(expensesByCategory, {
    primaryCount: 7,
    overflowLabel: 'Other categories',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('pie');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showAllSlices, setShowAllSlices] = useState(false);

  const availableMonths = useMemo(() => {
    return getLastNMonthKeys(12);
  }, []);

  const activeLegendCount = useMemo(() => {
    return controller.legendItems.filter((item) => item.isActive === true)
      .length;
  }, [controller.legendItems]);

  const readableMonth = formatMonthKeyToReadable(selectedMonth);

  const hasOverflowSlice = controller.displaySeries.some(
    (slice) => slice.isOther === true,
  );

  const pieChartData = useMemo<PieChartDatum[]>(() => {
    if (showAllSlices === true) {
      return controller.visibleSeries.map((slice) => ({
        ...slice,
        percentage:
          controller.totalValue === 0 ? 0 : slice.value / controller.totalValue,
      }));
    }

    return controller.displaySeries.map((slice) => ({ ...slice }));
  }, [
    controller.displaySeries,
    controller.visibleSeries,
    controller.totalValue,
    showAllSlices,
  ]);

  if (isLoading) {
    return <ChartSkeleton title="Expenses by Category" />;
  }

  const handleViewModeChange = (nextValue: string) => {
    setViewMode(nextValue as ViewMode);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    void ensureMonthTransactionsLoaded(month);
  };

  const headerActions = (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between xl:justify-end">
      <div className="bg-muted/50 border-border/60 inline-flex h-11 items-center gap-3 rounded-xl border px-3 shadow-sm backdrop-blur-sm">
        <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-lg">
          <CalendarRange className="h-4 w-4" aria-hidden="true" />
        </div>
        <label htmlFor="expenses-by-category-month" className="sr-only">
          Select month for expenses by category chart
        </label>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger
            id="expenses-by-category-month"
            size="sm"
            className="h-auto min-w-[140px] border-0 bg-transparent px-0 py-0 text-sm font-semibold shadow-none focus-visible:ring-0"
            aria-label="Select month for expenses by category chart"
          >
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

      <div className="bg-background/80 border-border/60 inline-flex h-11 items-center rounded-xl border px-3 text-sm font-medium shadow-sm">
        Visible total · {formatCurrency(controller.totalValue)}
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <ViewTransition name={EXPENSES_BY_CATEGORY_TITLE}>
              <div className="space-y-2">
                <CardTitle className="text-base font-semibold">
                  Expenses by category
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {readableMonth} · {controller.legendItems.length} categories
                  tracked
                </p>
              </div>
            </ViewTransition>

            {headerActions}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <ChartViewToggle
              value={viewMode}
              options={VIEW_OPTIONS}
              onValueChange={handleViewModeChange}
            />

            {viewMode === 'pie' ? (
              <button
                type="button"
                onClick={() => setShowAllSlices((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground w-fit text-sm font-medium underline-offset-4 hover:underline"
              >
                {showAllSlices === true
                  ? 'Show summarized slices'
                  : 'Show every slice'}
              </button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {controller.hasData === false ? (
            <div className="border-border/70 bg-muted/20 flex min-h-112 items-center justify-center rounded-2xl border border-dashed px-6 text-center">
              <div className="max-w-sm space-y-2">
                <p className="text-sm font-semibold">
                  No expenses for {readableMonth}
                </p>
                <p className="text-muted-foreground text-sm">
                  Select another month or add expenses to your categories to
                  unlock this chart view.
                </p>
              </div>
            </div>
          ) : (
            <div className="gap-8 lg:grid lg:min-h-128 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-4">
                {viewMode === 'pie' ? (
                  <ViewTransition name={EXPENSES_BY_CATEGORY_CHART}>
                    <div className="h-80 w-full min-w-0">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={0}
                      >
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={110}
                            paddingAngle={1}
                          >
                            {pieChartData.map((slice) => (
                              <Cell key={slice.name} fill={slice.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={
                              <CategoryTooltipContent
                                formatter={formatCurrency}
                              />
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </ViewTransition>
                ) : (
                  <div className="h-80 overflow-y-auto pr-2">
                    <ListView items={controller.legendItems} />
                  </div>
                )}

                {hasOverflowSlice && showAllSlices === false ? (
                  <p className="text-muted-foreground text-xs">
                    Smaller categories are combined into “
                    {controller.overflowLabel}”. Use the legend or details view
                    to inspect every category.
                  </p>
                ) : null}
              </div>

              <ViewTransition name={EXPENSES_BY_CATEGORY_LEGENG}>
                <LegendPanel
                  items={controller.filteredLegendItems}
                  totalItems={controller.legendItems.length}
                  activeItems={activeLegendCount}
                  searchQuery={controller.searchQuery}
                  onSearchChange={controller.setSearchQuery}
                  onToggle={controller.toggleCategoryVisibility}
                  onOpenDetails={() => setIsDetailsOpen(true)}
                />
              </ViewTransition>
            </div>
          )}
        </CardContent>
      </Card>

      <DetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        items={controller.legendItems}
        onToggle={controller.toggleCategoryVisibility}
        onSelectAll={controller.showAllCategories}
        onSoloTopCategory={controller.focusOnTopCategory}
      />
    </>
  );
}

function CategoryTooltipContent({
  active,
  payload,
  formatter,
}: TooltipProps<number, string> & {
  payload?: Array<{ payload: CategoryChartSlice }>;
  formatter: (value: number) => string;
}) {
  const datum = payload?.[0]?.payload;
  if (active !== true || datum == null) {
    return null;
  }

  return (
    <div className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-md">
      <p className="text-sm font-semibold">{datum.name}</p>
      <p className="text-muted-foreground text-xs">
        {formatter(datum.value)} · {formatPercentage(datum.percentage)}
      </p>
    </div>
  );
}
