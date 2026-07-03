import type { UIMessage } from 'ai';
import { z } from 'zod';

const SUPPORTED_CURRENCIES = ['EUR', 'BGN', 'USD', 'GBP'] as const;

export const pendingTransactionCandidateSchema = z.object({
  amount: z.number().positive(),
  category: z.string().trim().min(1),
  currency: z.enum(SUPPORTED_CURRENCIES),
  date: z.string().trim().min(1),
  description: z.string().trim().min(1),
  type: z.enum(['income', 'expense']),
});

export type PendingTransactionCandidate = z.infer<
  typeof pendingTransactionCandidateSchema
>;

export type PendingTransactionStatus =
  | 'awaiting_confirmation'
  | 'cancelled'
  | 'confirmed'
  | 'failed';

export type PendingTransactionData = {
  candidate: PendingTransactionCandidate;
  errorMessage?: string;
  status: PendingTransactionStatus;
};

export type PendingTransactionActionData = {
  action: 'cancel' | 'confirm';
  actionId: string;
  targetMessageId: string;
};

export type ChatDataParts = {
  pendingTransactionAction: PendingTransactionActionData;
  pendingTransactionCandidate: PendingTransactionData;
};

export type ChatMessage = UIMessage<unknown, ChatDataParts>;
