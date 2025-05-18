import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChartSkeleton({
  title = 'Loading Chart',
}: {
  title?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[300px] items-center justify-center">
          <div className="w-full">
            <Skeleton className="h-[250px] w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
