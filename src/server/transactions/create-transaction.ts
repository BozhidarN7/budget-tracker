import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import CACHE_TAGS from '@/constants/cache-tags';
import { API_BASE_URL } from '@/constants/api';
import { pendingTransactionCandidateSchema } from '@/lib/ai-chat/pending-transaction';
import {
  buildServerAuthHeaders,
  fetchServerCategories,
  validateServerCategory,
} from '@/server/categories';
import type { Category, CurrencyCode, Transaction } from '@/types/budget';
import { applyCategorySpendChange } from '@/utils/transactions/apply-category-spend-change';

const SUPPORTED_CURRENCIES = ['EUR', 'BGN', 'USD', 'GBP'] as const;

export const createTransactionInputSchema = pendingTransactionCandidateSchema;

export type CreateTransactionInput = z.infer<
  typeof createTransactionInputSchema
>;

export class CreateTransactionError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'CreateTransactionError';
    this.status = status;
  }
}

type CreateTransactionResult = {
  canonicalCategoryName: string;
  categories: Category[];
  category: Category;
  transaction: Transaction;
};

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

async function persistTransaction(
  headers: Record<string, string>,
  input: CreateTransactionInput,
) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    body: JSON.stringify(input),
    headers,
    method: 'POST',
  });

  const transaction = await parseJsonResponse<Transaction>(response);

  if (!response.ok || !transaction) {
    throw new CreateTransactionError(
      'Failed to create transaction',
      response.status || 500,
    );
  }

  return transaction;
}

async function persistCategory(
  headers: Record<string, string>,
  categoryId: string,
  monthlyData: Category['monthlyData'],
) {
  const response = await fetch(`${API_BASE_URL}/categorys/${categoryId}`, {
    body: JSON.stringify({ monthlyData }),
    headers,
    method: 'PUT',
  });

  const category = await parseJsonResponse<Category>(response);

  if (!response.ok || !category) {
    throw new CreateTransactionError(
      'Failed to update category spending',
      response.status || 500,
    );
  }

  return category;
}

function validateCategory(
  categories: Category[],
  input: CreateTransactionInput,
) {
  const validation = validateServerCategory(
    categories,
    input.category,
    input.type,
  );

  if (validation.status === 'not_found') {
    throw new CreateTransactionError(
      `Category "${input.category}" does not exist`,
      400,
    );
  }

  if (validation.status === 'ambiguous') {
    throw new CreateTransactionError(
      `Category "${input.category}" is ambiguous`,
      400,
    );
  }

  if (validation.status === 'type_mismatch') {
    throw new CreateTransactionError(
      `Category "${input.category}" does not support ${input.type} transactions`,
      400,
    );
  }

  return validation.category;
}

export async function createTransactionWithCategorySync(
  rawInput: CreateTransactionInput,
): Promise<CreateTransactionResult> {
  const input = createTransactionInputSchema.parse(rawInput);
  const headers = await buildServerAuthHeaders().catch(() => {
    throw new CreateTransactionError('Unauthenticated', 401);
  });
  const categories = await fetchServerCategories(headers).catch((error) => {
    if (
      error instanceof Error &&
      error.message === 'Failed to load categories'
    ) {
      throw new CreateTransactionError(
        'Failed to load categories for transaction validation',
        500,
      );
    }

    throw error;
  });
  const category = validateCategory(categories, input);
  const canonicalInput = {
    ...input,
    category: category.name,
  };
  const transaction = await persistTransaction(headers, canonicalInput);
  const updatedCategoryDraft = applyCategorySpendChange(
    category,
    transaction,
    'add',
  );
  const updatedCategory = await persistCategory(
    headers,
    category.id,
    updatedCategoryDraft.monthlyData,
  );
  const updatedCategories = categories.map((item) =>
    item.id === updatedCategory.id ? updatedCategory : item,
  );

  revalidateTag(CACHE_TAGS.budget.transactions, { expire: 0 });
  revalidateTag(CACHE_TAGS.budget.categories, { expire: 0 });

  return {
    canonicalCategoryName: category.name,
    categories: updatedCategories,
    category: updatedCategory,
    transaction,
  };
}

export const supportedTransactionCurrencies =
  SUPPORTED_CURRENCIES satisfies readonly CurrencyCode[];
