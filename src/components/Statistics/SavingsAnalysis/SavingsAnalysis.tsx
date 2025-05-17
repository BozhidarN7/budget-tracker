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

export default function SavingsAnalysis() {
  const {
    savingsRate,
    savingsGoalProgress,
    savingsProjection,
    savingsDistribution,
  } = useStatisticsData();

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

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
                  <YAxis domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Savings Rate']}
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
                    {savingsGoalProgress.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Savings Projection</CardTitle>
          <CardDescription>
            Projected savings growth over the next 12 months
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
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="optimistic"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  name="Optimistic Scenario"
                />
                <Area
                  type="monotone"
                  dataKey="expected"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  name="Expected Scenario"
                />
                <Area
                  type="monotone"
                  dataKey="conservative"
                  stackId="3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  name="Conservative Scenario"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-muted-foreground mt-4 text-sm">
            <p>
              Projections based on your current savings rate. Optimistic assumes
              15% increase in savings, expected assumes current rate continues,
              and conservative assumes 10% decrease.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Distribution</CardTitle>
          <CardDescription>
            How your savings are distributed across different accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
                <Bar dataKey="current" fill="#3b82f6" name="Current Amount" />
                <Bar dataKey="target" fill="#9ca3af" name="Target Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
