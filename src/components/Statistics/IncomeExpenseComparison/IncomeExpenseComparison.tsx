'use client';

import {
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

  const hasMonthlyData = monthlyComparison.some(
    (month) => month.income > 0 || month.expenses > 0,
  );
  const hasIncomeData = incomeSourceBreakdown.length > 0;
  const hasRatioData = incomeVsExpenseRatio.some((month) => month.ratio > 0);

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
            {hasMonthlyData ? (
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
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No monthly data available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add some transactions to see monthly comparison
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Income Trend</CardTitle>
            <CardDescription>Your net income over time</CardDescription>
          </CardHeader>
          <CardContent>
            {hasMonthlyData ? (
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
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No net income data available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add income and expense transactions to see net income trends
                  </p>
                </div>
              </div>
            )}
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
            {hasIncomeData ? (
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
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No income data available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add some income transactions to see income sources
                  </p>
                </div>
              </div>
            )}
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
            {hasRatioData ? (
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
                    <YAxis domain={[0, 'dataMax + 0.5']} />
                    <Tooltip
                      formatter={(value) => [
                        `${typeof value === 'number' ? value.toFixed(2) : value}`,
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
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No ratio data available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add income and expense transactions to see ratio trends
                  </p>
                </div>
              </div>
            )}
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
