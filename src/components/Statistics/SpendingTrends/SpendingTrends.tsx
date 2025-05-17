'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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
import { useStatisticsData } from '@/hooks/';

export default function SpendingTrends() {
  const { dailySpending, weeklySpending, monthlySpending } =
    useStatisticsData();
  const [timeframe, setTimeframe] = useState('monthly');

  const data = {
    daily: dailySpending,
    weekly: weeklySpending,
    monthly: monthlySpending,
  }[timeframe];

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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
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
                  <Tooltip formatter={(value) => [`$${value}`, 'Expenses']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
                  <Tooltip formatter={(value) => [`$${value}`, 'Expenses']} />
                  <Legend />
                  <Bar dataKey="expenses" fill="#ef4444" />
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
                  <th className="pb-2 text-right font-medium">Expenses</th>
                  <th className="pb-2 text-right font-medium">% Change</th>
                  <th className="pb-2 text-right font-medium">
                    Avg. Transaction
                  </th>
                  <th className="pb-2 text-right font-medium">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const prevExpense =
                    index > 0 ? data[index - 1].expenses : item.expenses;
                  const percentChange =
                    ((item.expenses - prevExpense) / prevExpense) * 100;

                  return (
                    <tr key={item.period} className="border-b">
                      <td className="py-2">{item.period}</td>
                      <td className="py-2 text-right">
                        ${item.expenses.toFixed(2)}
                      </td>
                      <td className="py-2 text-right">
                        {index === 0 ? (
                          '-'
                        ) : (
                          <span
                            className={
                              percentChange > 0
                                ? 'text-rose-500'
                                : 'text-emerald-500'
                            }
                          >
                            {percentChange > 0 ? '+' : ''}
                            {percentChange.toFixed(1)}%
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        ${(item.expenses / item.transactions).toFixed(2)}
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
