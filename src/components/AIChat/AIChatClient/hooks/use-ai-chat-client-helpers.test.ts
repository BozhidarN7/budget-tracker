import { describe, expect, it } from 'vitest';
import {
  isPendingCandidatePart,
  isUnresolvedStatus,
} from './use-ai-chat-client-helpers';

describe('use-ai-chat-client helpers', () => {
  it('treats cancelled pending transactions as resolved', () => {
    expect(isUnresolvedStatus('awaiting_confirmation')).toBe(true);
    expect(isUnresolvedStatus('failed')).toBe(true);
    expect(isUnresolvedStatus('cancelled')).toBe(false);
    expect(isUnresolvedStatus('confirmed')).toBe(false);
  });

  it('recognizes pending candidate data parts', () => {
    expect(
      isPendingCandidatePart({
        type: 'data-pendingTransactionCandidate',
        data: {
          candidate: {
            amount: 12,
            category: 'Shopping',
            currency: 'EUR',
            date: 'Jul 02, 2026',
            description: 'Snack',
            type: 'expense',
          },
          status: 'awaiting_confirmation',
        },
      }),
    ).toBe(true);

    expect(isPendingCandidatePart({ type: 'text', text: 'noop' })).toBe(false);
  });
});
