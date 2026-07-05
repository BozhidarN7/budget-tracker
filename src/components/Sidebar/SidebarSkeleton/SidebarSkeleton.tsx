import { Skeleton } from '@/components/ui/skeleton';

export default function SidebarSkeleton() {
  return (
    <aside className="hidden w-64 border-r md:block">
      <div className="flex h-16 items-center border-b px-4">
        <Skeleton className="h-8 w-36" />
      </div>
      <div className="space-y-2 p-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </aside>
  );
}
