'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import TrendsLineChart from '@/components/Charts/TrendsLineChart';
import { useBudgetData, useCurrencyFormatter } from '@/hooks/';

export default function MonthlyTrendsChart() {
  const { monthlyTrends } = useBudgetData();
  const { formatCurrency } = useCurrencyFormatter();

  const chartData = useMemo(() => {
    return monthlyTrends.map((entry) => {
      const monthLabel = entry.monthKey
        ? format(new Date(`${entry.monthKey}-01`), 'MMM yyyy')
        : entry.month;

      return {
        ...entry,
        monthLabel,
      };
    });
  }, [monthlyTrends]);

  return (
    <TrendsLineChart
      data={chartData}
      xKey="monthLabel"
      height={300}
      tooltipFormatter={(value, name) => [formatCurrency(value), name]}
      lines={[
        {
          dataKey: 'income',
          label: 'Income',
          color: '#10b981',
          activeDotRadius: 8,
        },
        {
          dataKey: 'expenses',
          label: 'Expenses',
          color: '#ef4444',
          activeDotRadius: 8,
        },
      ]}
    />
  );
}
