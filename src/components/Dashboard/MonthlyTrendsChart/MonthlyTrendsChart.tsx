'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useBudgetData } from '@/hooks/';

export default function MonthlyTrendsChart() {
  const { monthlyTrends } = useBudgetData();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={monthlyTrends}
          margin={{
            top: 5,
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
            dataKey="income"
            stroke="#10b981"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
