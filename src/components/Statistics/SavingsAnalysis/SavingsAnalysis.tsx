'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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
import { useStatisticsData } from '@/hooks/';
import { formatCurrency } from '@/utils';

export default function SavingsAnalysis() {
  const {
    savingsRate,
    savingsGoalProgress,
    savingsProjection,
    savingsDistribution,
  } = useStatisticsData();

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  const hasSavingsData = savingsRate.some((month) => month.rate !== 0);
  const hasGoalData =
    savingsGoalProgress.length > 0 &&
    savingsGoalProgress.some((goal) => goal.value > 0);
  const hasDistributionData = savingsDistribution.length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Savings Analysis</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Savings Rate</CardTitle>
            <CardDescription>
              Percentage of income saved each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasSavingsData ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={savingsRate}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 'dataMax + 10']} />
                    <Tooltip
                      formatter={(value) => [
                        `${typeof value === 'number' ? value.toFixed(1) : value}%`,
                        'Savings Rate',
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                      name="Savings Rate"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#9ca3af"
                      strokeDasharray="5 5"
                      name="Target Rate (20%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No savings data available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add income and expense transactions to see your savings rate
                  </p>
                </div>
              </div>
            )}
            <div className="text-muted-foreground mt-4 text-sm">
              <p>
                Financial experts recommend saving at least 20% of your income.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Goals Progress</CardTitle>
            <CardDescription>
              Progress towards your savings goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasGoalData ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={savingsGoalProgress}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {savingsGoalProgress.map((_entry, index) => (
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
                    No savings goals available
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Create some savings goals to track your progress
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Savings Projection</CardTitle>
          <CardDescription>
            Projected savings growth over the next 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={savingsProjection}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(typeof value === 'number' ? value : 0),
                    '',
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="optimistic"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Optimistic Scenario"
                />
                <Area
                  type="monotone"
                  dataKey="expected"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Expected Scenario"
                />
                <Area
                  type="monotone"
                  dataKey="conservative"
                  stackId="3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  name="Conservative Scenario"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-muted-foreground mt-4 text-sm">
            <p>
              Projections based on your recent savings trends. Optimistic
              assumes 20% increase in savings, expected assumes current rate
              continues, and conservative assumes 20% decrease.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Distribution</CardTitle>
          <CardDescription>
            How your savings are distributed across different goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasDistributionData ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={savingsDistribution}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      'Amount',
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="current" fill="#3b82f6" name="Current Amount" />
                  <Bar dataKey="target" fill="#9ca3af" name="Target Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  No savings goals available
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Create some savings goals to see distribution
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
