'use client';

import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCalloutProps {
  children: React.ReactNode;
  className?: string;
}

export default function InfoCallout({ children, className }: InfoCalloutProps) {
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200',
        className,
      )}
    >
      <Info
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <span className="sr-only">Recurring series information</span>
        {children}
      </div>
    </div>
  );
}
