'use client';

import { useMemo, useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/';
import useCategoryChartController, {
  CategoryChartSlice,
} from '@/hooks/use-category-chart-controller';
import {
  formatCurrency,
  formatMonthKeyToReadable,
  formatPercentage,
} from '@/utils';

const VIEW_OPTIONS: ChartViewToggleOption[] = [
  { value: 'pie', label: 'Chart' },
  { value: 'list', label: 'List' },
];

type ViewMode = (typeof VIEW_OPTIONS)[number]['value'];

type PieChartDatum = CategoryChartSlice & Record<string, unknown>;

export default function ExpensesByCategoryChart() {
  const { expensesByCategory, isLoading, selectedMonth } = useBudgetData();
  const controller = useCategoryChartController(expensesByCategory, {
    primaryCount: 7,
    overflowLabel: 'Other categories',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('pie');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showAllSlices, setShowAllSlices] = useState(false);

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

  if (controller.hasData === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by category</CardTitle>
          <p className="text-muted-foreground text-sm">
            {readableMonth} · No expenses recorded for this month yet.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Add expenses to your categories to unlock this chart view.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleViewModeChange = (nextValue: string) => {
    setViewMode(nextValue as ViewMode);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Expenses by category
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {readableMonth} · {controller.legendItems.length} categories
              tracked
            </p>
          </div>
          <div className="text-sm font-medium">
            Visible total · {formatCurrency(controller.totalValue)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
                className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 hover:underline"
              >
                {showAllSlices === true
                  ? 'Show summarized slices'
                  : 'Show every slice'}
              </button>
            ) : null}
          </div>

          <div className="gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              {viewMode === 'pie' ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
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
                      <Tooltip content={<CategoryTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto pr-2">
                  <ListView items={controller.legendItems} />
                </div>
              )}

              {hasOverflowSlice && showAllSlices === false ? (
                <p className="text-muted-foreground text-xs">
                  Smaller categories are combined into “
                  {controller.overflowLabel}”. Use the legend or details view to
                  inspect every category.
                </p>
              ) : null}
            </div>

            <LegendPanel
              items={controller.filteredLegendItems}
              totalItems={controller.legendItems.length}
              activeItems={activeLegendCount}
              searchQuery={controller.searchQuery}
              onSearchChange={controller.setSearchQuery}
              onToggle={controller.toggleCategoryVisibility}
              onOpenDetails={() => setIsDetailsOpen(true)}
            />
          </div>
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
}: TooltipProps<number, string> & {
  payload?: Array<{ payload: CategoryChartSlice }>;
}) {
  const datum = payload?.[0]?.payload;
  if (active !== true || datum == null) {
    return null;
  }

  return (
    <div className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-md">
      <p className="text-sm font-semibold">{datum.name}</p>
      <p className="text-muted-foreground text-xs">
        {formatCurrency(datum.value)} · {formatPercentage(datum.percentage)}
      </p>
    </div>
  );
}
