import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type PendingTransactionCandidate,
  classifyPendingTransactionIntent,
  findLatestUnresolvedPendingTransaction,
  validateCandidateCategory,
} from './pending-transaction-state';
import type { Category } from '@/types/budget';

const { generateTextMock, ollamaMock, outputObjectMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
  ollamaMock: vi.fn((modelId: string) => ({
    provider: 'ollama',
    modelId,
  })),
  outputObjectMock: vi.fn((config) => ({ kind: 'object', ...config })),
}));

vi.mock('ai', () => ({
  Output: {
    object: outputObjectMock,
  },
  generateText: generateTextMock,
}));

vi.mock('ai-sdk-ollama', () => ({
  ollama: ollamaMock,
}));

const expenseCategory: Category = {
  id: 'cat-expense',
  name: 'Shopping',
  color: '#000000',
  type: 'expense',
  monthlyData: {},
};

const incomeCategory: Category = {
  id: 'cat-income',
  name: 'Salary',
  color: '#ffffff',
  type: 'income',
  monthlyData: {},
};

const baseCandidate: PendingTransactionCandidate = {
  amount: 25,
  category: 'Shopping',
  currency: 'EUR',
  date: 'Jun 29, 2026',
  description: 'Groceries',
  type: 'expense',
};

describe('pending transaction transcript state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('finds the latest unresolved pending candidate from transcript messages', () => {
    const messages = [
      {
        id: 'assistant-1',
        parts: [
          {
            type: 'data-pendingTransactionCandidate',
            id: 'candidate-1',
            data: {
              candidate: baseCandidate,
              status: 'confirmed' as const,
            },
          },
        ],
      },
      {
        id: 'assistant-2',
        parts: [
          {
            type: 'data-pendingTransactionCandidate',
            id: 'candidate-2',
            data: {
              candidate: {
                ...baseCandidate,
                amount: 40,
              },
              status: 'awaiting_confirmation' as const,
            },
          },
        ],
      },
    ];

    const result = findLatestUnresolvedPendingTransaction(messages);

    expect(result).toMatchObject({
      candidateId: 'candidate-2',
      messageId: 'assistant-2',
      status: 'awaiting_confirmation',
    });
    expect(result?.candidate.amount).toBe(40);
  });

  it('classifies pending transaction intent via structured output generation', async () => {
    generateTextMock.mockResolvedValue({
      output: {
        confidence: 0.98,
        hasConflictingIntent: false,
        intent: 'confirm',
      },
    });

    const result = await classifyPendingTransactionIntent('yes, confirm');

    expect(result).toEqual({
      confidence: 0.98,
      hasConflictingIntent: false,
      intent: 'confirm',
    });
    expect(ollamaMock).toHaveBeenCalledWith('gemma4:e4b');
    expect(outputObjectMock).toHaveBeenCalledTimes(1);
    expect(generateTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: { modelId: 'gemma4:e4b', provider: 'ollama' },
        output: expect.objectContaining({
          kind: 'object',
        }),
        prompt: expect.stringContaining('yes, confirm'),
      }),
    );
  });

  it('canonicalizes case-only category differences and rejects invalid type', () => {
    const categories = [expenseCategory, incomeCategory];

    const canonicalized = validateCandidateCategory(categories, {
      category: 'shopping',
      type: 'expense',
    });

    expect(canonicalized).toEqual({
      canonicalCategoryName: 'Shopping',
      errorMessage: null,
    });

    const mismatch = validateCandidateCategory(categories, {
      category: 'Salary',
      type: 'expense',
    });

    expect(mismatch.errorMessage).toContain('cannot be used');
    expect(mismatch.canonicalCategoryName).toBeNull();
  });
});
