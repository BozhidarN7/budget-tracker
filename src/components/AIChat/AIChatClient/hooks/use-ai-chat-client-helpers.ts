import type { UIMessage } from 'ai';
import type {
  ChatDataParts,
  PendingTransactionCandidate,
  PendingTransactionStatus,
} from '@/lib/ai-chat/pending-transaction';

const AUTO_SCROLL_RESUME_THRESHOLD_PX = 96;

export type ChatMessage = UIMessage<unknown, ChatDataParts>;

export type PendingTransactionUIPart = {
  id?: string;
  type: 'data-pendingTransactionCandidate';
  data: {
    candidate: PendingTransactionCandidate;
    status: PendingTransactionStatus;
    errorMessage?: string;
  };
};

export type PendingTransactionPartUpdate = {
  errorMessage?: string;
  status: PendingTransactionStatus;
};

export const isNearBottom = (element: HTMLDivElement) => {
  const distanceFromBottom =
    element.scrollHeight - element.scrollTop - element.clientHeight;

  return distanceFromBottom <= AUTO_SCROLL_RESUME_THRESHOLD_PX;
};

export function isPendingCandidatePart(
  part: unknown,
): part is PendingTransactionUIPart {
  if (!part || typeof part !== 'object') {
    return false;
  }

  return (
    (part as { type?: string }).type === 'data-pendingTransactionCandidate'
  );
}

export function isUnresolvedStatus(status: PendingTransactionStatus) {
  return status === 'awaiting_confirmation' || status === 'failed';
}
