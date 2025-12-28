'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import TrendsLineChart from '@/components/Charts/TrendsLineChart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrencyFormatter, useStatisticsData } from '@/hooks/';

export default function SpendingTrends() {
  const { dailySpending, weeklySpending, monthlySpending } =
    useStatisticsData();
  const [timeframe, setTimeframe] = useState('monthly');
  const { formatCurrency } = useCurrencyFormatter();

  const data = {
    daily: dailySpending,
    weekly: weeklySpending,
    monthly: monthlySpending,
  }[timeframe];

  const hasData =
    data &&
    data.length > 0 &&
    data.some((item) => item.expenses > 0 || item.income > 0);

  if (!hasData) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold">Spending Trends</h2>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                No spending data available
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Add some transactions to see your spending trends
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Spending Trends</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending Over Time</CardTitle>
            <CardDescription>
              View your spending trends over{' '}
              {timeframe === 'daily'
                ? 'days'
                : timeframe === 'weekly'
                  ? 'weeks'
                  : 'months'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <TrendsLineChart
              data={data ?? []}
              xKey="period"
              height={300}
              tooltipFormatter={(value, name) => [formatCurrency(value), name]}
              lines={[
                {
                  dataKey: 'expenses',
                  label: 'Expenses',
                  color: '#ef4444',
                  activeDotRadius: 8,
                },
                {
                  dataKey: 'income',
                  label: 'Income',
                  color: '#10b981',
                  activeDotRadius: 8,
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>
              Compare your expenses across{' '}
              {timeframe === 'daily'
                ? 'days'
                : timeframe === 'weekly'
                  ? 'weeks'
                  : 'months'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                  />
                  <Legend />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>
            Detailed view of your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">Period</th>
                  <th className="pb-2 text-right font-medium">Income</th>
                  <th className="pb-2 text-right font-medium">Expenses</th>
                  <th className="pb-2 text-right font-medium">Net</th>
                  <th className="pb-2 text-right font-medium">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((item) => {
                    const net = item.income - item.expenses;

                    return (
                      <tr key={item.period} className="border-b">
                        <td className="py-2">{item.period}</td>
                        <td className="py-2 text-right text-emerald-600">
                          {item.income > 0 ? formatCurrency(item.income) : '-'}
                        </td>
                        <td className="py-2 text-right text-rose-600">
                          {item.expenses > 0
                            ? formatCurrency(item.expenses)
                            : '-'}
                        </td>
                        <td
                          className={`py-2 text-right ${net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                        >
                          {net !== 0
                            ? `${net >= 0 ? '+' : ''}${formatCurrency(Math.abs(net))}`
                            : '-'}
                        </td>
                        <td className="py-2 text-right">{item.transactions}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
