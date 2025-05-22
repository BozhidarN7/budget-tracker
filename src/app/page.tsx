import DashboardCards from '@/components/Dashboard/DashboardCards';
import ExpensesByCategoryChart from '@/components/Dashboard/ExpensesByCategoryChart';
import MonthlyTrendsChart from '@/components/Dashboard/MonthlyTrendsChart';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import SavingsGoalProgress from '@/components/Dashboard/SavingsGoalProgress';
import CategoryLimits from '@/components/Dashboard/CategoryLimits';
import MonthSelector from '@/components/Dashboard/MonthSelector';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <MonthSelector />
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Expenses by Category</h2>
          <ExpensesByCategoryChart />
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Monthly Trends</h2>
          <MonthlyTrendsChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-card rounded-lg border p-6 shadow-sm md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <RecentTransactions />
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Savings Goal</h2>
            <SavingsGoalProgress />
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Category Limits</h2>
            <CategoryLimits />
          </div>
        </div>
      </div>
    </div>
  );
}
