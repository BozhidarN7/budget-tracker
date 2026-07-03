import { Output, generateText } from 'ai';
import { ollama } from 'ai-sdk-ollama';
import z from 'zod';
import type { Category } from '@/types/budget';
import type {
  PendingTransactionCandidate,
  PendingTransactionData,
  PendingTransactionStatus,
} from '@/lib/ai-chat/pending-transaction';
import { validateServerCategory } from '@/server/categories';

export type {
  PendingTransactionCandidate,
  PendingTransactionData,
  PendingTransactionStatus,
} from '@/lib/ai-chat/pending-transaction';

const pendingTransactionIntentSchema = z.object({
  intent: z.enum(['confirm', 'cancel', 'edit', 'other']),
  confidence: z.number().min(0).max(1),
  hasConflictingIntent: z.boolean(),
});

type PendingCandidateDataPart = {
  id?: string;
  type: 'data-pendingTransactionCandidate';
  data: PendingTransactionData;
};

type ChatLikeMessagePart =
  | PendingCandidateDataPart
  | {
      type: string;
      text?: string;
    };

type ChatLikeMessage = {
  id: string;
  parts: ChatLikeMessagePart[];
};

export type PendingTransactionRecord = {
  candidate: PendingTransactionCandidate;
  candidateId: string;
  errorMessage?: string;
  messageId: string;
  status: PendingTransactionStatus;
};

export type CategoryValidationResult =
  | {
      canonicalCategoryName: string;
      errorMessage: null;
    }
  | {
      canonicalCategoryName: null;
      errorMessage: string;
    };

function isPendingCandidatePart(
  part: ChatLikeMessagePart,
): part is PendingCandidateDataPart {
  return part.type === 'data-pendingTransactionCandidate';
}

function isUnresolvedPendingStatus(status: PendingTransactionStatus) {
  return status === 'awaiting_confirmation' || status === 'failed';
}

export type PendingTransactionIntent = z.infer<
  typeof pendingTransactionIntentSchema
>;

export async function classifyPendingTransactionIntent(
  message: string,
): Promise<PendingTransactionIntent> {
  const result = await generateText({
    model: ollama('gemma4:e4b'),
    output: Output.object({ schema: pendingTransactionIntentSchema }),
    prompt: `Classify the user's intent about an already-existing pending transaction draft.

Valid intents:
- confirm: the user wants to approve or save the existing pending transaction.
- cancel: the user wants to discard, stop, or not save the existing pending transaction.
- edit: the user wants to modify one or more fields of the existing pending transaction.
- other: anything else, including creating a new transaction, asking a general question, or unclear requests.

Rules:
- Focus only on the user's latest message.
- Detect paraphrases, not just exact keywords.
- Set hasConflictingIntent to true when the message mixes multiple intents, such as confirm plus edit.
- Prefer other when the message is too ambiguous to classify confidently.

User message:
${message}`,
  });

  return result.output;
}

export function findLatestUnresolvedPendingTransaction(
  messages: ChatLikeMessage[],
): PendingTransactionRecord | null {
  for (const message of [...messages].reverse()) {
    for (const part of [...message.parts].reverse()) {
      if (!isPendingCandidatePart(part)) {
        continue;
      }

      if (!isUnresolvedPendingStatus(part.data.status)) {
        continue;
      }

      return {
        candidate: part.data.candidate,
        candidateId: part.id ?? message.id,
        errorMessage: part.data.errorMessage,
        messageId: message.id,
        status: part.data.status,
      };
    }
  }

  return null;
}

export function validateCandidateCategory(
  categories: Category[],
  candidate: Pick<PendingTransactionCandidate, 'category' | 'type'>,
): CategoryValidationResult {
  const validation = validateServerCategory(
    categories,
    candidate.category.trim(),
    candidate.type,
  );

  if (validation.status === 'not_found') {
    return {
      canonicalCategoryName: null,
      errorMessage: `I couldn't find an exact category match for "${candidate.category}". Choose one of the existing categories exactly as named.`,
    };
  }

  if (validation.status === 'ambiguous') {
    const options = validation.matches
      .map((category) => `${category.name} (${category.type})`)
      .join(', ');

    return {
      canonicalCategoryName: null,
      errorMessage: `Category "${candidate.category}" is ambiguous. Choose one of: ${options}.`,
    };
  }

  if (validation.status === 'type_mismatch') {
    return {
      canonicalCategoryName: null,
      errorMessage: `Category "${validation.category.name}" is a ${validation.category.type} category, so it cannot be used for a ${candidate.type} transaction.`,
    };
  }

  return {
    canonicalCategoryName: validation.canonicalCategoryName,
    errorMessage: null,
  };
}
