import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FallbackLoader() {
  return (
    <div className="flex min-h-screen flex-1 flex-col md:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="hidden flex-1 md:block">
              <Skeleton className="h-10 w-full max-w-sm" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>

        <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-4 md:px-6 md:py-6">
          <div className="flex w-full max-w-md flex-col items-center justify-center px-6 text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
            <p className="text-muted-foreground text-sm">
              Checking authentication status...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
