import { generateText } from 'ai';
import { ollama } from 'ai-sdk-ollama';
import z from 'zod';
import {
  type CreateTransactionInput,
  createTransactionInputSchema,
  supportedTransactionCurrencies,
} from '@/server/transactions/create-transaction';

type TransactionCandidateField = keyof CreateTransactionInput;

const candidateExtractionSchema = z.object({
  amount: z.number().positive().optional(),
  category: z.string().trim().min(1).optional(),
  currency: z.enum(supportedTransactionCurrencies).optional(),
  date: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  type: z.enum(['income', 'expense']).optional(),
});

const REQUIRED_FIELDS: TransactionCandidateField[] = [
  'type',
  'amount',
  'currency',
  'category',
  'date',
  'description',
];

function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function normalizeCurrency(value: string) {
  const normalized = value.trim().toUpperCase();

  return supportedTransactionCurrencies.includes(
    normalized as (typeof supportedTransactionCurrencies)[number],
  )
    ? (normalized as CreateTransactionInput['currency'])
    : undefined;
}

function normalizeType(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'income' || normalized === 'expense') {
    return normalized;
  }

  return undefined;
}

function normalizeAmount(value: string) {
  const normalized = value
    .replace(/,/g, '.')
    .replace(/[^0-9.\-]/g, '')
    .trim();
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function normalizeValueByField(
  field: TransactionCandidateField,
  value: string,
) {
  if (field === 'amount') {
    return normalizeAmount(value);
  }

  if (field === 'currency') {
    return normalizeCurrency(value);
  }

  if (field === 'type') {
    return normalizeType(value);
  }

  const normalized = stripWrappingQuotes(value);

  return normalized || undefined;
}

export function extractCandidateFromFieldList(message: string) {
  const candidate: Partial<CreateTransactionInput> = {};
  const fieldMap: Record<string, TransactionCandidateField> = {
    amount: 'amount',
    category: 'category',
    currency: 'currency',
    date: 'date',
    description: 'description',
    type: 'type',
  };

  for (const rawLine of message.split(/\n+/)) {
    const line = rawLine.trim().replace(/,$/, '');
    const match =
      line.match(/^[-*]?\s*([a-zA-Z]+)\s*:\s*(.+)$/) ??
      line.match(/^[-*]?\s*([a-zA-Z]+)\s*=\s*(.+)$/);

    if (!match) {
      continue;
    }

    const [, rawKey, rawValue] = match;
    const field = fieldMap[rawKey.trim().toLowerCase()];

    if (!field) {
      continue;
    }

    const normalized = normalizeValueByField(field, rawValue);

    if (normalized != null) {
      candidate[field] = normalized as never;
    }
  }

  return candidate;
}

async function extractCandidateWithModel(
  message: string,
  mode: 'candidate' | 'patch',
) {
  const prompt =
    mode === 'candidate'
      ? `Extract structured transaction fields from this user request.

Rules:
- The user might provide natural language or a loose field list.
- Accept lines such as "type: expense" and "amount: 20".
- Only include fields that are explicitly present or strongly implied.
- Do not invent missing values.
- Return only these lines when known: type, amount, currency, category, date, description.
- Use the exact format "field: value" with one field per line.
- Do not return JSON, markdown, bullets, or commentary.

User request:
${message}`
      : `Extract only explicit transaction field edits from this user request.

Rules:
- Return only fields the user asked to change.
- Do not infer unchanged fields from history.
- Return only these lines when present: type, amount, currency, category, date, description.
- Use the exact format "field: value" with one field per line.
- Do not return JSON, markdown, bullets, or commentary.
- If no explicit field edit exists, return an empty response.

User request:
${message}`;

  const result = await generateText({
    model: ollama('gemma4:e4b'),
    prompt,
  });

  const parsedCandidate = extractCandidateFromFieldList(result.text);
  const schemaResult = candidateExtractionSchema.safeParse(parsedCandidate);

  return schemaResult.success ? schemaResult.data : {};
}

export async function extractTransactionCandidate(message: string) {
  const fieldListCandidate = extractCandidateFromFieldList(message);
  const hasStructuredFields = Object.keys(fieldListCandidate).length > 0;
  const hasAllFields = REQUIRED_FIELDS.every(
    (field) => fieldListCandidate[field] != null,
  );

  if (hasStructuredFields && hasAllFields) {
    return fieldListCandidate;
  }

  const modelCandidate = await extractCandidateWithModel(message, 'candidate');

  return {
    ...modelCandidate,
    ...fieldListCandidate,
  };
}

export async function extractTransactionPatch(message: string) {
  const fieldListPatch = extractCandidateFromFieldList(message);

  if (Object.keys(fieldListPatch).length > 0) {
    return fieldListPatch;
  }

  return extractCandidateWithModel(message, 'patch');
}

export function getMissingFields(candidate: Partial<CreateTransactionInput>) {
  return REQUIRED_FIELDS.filter((field) => {
    const value = candidate[field];

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    return value == null;
  });
}

export function isCompleteCandidate(
  candidate: Partial<CreateTransactionInput>,
): candidate is CreateTransactionInput {
  return createTransactionInputSchema.safeParse(candidate).success;
}
