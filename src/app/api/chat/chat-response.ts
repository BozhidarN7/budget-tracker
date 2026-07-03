import {
  type UIMessageChunk,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from 'ai';
import { ollama } from 'ai-sdk-ollama';
import { validateCandidateCategory } from './pending-transaction-state';
import type {
  ChatMessage,
  PendingTransactionActionData,
  PendingTransactionCandidate,
  PendingTransactionData,
} from '@/lib/ai-chat/pending-transaction';
import type { Category } from '@/types/budget';

export type { ChatMessage } from '@/lib/ai-chat/pending-transaction';

export function buildCategoryPrompt(categories: Category[]) {
  return categories
    .map((category) => `- ${category.name} (${category.type})`)
    .join('\n');
}

export function buildAssistantSystemPrompt(categories: Category[]) {
  return `You are a budgeting assistant.

Transaction safety rules:
- Never commit a transaction directly.
- Ask follow-up questions whenever any required field is missing, ambiguous, or uncertain.
- Required fields are: type, amount, currency, category, date, description.
- Never invent categories.
- Only use categories from this list:
${buildCategoryPrompt(categories)}
- If a pending transaction draft exists, avoid creating another draft until it is confirmed or cancelled.
- Treat clear edits as updates to the current pending draft.
- Treat clear confirmations as requests to confirm the current pending draft.
- Treat clear cancellations as requests to cancel the current pending draft.
- Avoid ambiguous confirmations or cancellations without clarification.`;
}

export function extractLastUserText(messages: ChatMessage[]) {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user');

  return (
    lastUserMessage?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(' ')
      .trim() ?? ''
  );
}

export function isLikelyTransactionIntent(message: string) {
  const normalized = message.trim().toLowerCase();

  return (
    /\b(add|create|record|save|log|update|change)\b/.test(normalized) ||
    /\b(transaction|expense|income|amount|category|currency|date)\b/.test(
      normalized,
    )
  );
}

export function canonicalizeCandidateCategory(
  categories: Category[],
  candidate: Partial<PendingTransactionCandidate>,
) {
  if (!candidate.category) {
    return {
      candidate,
      invalidCategoryMessage: null,
    };
  }

  const exactMatch = categories.find(
    (category) => category.name === candidate.category,
  );
  const caseInsensitiveMatches = categories.filter(
    (category) =>
      category.name.toLowerCase() === candidate.category?.toLowerCase(),
  );

  if (!exactMatch && caseInsensitiveMatches.length === 0) {
    return {
      candidate,
      invalidCategoryMessage: `I couldn't find an exact category match for "${candidate.category}". Choose one of the existing categories exactly as named.`,
    };
  }

  if (caseInsensitiveMatches.length > 1) {
    const options = caseInsensitiveMatches
      .map((category) => `${category.name} (${category.type})`)
      .join(', ');

    return {
      candidate,
      invalidCategoryMessage: `Category "${candidate.category}" is ambiguous. Choose one of: ${options}.`,
    };
  }

  const canonicalCategory = exactMatch ?? caseInsensitiveMatches[0];
  const withCanonicalCategory = {
    ...candidate,
    category: canonicalCategory.name,
  };

  if (!withCanonicalCategory.type) {
    return {
      candidate: withCanonicalCategory,
      invalidCategoryMessage: null,
    };
  }

  const validation = validateCandidateCategory(categories, {
    category: withCanonicalCategory.category,
    type: withCanonicalCategory.type,
  });

  return {
    candidate: withCanonicalCategory,
    invalidCategoryMessage: validation.errorMessage,
  };
}

export function buildPendingTransactionSummary(
  candidate: PendingTransactionCandidate,
) {
  return `Pending transaction ready for confirmation: ${candidate.description} for ${candidate.amount.toFixed(2)} ${candidate.currency} in ${candidate.category} on ${candidate.date}.`;
}

export function buildPendingResolutionMessage(
  categories: Category[],
  candidate: Partial<PendingTransactionCandidate>,
  invalidCategoryMessage: string | null,
  missingFields: string[],
) {
  const missingFieldsInstruction =
    missingFields.length > 0
      ? `Missing or unclear fields: ${missingFields.join(', ')}.`
      : 'All required fields are present.';
  const categoryInstruction = invalidCategoryMessage
    ? `${invalidCategoryMessage}\n\nAvailable categories:\n${buildCategoryPrompt(categories)}`
    : 'Category is valid if you choose to proceed.';

  return streamText({
    model: ollama('gemma4:e4b'),
    system: `You are validating a pending budget transaction before confirmation.

Explain clearly which fields are missing or invalid.
Do not invent any values.
If the category is invalid, require the user to choose an exact existing category.
Ask only for the missing or invalid pieces of information.

Validation summary:
- ${missingFieldsInstruction}
- ${categoryInstruction}`,
    prompt: `User input to validate:\n${JSON.stringify(candidate)}`,
  });
}

export async function buildGeneralConversationResponse(
  categories: Category[],
  messages: ChatMessage[],
) {
  return streamText({
    model: ollama('gemma4:e4b'),
    system: buildAssistantSystemPrompt(categories),
    messages: await convertToModelMessages(messages),
  });
}

export function createStructuredResponse(
  messages: ChatMessage[],
  options: {
    action?: PendingTransactionActionData;
    pendingCandidate?: {
      candidate: PendingTransactionCandidate;
      candidateId: string;
      status: PendingTransactionData['status'];
      errorMessage?: string;
    };
    text: string;
  },
) {
  const stream = createUIMessageStream<ChatMessage>({
    originalMessages: messages,
    execute: ({ writer }) => {
      writer.write({ type: 'start' });

      const textPartId = crypto.randomUUID();
      writer.write({
        type: 'text-start',
        id: textPartId,
      });
      writer.write({
        type: 'text-delta',
        delta: options.text,
        id: textPartId,
      });
      writer.write({
        type: 'text-end',
        id: textPartId,
      });

      if (options.pendingCandidate) {
        writer.write({
          type: 'data-pendingTransactionCandidate',
          id: options.pendingCandidate.candidateId,
          data: {
            candidate: options.pendingCandidate.candidate,
            status: options.pendingCandidate.status,
            ...(options.pendingCandidate.errorMessage
              ? { errorMessage: options.pendingCandidate.errorMessage }
              : {}),
          },
        });
      }

      if (options.action) {
        writer.write({
          type: 'data-pendingTransactionAction',
          id: options.action.actionId,
          data: options.action,
        });
      }

      writer.write({
        type: 'finish',
        finishReason: 'stop',
      });
    },
  });

  return createUIMessageStreamResponse({
    stream: stream as ReadableStream<UIMessageChunk>,
  });
}

export function toUiStreamResponse(
  messages: ChatMessage[],
  result: ReturnType<typeof streamText>,
) {
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
    }),
  });
}
