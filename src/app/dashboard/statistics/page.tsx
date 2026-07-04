import { Suspense } from 'react';
import FallbackLoader from '@/components/FallbackLoader';
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
  return (
    <ViewTransitionPage>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">
          Analyze your financial data with detailed charts and insights to make
          better budgeting decisions.
        </p>
        <Suspense fallback={<FallbackLoader />}>
          <RenderView searchParams={searchParams} />
        </Suspense>
      </div>
    </ViewTransitionPage>
  );
}

async function RenderView({ searchParams }: StatisticsPageProps) {
  const tab = (await searchParams).tab;
  const initialTransactions = await getStatisticsTransactions();

  return (
    <StatisticsView
      initialTab={tab}
      initialTransactions={initialTransactions}
    />
  );
}
