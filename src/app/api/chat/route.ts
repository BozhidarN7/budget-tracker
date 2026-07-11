import { NextResponse } from 'next/server';
import {
  type ChatMessage,
  buildGeneralConversationResponse,
  buildPendingResolutionMessage,
  buildPendingTransactionSummary,
  canonicalizeCandidateCategory,
  createStructuredResponse,
  extractLastUserText,
  isLikelyTransactionIntent,
  toUiStreamResponse,
} from './chat-response';
import {
  classifyPendingTransactionIntent,
  findLatestUnresolvedPendingTransaction,
} from './pending-transaction-state';
import {
  extractTransactionCandidate,
  extractTransactionPatch,
  getMissingFields,
  isCompleteCandidate,
} from './transaction-candidate-extraction';
import { fetchServerCategories } from '@/server/categories';
import { buildAuthHeaders } from '@/server/auth';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const headers = await buildAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { messages }: { messages: ChatMessage[] } = await req.json();
  const categories = await fetchServerCategories(headers);
  const latestText = extractLastUserText(messages);
  const activePending = findLatestUnresolvedPendingTransaction(messages);
  const pendingIntent = activePending
    ? await classifyPendingTransactionIntent(latestText)
    : null;

  if (latestText.length === 0) {
    const result = await buildGeneralConversationResponse(categories, messages);

    return toUiStreamResponse(messages, result);
  }

  if (pendingIntent?.intent === 'confirm') {
    if (!activePending) {
      return createStructuredResponse(messages, {
        text: 'There is no pending transaction to confirm.',
      });
    }

    if (pendingIntent.hasConflictingIntent) {
      return createStructuredResponse(messages, {
        text: 'I detected both confirmation and an edit request. Send either a pure confirmation or a separate edit first.',
      });
    }

    return createStructuredResponse(messages, {
      action: {
        action: 'confirm',
        actionId: crypto.randomUUID(),
        targetMessageId: activePending.messageId,
      },
      text: 'Confirming the pending transaction now.',
    });
  }

  if (pendingIntent?.intent === 'cancel') {
    if (!activePending) {
      return createStructuredResponse(messages, {
        text: 'There is no pending transaction to cancel.',
      });
    }

    return createStructuredResponse(messages, {
      action: {
        action: 'cancel',
        actionId: crypto.randomUUID(),
        targetMessageId: activePending.messageId,
      },
      text: 'Cancelling the pending transaction now.',
    });
  }

  if (activePending) {
    if (pendingIntent?.intent !== 'edit') {
      return createStructuredResponse(messages, {
        text: 'You already have a pending transaction draft. Confirm it, cancel it, or send an edit like "change amount to 25" before creating another one.',
      });
    }

    const patch = await extractTransactionPatch(latestText);

    if (Object.keys(patch).length === 0) {
      return createStructuredResponse(messages, {
        text: 'I could not determine what to change. Specify at least one field, such as amount, category, date, currency, type, or description.',
      });
    }

    const mergedCandidate = {
      ...activePending.candidate,
      ...patch,
    };
    const {
      candidate: candidateWithCanonicalCategory,
      invalidCategoryMessage,
    } = canonicalizeCandidateCategory(categories, mergedCandidate);
    const missingFields = getMissingFields(candidateWithCanonicalCategory);

    if (invalidCategoryMessage || missingFields.length > 0) {
      return toUiStreamResponse(
        messages,
        buildPendingResolutionMessage(
          categories,
          candidateWithCanonicalCategory,
          invalidCategoryMessage,
          missingFields,
        ),
      );
    }

    if (!isCompleteCandidate(candidateWithCanonicalCategory)) {
      return createStructuredResponse(messages, {
        text: 'The updated draft is still incomplete. Provide any remaining required fields before confirmation.',
      });
    }

    return createStructuredResponse(messages, {
      pendingCandidate: {
        candidate: candidateWithCanonicalCategory,
        candidateId: activePending.candidateId,
        status: 'awaiting_confirmation',
      },
      text: `Updated pending transaction. ${buildPendingTransactionSummary(candidateWithCanonicalCategory)}`,
    });
  }

  const candidate = await extractTransactionCandidate(latestText);
  const { candidate: candidateWithCanonicalCategory, invalidCategoryMessage } =
    canonicalizeCandidateCategory(categories, candidate);
  const missingFields = getMissingFields(candidateWithCanonicalCategory);
  const hasCandidateFields =
    Object.keys(candidateWithCanonicalCategory).length > 0;

  if (!hasCandidateFields && !isLikelyTransactionIntent(latestText)) {
    const result = await buildGeneralConversationResponse(categories, messages);

    return toUiStreamResponse(messages, result);
  }

  if (invalidCategoryMessage || missingFields.length > 0) {
    return toUiStreamResponse(
      messages,
      buildPendingResolutionMessage(
        categories,
        candidateWithCanonicalCategory,
        invalidCategoryMessage,
        missingFields,
      ),
    );
  }

  if (!isCompleteCandidate(candidateWithCanonicalCategory)) {
    return createStructuredResponse(messages, {
      text: 'I still need all required transaction fields before preparing a pending draft.',
    });
  }

  return createStructuredResponse(messages, {
    pendingCandidate: {
      candidate: candidateWithCanonicalCategory,
      candidateId: crypto.randomUUID(),
      status: 'awaiting_confirmation',
    },
    text: buildPendingTransactionSummary(candidateWithCanonicalCategory),
  });
}
