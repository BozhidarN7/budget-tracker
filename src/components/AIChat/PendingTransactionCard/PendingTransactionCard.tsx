import { LoaderCircle } from 'lucide-react';
import type {
  PendingTransactionCandidate,
  PendingTransactionStatus,
} from '@/lib/ai-chat/pending-transaction';
import { Button } from '@/components/ui/button';

type PendingTransactionCardProps = {
  candidate: PendingTransactionCandidate;
  isConfirming?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  status: PendingTransactionStatus;
  errorMessage?: string;
};

export function PendingTransactionCard({
  candidate,
  isConfirming,
  onCancel,
  onConfirm,
  status,
  errorMessage,
}: PendingTransactionCardProps) {
  const isAwaitingConfirmation = status === 'awaiting_confirmation';
  const isRetryableFailure = status === 'failed';
  const isActionable = isAwaitingConfirmation || isRetryableFailure;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold">Pending Transaction</p>
          <p className="text-muted-foreground text-sm">
            Review the details below. The transaction will only be saved after
            explicit confirmation.
          </p>
        </div>

        <div className="bg-background/80 inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium">
          {status.replace(/_/g, ' ')}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Type" value={candidate.type} />
        <Field
          label="Amount"
          value={`${candidate.amount.toFixed(2)} ${candidate.currency}`}
        />
        <Field label="Category" value={candidate.category} />
        <Field label="Date" value={candidate.date} />
        <Field label="Description" value={candidate.description} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          onClick={onConfirm}
          disabled={!isActionable || isConfirming}
          size="sm"
        >
          {isConfirming ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : isRetryableFailure ? (
            'Retry confirm'
          ) : (
            'Confirm'
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={!isActionable || isConfirming}
          size="sm"
        >
          Cancel
        </Button>
      </div>

      {errorMessage ? (
        <p className="text-destructive mt-3 text-xs leading-5">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/70 space-y-1 rounded-xl border p-3">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}
