'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
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
import { Progress } from '@/components/ui/progress';
import { useStatisticsData } from '@/hooks/';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils';

export default function CategoryAnalysis() {
  const { categoryBreakdown, categoryTrends, categoryLimits } =
    useStatisticsData();

  const COLORS = [
    '#ef4444', // red-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
  ];

  const hasExpenseData = categoryBreakdown.length > 0;
  const hasTrendData = categoryTrends.some((month) =>
    Object.keys(month).some(
      (key) =>
        key !== 'month' && typeof month[key] === 'number' && month[key] > 0,
    ),
  );
  const hasLimitData = categoryLimits.length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Category Analysis</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Breakdown of your expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasExpenseData ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        /* @ts-expect-error type unknown */
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryBreakdown.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        'Amount',
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No expense data available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add some expense transactions to see category breakdown
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Comparison</CardTitle>
            <CardDescription>
              Compare spending across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasExpenseData ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryBreakdown}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        'Amount',
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No expense data available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add some expense transactions to see category comparison
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {hasLimitData ? (
        <Card>
          <CardHeader>
            <CardTitle>Category Spending vs. Limits</CardTitle>
            <CardDescription>
              Track how close you are to your category spending limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryLimits.map((category) => {
                const progressPercentage =
                  (category.spent / category.limit) * 100;
                const isOverLimit = progressPercentage > 100;

                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span
                        className={cn(
                          'font-medium',
                          isOverLimit
                            ? 'text-rose-500'
                            : 'text-muted-foreground',
                        )}
                      >
                        {formatCurrency(category.spent)} /{' '}
                        {formatCurrency(category.limit)}
                      </span>
                    </div>
                    <div className={cn(isOverLimit ? 'text-rose-500' : '')}>
                      <Progress
                        value={Math.min(progressPercentage, 100)}
                        className={cn(
                          'h-2',
                          isOverLimit
                            ? '[--primary:theme(colors.rose.500)]'
                            : '',
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isOverLimit
                          ? `${(progressPercentage - 100).toFixed(0)}% over limit`
                          : `${progressPercentage.toFixed(0)}% of limit used`}
                      </span>
                      <span className="text-muted-foreground">
                        {isOverLimit
                          ? `${formatCurrency(category.spent - category.limit)} over`
                          : `${formatCurrency(category.limit - category.spent)} remaining`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Category Spending vs. Limits</CardTitle>
            <CardDescription>
              Track how close you are to your category spending limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">No category limits set</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Set spending limits for your categories to track your progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Category Trends</CardTitle>
          <CardDescription>
            How your category spending has changed over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasTrendData ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryTrends}
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
                  <Tooltip formatter={(value, name) => [`$${value}`, name]} />
                  <Legend />
                  {Object.keys(categoryTrends[0] || {})
                    .filter((key) => key !== 'month')
                    .map((category, index) => (
                      <Bar
                        key={category}
                        dataKey={category}
                        stackId="a"
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">No trend data available</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Add transactions over multiple months to see category trends
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
