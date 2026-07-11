import { beforeEach, describe, expect, it, vi } from 'vitest';

const buildAuthHeadersMock = vi.fn();
const extractTransactionCandidateMock = vi.fn();
const extractTransactionPatchMock = vi.fn();
const fetchServerCategoriesMock = vi.fn();
const getMissingFieldsMock = vi.fn();
const isCompleteCandidateMock = vi.fn();
const classifyPendingTransactionIntentMock = vi.fn();

vi.mock('@/server/auth', () => ({
  buildAuthHeaders: buildAuthHeadersMock,
}));

vi.mock('./transaction-candidate-extraction', () => ({
  extractTransactionCandidate: extractTransactionCandidateMock,
  extractTransactionPatch: extractTransactionPatchMock,
  getMissingFields: getMissingFieldsMock,
  isCompleteCandidate: isCompleteCandidateMock,
}));

vi.mock('./pending-transaction-state', async () => {
  const actual = await vi.importActual<
    typeof import('./pending-transaction-state')
  >('./pending-transaction-state');

  return {
    ...actual,
    classifyPendingTransactionIntent: classifyPendingTransactionIntentMock,
  };
});

vi.mock('@/server/categories', async () => {
  const actual = await vi.importActual<typeof import('@/server/categories')>(
    '@/server/categories',
  );

  return {
    ...actual,
    fetchServerCategories: fetchServerCategoriesMock,
  };
});

const categories = [
  {
    id: 'cat-1',
    name: 'Shopping',
    color: '#000000',
    type: 'expense',
    monthlyData: {},
  },
];

const pendingCandidate = {
  amount: 20,
  category: 'Shopping',
  currency: 'EUR' as const,
  date: 'Jun 29, 2026',
  description: 'Groceries',
  type: 'expense' as const,
};

describe('/api/chat route intent handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildAuthHeadersMock.mockResolvedValue({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    });
    fetchServerCategoriesMock.mockResolvedValue(categories);
    extractTransactionCandidateMock.mockResolvedValue({});
    extractTransactionPatchMock.mockResolvedValue({});
    getMissingFieldsMock.mockReturnValue([]);
    isCompleteCandidateMock.mockReturnValue(true);
    classifyPendingTransactionIntentMock.mockResolvedValue({
      intent: 'other',
      confidence: 0.25,
      hasConflictingIntent: false,
    });
  });

  it('returns 401 before chat processing when authentication is missing', async () => {
    buildAuthHeadersMock.mockResolvedValue(null);

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              id: 'user-1',
              role: 'user',
              parts: [{ type: 'text', text: 'add expense 25 shopping' }],
            },
          ],
        }),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: 'Unauthenticated',
    });
    expect(fetchServerCategoriesMock).not.toHaveBeenCalled();
    expect(extractTransactionCandidateMock).not.toHaveBeenCalled();
  });

  it('emits structured confirm action when user sends confirm', async () => {
    classifyPendingTransactionIntentMock.mockResolvedValue({
      intent: 'confirm',
      confidence: 0.99,
      hasConflictingIntent: false,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              id: 'assistant-1',
              role: 'assistant',
              parts: [
                {
                  type: 'data-pendingTransactionCandidate',
                  id: 'candidate-1',
                  data: {
                    candidate: pendingCandidate,
                    status: 'awaiting_confirmation',
                  },
                },
              ],
            },
            {
              id: 'user-1',
              role: 'user',
              parts: [{ type: 'text', text: 'confirm' }],
            },
          ],
        }),
      }),
    );
    const body = await response.text();

    expect(body).toContain('data-pendingTransactionAction');
    expect(body).toContain('"action":"confirm"');
    expect(body).toContain('"targetMessageId":"assistant-1"');
  });

  it('emits structured cancel action when user sends cancel', async () => {
    classifyPendingTransactionIntentMock.mockResolvedValue({
      intent: 'cancel',
      confidence: 0.99,
      hasConflictingIntent: false,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              id: 'assistant-1',
              role: 'assistant',
              parts: [
                {
                  type: 'data-pendingTransactionCandidate',
                  id: 'candidate-1',
                  data: {
                    candidate: pendingCandidate,
                    status: 'awaiting_confirmation',
                  },
                },
              ],
            },
            {
              id: 'user-1',
              role: 'user',
              parts: [{ type: 'text', text: 'cancel' }],
            },
          ],
        }),
      }),
    );
    const body = await response.text();

    expect(body).toContain('data-pendingTransactionAction');
    expect(body).toContain('"action":"cancel"');
  });

  it('blocks creating a new draft while unresolved pending exists', async () => {
    classifyPendingTransactionIntentMock.mockResolvedValue({
      intent: 'other',
      confidence: 0.7,
      hasConflictingIntent: false,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              id: 'assistant-1',
              role: 'assistant',
              parts: [
                {
                  type: 'data-pendingTransactionCandidate',
                  id: 'candidate-1',
                  data: {
                    candidate: pendingCandidate,
                    status: 'awaiting_confirmation',
                  },
                },
              ],
            },
            {
              id: 'user-1',
              role: 'user',
              parts: [{ type: 'text', text: 'add another expense' }],
            },
          ],
        }),
      }),
    );
    const body = await response.text();

    expect(body).toContain('already have a pending transaction draft');
  });

  it('canonicalizes category names before creating pending candidate', async () => {
    extractTransactionCandidateMock.mockResolvedValue({
      amount: 25,
      category: 'shopping',
      currency: 'EUR',
      date: 'Jun 29, 2026',
      description: 'Groceries',
      type: 'expense',
    });
    getMissingFieldsMock.mockReturnValue([]);
    isCompleteCandidateMock.mockReturnValue(true);

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              id: 'user-1',
              role: 'user',
              parts: [{ type: 'text', text: 'add expense 25 shopping' }],
            },
          ],
        }),
      }),
    );
    const body = await response.text();

    expect(body).toContain('data-pendingTransactionCandidate');
    expect(body).toContain('"category":"Shopping"');
  });

  it('patches the latest unresolved candidate for edit-like replies', async () => {
    extractTransactionPatchMock.mockResolvedValue({ amount: 25 });
    getMissingFieldsMock.mockReturnValue([]);
    isCompleteCandidateMock.mockReturnValue(true);
    classifyPendingTransactionIntentMock.mockResolvedValue({
      intent: 'edit',
      confidence: 0.98,
      hasConflictingIntent: false,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              id: 'assistant-1',
              role: 'assistant',
              parts: [
                {
                  type: 'data-pendingTransactionCandidate',
                  id: 'candidate-1',
                  data: {
                    candidate: pendingCandidate,
                    status: 'awaiting_confirmation',
                  },
                },
              ],
            },
            {
              id: 'user-1',
              role: 'user',
              parts: [{ type: 'text', text: 'change amount to 25' }],
            },
          ],
        }),
      }),
    );
    const body = await response.text();

    expect(body).toContain('data-pendingTransactionCandidate');
    expect(body).toContain('"amount":25');
    expect(body).toContain('"status":"awaiting_confirmation"');
  });

  it('rejects conflicting confirm-plus-edit intents', async () => {
    classifyPendingTransactionIntentMock.mockResolvedValue({
      intent: 'confirm',
      confidence: 0.8,
      hasConflictingIntent: true,
    });

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              id: 'assistant-1',
              role: 'assistant',
              parts: [
                {
                  type: 'data-pendingTransactionCandidate',
                  id: 'candidate-1',
                  data: {
                    candidate: pendingCandidate,
                    status: 'awaiting_confirmation',
                  },
                },
              ],
            },
            {
              id: 'user-1',
              role: 'user',
              parts: [
                {
                  type: 'text',
                  text: 'looks good but change amount to 25 and save it',
                },
              ],
            },
          ],
        }),
      }),
    );
    const body = await response.text();

    expect(body).toContain('detected both confirmation and an edit request');
  });
});
