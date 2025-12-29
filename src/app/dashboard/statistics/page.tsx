import StatisticsView from '@/components/Statistics/StatisticsView';

interface StatisticsPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function StatisticsPage({
  searchParams,
}: StatisticsPageProps) {
  const tab = (await searchParams).tab;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Statistics</h1>
      <p className="text-muted-foreground">
        Analyze your financial data with detailed charts and insights to make
        better budgeting decisions.
      </p>
      <StatisticsView initialTab={tab} />
    </div>
  );
}
