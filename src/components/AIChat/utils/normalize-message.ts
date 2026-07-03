import type { UIDataTypes, UIMessage, UIMessagePart, UITools } from 'ai';
import type {
  PendingTransactionActionData,
  PendingTransactionCandidate,
  PendingTransactionData,
  PendingTransactionStatus,
} from '@/lib/ai-chat/pending-transaction';

type MessageRole = UIMessage['role'];

export type DisplayToolPart = {
  kind: 'tool';
  details?: string;
  displayName: string;
  state:
    | 'input_available'
    | 'input_streaming'
    | 'input_available_no_execute'
    | 'output_available'
    | 'output_error';
  summary: string;
};

type DisplayTextPart = {
  kind: 'text';
  text: string;
};

type DisplayFallbackPart = {
  kind: 'fallback';
  label: string;
};

export type DisplayPendingTransactionPart = {
  candidateId: string;
  kind: 'pending_transaction';
  candidate: PendingTransactionCandidate;
  status: PendingTransactionStatus;
  errorMessage?: string;
};

export type DisplayPendingTransactionActionPart = {
  action: 'cancel' | 'confirm';
  actionId: string;
  kind: 'pending_transaction_action';
  targetMessageId: string;
};

export type DisplayMessagePart =
  | DisplayFallbackPart
  | DisplayPendingTransactionActionPart
  | DisplayPendingTransactionPart
  | DisplayTextPart
  | DisplayToolPart;

export type DisplayMessage = {
  id: string;
  label: string;
  parts: DisplayMessagePart[];
  role: MessageRole;
};

type ToolLikePart = Extract<
  UIMessagePart<UIDataTypes, UITools>,
  { type: string }
> & {
  input?: unknown;
  output?: unknown;
  state?: string;
  toolCallId?: string;
  errorText?: string;
};

type PendingTransactionDataPart = {
  id?: string;
  data: PendingTransactionData;
  type: 'data-pendingTransactionCandidate';
};

type PendingTransactionActionDataPart = {
  id?: string;
  data: PendingTransactionActionData;
  type: 'data-pendingTransactionAction';
};

export function normalizeMessages(messages: UIMessage[]): DisplayMessage[] {
  return messages.map((message) => ({
    id: message.id,
    label: getRoleLabel(message.role),
    parts: normalizeParts(message.parts),
    role: message.role,
  }));
}

function normalizeParts(parts: UIMessage['parts']): DisplayMessagePart[] {
  const normalizedParts = parts.flatMap<DisplayMessagePart>((part) => {
    if (part.type === 'text' || part.type === 'reasoning') {
      if (part.text.trim().length === 0) {
        return [];
      }

      return [{ kind: 'text', text: part.text } satisfies DisplayTextPart];
    }

    if (part.type === 'step-start') {
      return [];
    }

    if (part.type.startsWith('tool-')) {
      return [normalizeToolPart(part as ToolLikePart)];
    }

    if (part.type === 'source-url') {
      return [{ kind: 'fallback', label: `Source: ${part.title ?? part.url}` }];
    }

    if (part.type === 'file' || part.type === 'reasoning-file') {
      return [
        {
          kind: 'fallback',
          label: `Attached file: ${'filename' in part ? (part.filename ?? part.mediaType) : part.mediaType}`,
        },
      ];
    }

    if (part.type === 'source-document') {
      return [{ kind: 'fallback', label: `Document: ${part.title}` }];
    }

    if (part.type === 'custom') {
      return [{ kind: 'fallback', label: `Custom content: ${part.kind}` }];
    }

    if (part.type === 'data-pendingTransactionCandidate') {
      const dataPart = part as PendingTransactionDataPart;

      return [
        {
          candidateId:
            dataPart.id ??
            buildFallbackCandidateId(
              dataPart.data.candidate,
              dataPart.data.status,
            ),
          kind: 'pending_transaction',
          candidate: dataPart.data.candidate,
          status: dataPart.data.status,
          ...(dataPart.data.errorMessage
            ? {
                errorMessage: dataPart.data.errorMessage,
              }
            : {}),
        } satisfies DisplayPendingTransactionPart,
      ];
    }

    if (part.type === 'data-pendingTransactionAction') {
      const actionPart = part as PendingTransactionActionDataPart;

      return [
        {
          action: actionPart.data.action,
          actionId: actionPart.id ?? actionPart.data.actionId,
          kind: 'pending_transaction_action',
          targetMessageId: actionPart.data.targetMessageId,
        } satisfies DisplayPendingTransactionActionPart,
      ];
    }

    return [{ kind: 'fallback', label: `Unsupported part: ${part.type}` }];
  });

  return normalizedParts.length > 0
    ? normalizedParts
    : [{ kind: 'fallback', label: 'No visible content' }];
}

function buildFallbackCandidateId(
  candidate: PendingTransactionCandidate,
  status: PendingTransactionStatus,
) {
  return [
    candidate.type,
    candidate.category,
    candidate.amount.toFixed(2),
    candidate.currency,
    candidate.date,
    candidate.description,
    status,
  ].join('|');
}

function normalizeToolPart(part: ToolLikePart): DisplayToolPart {
  const displayName = formatToolName(part.type.replace(/^tool-/, ''));
  const state = normalizeToolState(part.state);
  const summary = getToolSummary(state, displayName);
  const payload =
    state === 'output_error'
      ? part.errorText
      : part.output != null
        ? part.output
        : part.input;

  return {
    kind: 'tool',
    details: payload != null ? safeStringify(payload) : undefined,
    displayName,
    state,
    summary,
  };
}

function normalizeToolState(state?: string): DisplayToolPart['state'] {
  if (state === 'output-available') {
    return 'output_available';
  }

  if (state === 'output-error') {
    return 'output_error';
  }

  if (state === 'input-streaming') {
    return 'input_streaming';
  }

  if (state === 'input-available-no-execute') {
    return 'input_available_no_execute';
  }

  return 'input_available';
}

function getToolSummary(
  state: DisplayToolPart['state'],
  displayName: string,
): string {
  if (state === 'output_available') {
    return `${displayName} completed successfully.`;
  }

  if (state === 'output_error') {
    return `${displayName} failed while processing the request.`;
  }

  if (state === 'input_streaming') {
    return `${displayName} is currently running.`;
  }

  if (state === 'input_available_no_execute') {
    return `${displayName} is prepared but waiting for execution.`;
  }

  return `${displayName} was prepared for this response.`;
}

function getRoleLabel(role: MessageRole) {
  if (role === 'assistant') {
    return 'Assistant';
  }

  if (role === 'user') {
    return 'You';
  }

  return 'System';
}

function formatToolName(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
