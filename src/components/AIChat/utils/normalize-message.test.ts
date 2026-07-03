import { describe, expect, it } from 'vitest';
import type { UIMessage } from 'ai';
import { normalizeMessages } from './normalize-message';

describe('normalizeMessages', () => {
  it('normalizes pending transaction states and action intents', () => {
    const messages = [
      {
        id: 'assistant-1',
        role: 'assistant' as const,
        parts: [
          {
            type: 'data-pendingTransactionCandidate',
            id: 'candidate-1',
            data: {
              candidate: {
                amount: 25,
                category: 'Shopping',
                currency: 'EUR',
                date: 'Jun 29, 2026',
                description: 'Groceries',
                type: 'expense',
              },
              status: 'confirmed',
            },
          },
          {
            type: 'data-pendingTransactionAction',
            id: 'action-1',
            data: {
              action: 'confirm',
              actionId: 'action-1',
              targetMessageId: 'assistant-1',
            },
          },
        ],
      },
    ];

    const normalized = normalizeMessages(messages as UIMessage[]);
    const parts = normalized[0].parts;

    expect(parts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'pending_transaction',
          candidateId: 'candidate-1',
          status: 'confirmed',
        }),
        expect.objectContaining({
          kind: 'pending_transaction_action',
          action: 'confirm',
          actionId: 'action-1',
          targetMessageId: 'assistant-1',
        }),
      ]),
    );
  });
});
