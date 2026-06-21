import StatisticsView from '@/components/Statistics/StatisticsView';
import ViewTransitionPage from '@/components/ViewTransitionPage';
import { getStatisticsTransactions } from '@/server/statistics-data';

interface StatisticsPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function StatisticsPage({
  searchParams,
}: StatisticsPageProps) {
  const tab = (await searchParams).tab;
  const initialTransactions = await getStatisticsTransactions();

  return (
    <ViewTransitionPage>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">
          Analyze your financial data with detailed charts and insights to make
          better budgeting decisions.
        </p>
        <StatisticsView
          initialTab={tab}
          initialTransactions={initialTransactions}
        />
      </div>
    </ViewTransitionPage>
  );
}
