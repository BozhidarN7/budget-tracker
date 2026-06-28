import { CheckCircle2, LoaderCircle, Wrench, XCircle } from 'lucide-react';
import type { DisplayToolPart } from '../utils/normalize-message';
import { cn } from '@/lib/utils';

type ToolEventCardProps = {
  part: DisplayToolPart;
};

const STATUS_STYLES = {
  input_available: {
    icon: Wrench,
    label: 'Prepared',
    className: 'border-border/70 bg-background/80',
  },
  input_streaming: {
    icon: LoaderCircle,
    label: 'Running',
    className: 'border-blue-500/30 bg-blue-500/5',
  },
  input_available_no_execute: {
    icon: Wrench,
    label: 'Ready',
    className: 'border-border/70 bg-background/80',
  },
  output_available: {
    icon: CheckCircle2,
    label: 'Completed',
    className: 'border-emerald-500/30 bg-emerald-500/5',
  },
  output_error: {
    icon: XCircle,
    label: 'Failed',
    className: 'border-destructive/30 bg-destructive/5',
  },
} as const;

export default function ToolEventCard({ part }: ToolEventCardProps) {
  const statusStyle =
    STATUS_STYLES[part.state] ?? STATUS_STYLES.input_available;
  const Icon = statusStyle.icon;

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 text-sm shadow-sm',
        statusStyle.className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-background/90 flex h-9 w-9 items-center justify-center rounded-xl border">
            <Icon
              className={cn(
                'h-4 w-4',
                part.state === 'input_streaming' ? 'animate-spin' : undefined,
              )}
              aria-hidden="true"
            />
          </div>

          <div className="space-y-1">
            <p className="font-semibold">{part.displayName}</p>
            <p className="text-muted-foreground text-sm">{part.summary}</p>
          </div>
        </div>

        <div className="bg-background/80 inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium">
          {statusStyle.label}
        </div>
      </div>

      {part.details ? (
        <pre className="bg-background/70 mt-3 overflow-x-auto rounded-xl border p-3 text-xs leading-5 whitespace-pre-wrap">
          {part.details}
        </pre>
      ) : null}
    </div>
  );
}
