import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/auth';
import StatisticsView from '@/components/Statistics/StatisticsView';

export default async function StatisticsPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Statistics</h1>
      <p className="text-muted-foreground">
        Analyze your financial data with detailed charts and insights to make
        better budgeting decisions.
      </p>
      <StatisticsView />
    </div>
  );
}
