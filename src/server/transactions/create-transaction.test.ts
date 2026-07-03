import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTransactionWithCategorySync } from './create-transaction';
import CACHE_TAGS from '@/constants/cache-tags';

const { getTokensFromCookiesMock, revalidateTagMock } = vi.hoisted(() => ({
  getTokensFromCookiesMock: vi.fn(),
  revalidateTagMock: vi.fn(),
}));

vi.mock('@/server/auth', () => ({
  getTokensFromCookies: getTokensFromCookiesMock,
}));

vi.mock('next/cache', () => ({
  revalidateTag: revalidateTagMock,
}));

const baseCategory = {
  id: 'cat-shopping',
  name: 'Shopping',
  color: '#000000',
  type: 'expense' as const,
  monthlyData: {
    '2026-06': {
      limit: 200,
      spent: 40,
    },
  },
};

describe('createTransactionWithCategorySync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTokensFromCookiesMock.mockResolvedValue({ idToken: 'test-token' });
    vi.stubGlobal('fetch', vi.fn());
  });

  it('canonicalizes case-only category names and updates spend with cache invalidation', async () => {
    const createdTransaction = {
      id: 'txn-1',
      amount: 25,
      category: 'Shopping',
      currency: 'EUR' as const,
      date: 'Jun 29, 2026',
      description: 'Groceries',
      type: 'expense' as const,
    };
    const updatedCategory = {
      ...baseCategory,
      monthlyData: {
        '2026-06': {
          limit: 200,
          spent: 65,
        },
      },
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify([baseCategory]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(createdTransaction), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(updatedCategory), { status: 200 }),
      );

    const result = await createTransactionWithCategorySync({
      amount: 25,
      category: 'shopping',
      currency: 'EUR',
      date: 'Jun 29, 2026',
      description: 'Groceries',
      type: 'expense',
    });

    expect(result.canonicalCategoryName).toBe('Shopping');
    expect(result.transaction).toMatchObject(createdTransaction);
    expect(result.category).toMatchObject(updatedCategory);
    expect(result.categories[0]).toMatchObject(updatedCategory);

    const createCall = vi.mocked(fetch).mock.calls[1];
    const createPayload = JSON.parse(
      (createCall[1]?.body as string) ?? '{}',
    ) as {
      category: string;
    };

    expect(createPayload.category).toBe('Shopping');
    expect(revalidateTagMock).toHaveBeenCalledWith(
      CACHE_TAGS.budget.transactions,
      { expire: 0 },
    );
    expect(revalidateTagMock).toHaveBeenCalledWith(
      CACHE_TAGS.budget.categories,
      { expire: 0 },
    );
  });

  it('rejects invalid categories', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([baseCategory]), { status: 200 }),
    );

    await expect(
      createTransactionWithCategorySync({
        amount: 25,
        category: 'Unknown',
        currency: 'EUR',
        date: 'Jun 29, 2026',
        description: 'Groceries',
        type: 'expense',
      }),
    ).rejects.toMatchObject({
      message: 'Category "Unknown" does not exist',
      status: 400,
    });
  });

  it('rejects category/type mismatches', async () => {
    const incomeCategory = {
      ...baseCategory,
      id: 'cat-salary',
      name: 'Salary',
      type: 'income' as const,
    };

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([incomeCategory]), { status: 200 }),
    );

    await expect(
      createTransactionWithCategorySync({
        amount: 25,
        category: 'Salary',
        currency: 'EUR',
        date: 'Jun 29, 2026',
        description: 'Groceries',
        type: 'expense',
      }),
    ).rejects.toMatchObject({
      message: 'Category "Salary" does not support expense transactions',
      status: 400,
    });
  });

  it('rejects ambiguous case-insensitive category matches', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          baseCategory,
          {
            ...baseCategory,
            id: 'cat-shopping-2',
            name: 'SHOPPING',
          },
        ]),
        { status: 200 },
      ),
    );

    await expect(
      createTransactionWithCategorySync({
        amount: 25,
        category: 'shopping',
        currency: 'EUR',
        date: 'Jun 29, 2026',
        description: 'Groceries',
        type: 'expense',
      }),
    ).rejects.toMatchObject({
      message: 'Category "shopping" is ambiguous',
      status: 400,
    });
  });
});
