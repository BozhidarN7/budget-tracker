import { API_BASE_URL } from '@/constants/api';
import { getTokensFromCookies } from '@/server/auth';
import type { Category } from '@/types/budget';

type AuthHeaders = {
  Authorization: string;
  'Content-Type': 'application/json';
};

export type CategoryValidationResult =
  | {
      category: Category;
      canonicalCategoryName: string;
      status: 'ok';
    }
  | {
      inputCategoryName: string;
      matches: Category[];
      status: 'ambiguous';
    }
  | {
      category: Category;
      expectedType: Category['type'];
      inputCategoryName: string;
      status: 'type_mismatch';
    }
  | {
      inputCategoryName: string;
      status: 'not_found';
    };

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

export async function buildServerAuthHeaders(): Promise<AuthHeaders> {
  const tokens = await getTokensFromCookies();

  if (!tokens?.idToken) {
    throw new Error('Unauthenticated');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokens.idToken}`,
  };
}

export async function fetchServerCategories(
  headers?: AuthHeaders,
): Promise<Category[]> {
  const authHeaders = headers ?? (await buildServerAuthHeaders());
  const response = await fetch(`${API_BASE_URL}/categorys`, {
    cache: 'no-store',
    headers: authHeaders,
    method: 'GET',
  });
  const categories = await parseJsonResponse<Category[]>(response);

  if (!response.ok || !categories) {
    throw new Error('Failed to load categories');
  }

  return categories;
}

export function validateServerCategory(
  categories: Category[],
  inputCategoryName: string,
  expectedType?: Category['type'],
): CategoryValidationResult {
  const exactMatch = categories.find((item) => item.name === inputCategoryName);
  const caseInsensitiveMatches = categories.filter((item) => {
    return item.name.toLowerCase() === inputCategoryName.toLowerCase();
  });
  const matchedCategory = exactMatch ?? caseInsensitiveMatches[0];

  if (!exactMatch && caseInsensitiveMatches.length > 1) {
    return {
      inputCategoryName,
      matches: caseInsensitiveMatches,
      status: 'ambiguous',
    };
  }

  if (!matchedCategory) {
    return {
      inputCategoryName,
      status: 'not_found',
    };
  }

  if (expectedType && matchedCategory.type !== expectedType) {
    return {
      category: matchedCategory,
      expectedType,
      inputCategoryName,
      status: 'type_mismatch',
    };
  }

  return {
    category: matchedCategory,
    canonicalCategoryName: matchedCategory.name,
    status: 'ok',
  };
}
