'use client';

import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
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
import { useStatisticsData } from '@/hooks/';

export default function IncomeExpenseComparison() {
  const { monthlyComparison, incomeSourceBreakdown, incomeVsExpenseRatio } =
    useStatisticsData();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Income vs Expenses</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
            <CardDescription>
              Income and expenses over the past months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyComparison}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Income Trend</CardTitle>
            <CardDescription>Your net income over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyComparison}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="net"
                    fill="#3b82f6"
                    stroke="#3b82f6"
                    name="Net Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#1d4ed8"
                    dot={{ r: 4 }}
                    name="Net Income"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>
              Breakdown of your income by source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeSourceBreakdown}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="source" />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income/Expense Ratio</CardTitle>
            <CardDescription>
              How your income compares to expenses over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={incomeVsExpenseRatio}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 2]} ticks={[0, 0.5, 1, 1.5, 2]} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(2)}`,
                      'Ratio',
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ratio"
                    stroke="#8b5cf6"
                    activeDot={{ r: 8 }}
                    name="Income/Expense Ratio"
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#9ca3af"
                    strokeDasharray="5 5"
                    name="Break-even (1.0)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-muted-foreground mt-4 text-sm">
              <p>
                A ratio above 1.0 means you&apos;re earning more than spending.
                Below 1.0 means you&apos;re spending more than earning.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
